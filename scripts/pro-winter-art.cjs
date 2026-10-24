const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const base=path.resolve(__dirname,'../assets/forms/pro/outfits');
const groups={poses1:['idle','thinking','generating','success','error','begging'],poses2:['dragging','drop','sleeping','petting','pouting','transform-out'],mealA:Array(6).fill('eating'),mealB:Array(6).fill('eating')};
function component(data,w,h,accept,all=false){
 const seen=new Uint8Array(w*h),queue=new Uint32Array(w*h);let largest=[],components=[];
 for(let p=0;p<seen.length;p++){
  if(seen[p]||!accept(p%w,Math.floor(p/w),p*4))continue;let read=0,count=1;queue[0]=p;seen[p]=1;
  while(read<count){const n=queue[read++],x=n%w;for(const q of [x?n-1:-1,x<w-1?n+1:-1,n-w,n+w])if(q>=0&&q<seen.length&&!seen[q]&&accept(q%w,Math.floor(q/w),q*4)){seen[q]=1;queue[count++]=q;}}
  if(all)components.push(Array.from(queue.subarray(0,count)));else if(count>largest.length)largest=Array.from(queue.subarray(0,count));
 }
 return all?components.sort((a,b)=>b.length-a.length):largest;
}
async function normalize(input){
 const{data,info:{width:w,height:h}}=await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const silhouette=component(data,w,h,(x,y,i)=>data[i+3]>=8);if(silhouette.length<w*h*.1)throw Error('No complete character silhouette');
 const keep=new Uint8Array(w*h);for(const p of silhouette)keep[p]=1;
 let minX=w,minY=h,maxX=0,maxY=0;
 for(let p=0;p<keep.length;p++){if(!keep[p]){data[p*4+3]=0;continue;}const x=p%w,y=Math.floor(p/w);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
 const skin=component(data,w,h,(x,y,i)=>data[i+3]>=128&&x>w*.2&&x<w*.84&&y>minY+(maxY-minY)*.05&&y<minY+(maxY-minY)*.28&&data[i]>180&&data[i]>data[i+1]*1.07&&data[i]>data[i+2]*1.1);
 if(skin.length<w*h*.002)throw Error('Missing face landmark');
 const face=skin.reduce((a,p)=>[a[0]+p%w,a[1]+Math.floor(p/w)],[0,0]).map(n=>n/skin.length),scale=(744-180)/(maxY-face[1]);
 const width=Math.round((maxX-minX+1)*scale),height=Math.round((maxY-minY+1)*scale),left=Math.round(260+(minX-face[0])*scale),top=744-height;
 if(left<6||left+width>506||top<8)throw Error('Source needs wider margins: '+JSON.stringify({left,top,width,height,scale}));
 const cut=await sharp(data,{raw:{width:w,height:h,channels:4}}).extract({left:minX,top:minY,width:maxX-minX+1,height:maxY-minY+1}).resize(width,height).png().toBuffer();
 const bytes=await sharp({create:{width:512,height:768,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:cut,left,top}]).png().toBuffer();
 return{bytes,proof:{face,scale,box:{left,top,width,height},sourceEdges:{minX,minY,maxX,maxY,w,h}}};
}
async function importSheet(id,group,file){
 if(!['winter-puffer','winter-cape'].includes(id)||!groups[group])throw Error('Unknown outfit or sheet group');
 const folder=path.join(base,id),meta=await sharp(file).metadata();if(!meta.hasAlpha)throw Error('Real alpha required');
 fs.mkdirSync(path.join(folder,'source-sheets'),{recursive:true});fs.copyFileSync(file,path.join(folder,'source-sheets',group+'.png'));
 const mf=path.join(folder,'manifest.json'),manifest=fs.existsSync(mf)?JSON.parse(fs.readFileSync(mf,'utf8')):{frameWidth:512,frameHeight:768,spriteWidth:320,spriteHeight:480,states:{},imports:{}};
 const proofs=[],cells=[];
 // Generated sheets have uneven gutters. Find whole connected drawings within
 // each row instead of cutting hair at an assumed equal column boundary.
 for(let row=0;row<2;row++){
  const top=Math.round(meta.height*row/2),height=Math.round(meta.height*(row+1)/2)-top;
  const{data,info}=await sharp(file).extract({left:0,top,width:meta.width,height}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const pieces=component(data,info.width,height,(x,y,i)=>data[i+3]>=8,true).slice(0,3);
  if(pieces.length!==3||pieces.some(p=>p.length<info.width*height*.04))throw Error('Expected three separate complete drawings per row');
  const boxes=pieces.map(points=>{let left=info.width,right=0,y0=height,y1=0;for(const p of points){left=Math.min(left,p%info.width);right=Math.max(right,p%info.width);y0=Math.min(y0,Math.floor(p/info.width));y1=Math.max(y1,Math.floor(p/info.width));}return{left,top:top+y0,width:right-left+1,height:y1-y0+1};}).sort((a,b)=>a.left-b.left);
  cells.push(...boxes);
 }
 for(let i=0;i<6;i++){
  const {bytes,proof}=await normalize(await sharp(file).extract(cells[i]).png().toBuffer()),state=groups[group][i],index=group==='mealB'?i+6:group==='mealA'?i:0;
  const dest=path.join(folder,'frames',state);fs.mkdirSync(dest,{recursive:true});fs.writeFileSync(path.join(dest,String(index).padStart(2,'0')+'.png'),bytes);
  manifest.states[state]={...manifest.states[state],frames:state==='eating'?12:1};proofs.push({state,index,sourceBox:cells[i],...proof});
 }
 manifest.imports[group]=proofs;fs.writeFileSync(mf,JSON.stringify(manifest,null,2)+'\n');return{id,group,poses:proofs.length};
}
if(require.main===module)importSheet(...process.argv.slice(2)).then(r=>console.log(JSON.stringify(r))).catch(e=>{console.error(e);process.exitCode=1;});
module.exports={importSheet,normalize,component};
