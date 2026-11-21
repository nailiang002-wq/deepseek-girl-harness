const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..');
function anchors(data,width,height,portrait){
 let top=height,bottom=-1;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(data[(y*width+x)*4+3]>=128){top=Math.min(top,y);bottom=Math.max(bottom,y);}
 if(bottom<top)throw Error('Missing transparent character');
 if(portrait){
  let bandTop=height;
  for(let y=top;y<height*.3;y++)for(let x=Math.floor(width*.25);x<width*.75;x++){const i=(y*width+x)*4;if(data[i+3]>160&&data[i]>180&&data[i+1]>175&&data[i+2]>175&&Math.abs(data[i]-data[i+2])<25)bandTop=Math.min(bandTop,y);}
  let count=0,sx=0,sy=0;
  for(let y=bandTop;y<Math.min(height,bandTop+height*.035);y++)for(let x=Math.floor(width*.25);x<width*.75;x++){const i=(y*width+x)*4;if(data[i+3]>160&&data[i]>180&&data[i+1]>175&&data[i+2]>175&&Math.abs(data[i]-data[i+2])<25){count++;sx+=x;sy+=y;}}
  let feetY=-1,feetLeft=width,feetRight=0;
  for(let y=Math.floor(height*.7);y<height;y++)for(let x=Math.floor(width*.37);x<width*.62;x++)if(data[(y*width+x)*4+3]>=160)feetY=Math.max(feetY,y);
  for(let y=Math.max(0,feetY-4);y<=feetY;y++)for(let x=Math.floor(width*.37);x<width*.62;x++)if(data[(y*width+x)*4+3]>=160){feetLeft=Math.min(feetLeft,x);feetRight=Math.max(feetRight,x);}
  if(!count||feetY<0)throw Error('Missing headband or shoes');
  return{head:[sx/count,sy/count],feet:[(feetLeft+feetRight)/2,feetY]};
 }
 let left=width,right=0;
 for(let y=Math.floor(top+height*.1);y<top+height*.4;y++)for(let x=0;x<width;x++){
  const i=(y*width+x)*4;
  if(data[i+3]>=160&&data[i+2]>data[i]*1.12&&data[i+2]>data[i+1]*1.08){left=Math.min(left,x);right=Math.max(right,x);}
 }
 if(right<=left)throw Error('Missing chibi head landmark');
 return{head:[(left+right)/2,top],span:right-left};
}
function matrix(source,target,portrait){
 if(!portrait){const scale=target.span/source.span;return[scale,0,0,scale,target.head[0]-scale*source.head[0],target.head[1]-scale*source.head[1]];}
 const [sx,sy]=source.feet,[tx,ty]=target.feet,vx=source.head[0]-sx,vy=source.head[1]-sy,ux=target.head[0]-tx,uy=target.head[1]-ty,n=vx*vx+vy*vy;
 const a=(vx*ux+vy*uy)/n,b=(vx*uy-vy*ux)/n;
 return[a,b,-b,a,tx-a*sx+b*sy,ty-b*sx-a*sy];
}
function compose(a,b){return[a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]];}
async function importSheet(job,file){
 const meta=await sharp(file).metadata();if(!meta.hasAlpha)throw Error('Actual PNG alpha required');
 const reference=await sharp(path.join(root,job.folder,'eating/00.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const width=512,height=job.pro?768:512,target=anchors(reference.data,reference.info.width,reference.info.height,job.pro);
 const destination=path.join(root,'assets/after-meal',job.id);
 fs.mkdirSync(path.join(destination,'frames'),{recursive:true});
 fs.copyFileSync(file,path.join(destination,'source-sheet.png'));
 const transforms=[],proofs=[],cells=[];
 for(let index=0;index<6;index++){
  const col=index%3,row=Math.floor(index/3),left=Math.round(col*meta.width/3),top=Math.round(row*meta.height/2);
  const cell=await sharp(file).extract({left,top,width:Math.round((col+1)*meta.width/3)-left,height:Math.round((row+1)*meta.height/2)-top}).png().toBuffer();
  const raw=await sharp(cell).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const source=anchors(raw.data,raw.info.width,raw.info.height,job.pro);
  cells.push({cell,raw,transform:matrix(source,target,job.pro)});
 }
 let fit=1;
 if(!job.pro){
  for(const {raw,transform} of cells)for(let y=0;y<raw.info.height;y++)for(let x=0;x<raw.info.width;x++){
   if(raw.data[(y*raw.info.width+x)*4+3]<8)continue;
   const px=transform[0]*x+transform[2]*y+transform[4],py=transform[1]*x+transform[3]*y+transform[5],dx=px-target.head[0],dy=py-target.head[1];
   if(dx<0)fit=Math.min(fit,(target.head[0]-20)/-dx);else if(dx>0)fit=Math.min(fit,(width-20-target.head[0])/dx);
   if(dy>0)fit=Math.min(fit,(height-20-target.head[1])/dy);
  }
  target.span*=fit;
 }
 for(let index=0;index<6;index++){
  const {cell,raw}=cells[index];
  let transform=compose([fit,0,0,fit,target.head[0]*(1-fit),target.head[1]*(1-fit)],cells[index].transform),output,measured;
  for(let attempt=0;attempt<4;attempt++){
   const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><image href="data:image/png;base64,${cell.toString('base64')}" width="${raw.info.width}" height="${raw.info.height}" transform="matrix(${transform.join(' ')})"/></svg>`);
   output=await sharp(svg).png().toBuffer();
   measured=anchors(await sharp(output).ensureAlpha().raw().toBuffer(),width,height,job.pro);
   const error=Math.hypot(measured.head[0]-target.head[0],measured.head[1]-target.head[1]);
   if(error<.7)break;
   const correction=job.pro?matrix(measured,target,true):[1,0,0,1,target.head[0]-measured.head[0],target.head[1]-measured.head[1]];
   transform=compose(correction,transform);
  }
  // Remove low-alpha export haze before atlas packing; retain the complete drawing.
  const clean=await sharp(output).ensureAlpha().raw().toBuffer();
  for(let pixel=3;pixel<clean.length;pixel+=4)if(clean[pixel]<32)clean[pixel]=0;
  output=await sharp(clean,{raw:{width,height,channels:4}}).png().toBuffer();
  transforms.push(transform);
  proofs.push(measured);
  fs.writeFileSync(path.join(destination,'frames',String(index).padStart(2,'0')+'.png'),output);
 }
 const original=job.id==='pro'?null:job.id.startsWith('pro-')?JSON.parse(fs.readFileSync(path.join(root,'assets/forms/pro/outfits',job.id.slice(4),'manifest.json'),'utf8')).states.eating:null;
 const hat=job.pro?original?.hat:{left:(20+30*(1-fit)).toFixed(3)+'%',top:'11%',width:(60*fit).toFixed(3)+'%'};
 const manifest={outfit:job.id,portrait:job.pro,frames:6,width,height,stages:['empty-basin','raise-napkin','wipe-mouth','pat-tummy','lower-basin','rest'],hat,alignment:{method:job.pro?'complete-frame headband and shoes':'complete-frame hair span and top',fit,target,transforms,measured:proofs},generation:{mode:'built-in image_gen',reference:job.folder+'/eating/00.png',transparentBackground:true,prompt:job.prompt}};
 fs.writeFileSync(path.join(destination,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 return{outfit:job.id,frames:6,source:[meta.width,meta.height],headError:Math.max(...proofs.map(p=>Math.hypot(p.head[0]-target.head[0],p.head[1]-target.head[1])))};
}
if(require.main===module){const jobs=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));(async()=>{for(const job of jobs)if(job.output)console.log(JSON.stringify(await importSheet(job,job.output)));})().catch(error=>{console.error(error);process.exitCode=1;});}
module.exports={anchors,importSheet};
