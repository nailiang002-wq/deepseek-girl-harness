const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),base=path.join(root,'assets/forms/pro');
const [state,input,columnArg,gridYArg,anchorArg]=process.argv.slice(2);
const definitions={...JSON.parse(fs.readFileSync(path.join(root,'assets/manifest.json'),'utf8')).states,
 'transform-in':{delays:[160,180,180,180,180,220],loop:false},
 'transform-out':{delays:[180,180,180,180,180,200],loop:false}};
if(!definitions[state]||!input)throw Error('Expected: node scripts/pro-art.cjs state generated-sheet.png');
const count=definitions[state].delays.length,cols=columnArg?Number(columnArg):count===12?4:3,rows=count/cols;
if(![3,4].includes(cols)||!Number.isInteger(rows))throw Error('Use a 3-column or 4-column equal grid');
const gridY=Number(gridYArg||0),centered=anchorArg==='bounds';
if(!Number.isFinite(gridY)||gridY<0||gridY>32)throw Error('Invalid row origin');
function isolate(data,width,height){
 const seen=new Uint8Array(width*height),queue=new Uint32Array(width*height);let largest=[];
 for(let start=0;start<seen.length;start++){
  if(seen[start]||data[start*4+3]<8)continue;let read=0,write=1;queue[0]=start;seen[start]=1;
  while(read<write){const point=queue[read++],x=point%width;for(const next of [x?point-1:-1,x<width-1?point+1:-1,point-width,point+width])if(next>=0&&next<seen.length&&!seen[next]&&data[next*4+3]>=8){seen[next]=1;queue[write++]=next;}}
  if(write>largest.length)largest=Array.from(queue.subarray(0,write));
 }
 if(largest.length<width*height*.10)throw Error('No character silhouette');
 const keep=new Uint8Array(seen.length);for(const point of largest){const x=point%width,y=Math.floor(point/width);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(x+dx>=0&&x+dx<width&&y+dy>=0&&y+dy<height)keep[(y+dy)*width+x+dx]=1;}
 let left=width,top=height,right=0,bottom=0;for(let point=0;point<keep.length;point++){if(!keep[point])data[point*4+3]=0;if(data[point*4+3]>=8){const x=point%width,y=Math.floor(point/width);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}}
 return{data,width,height,box:{left,top,width:right-left+1,height:bottom-top+1}};
}
(async()=>{
 const meta=await sharp(input).metadata();if(!meta.hasAlpha)throw Error('Generated image has no alpha');
 const pieces=[];for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
  const left=Math.round(col*meta.width/cols),top=Math.round(row*meta.height/rows)+gridY,width=Math.round((col+1)*meta.width/cols)-left,height=Math.min(meta.height,Math.round((row+1)*meta.height/rows)+gridY)-top;
  pieces.push(isolate(await sharp(input).extract({left,top,width,height}).ensureAlpha().raw().toBuffer(),width,height));
 }
 // Keep the grid's horizontal anchor so an extended arm does not shift her face.
 const anchor=p=>centered?p.box.left+p.box.width/2:p.width/2;
 const half=Math.max(...pieces.map(p=>Math.max(anchor(p)-p.box.left,p.box.left+p.box.width-anchor(p))));
 const scale=Math.min(232/half,720/Math.max(...pieces.map(p=>p.box.height)));
 const folder=path.join(base,'frames',state);fs.mkdirSync(folder,{recursive:true});
 for(let index=0;index<pieces.length;index++){
  const p=pieces[index],width=Math.round(p.box.width*scale),height=Math.round(p.box.height*scale),left=Math.round(256+(p.box.left-anchor(p))*scale);
  const buffer=await sharp(p.data,{raw:{width:p.width,height:p.height,channels:4}}).extract(p.box).resize(width,height).png().toBuffer();
  await sharp({create:{width:512,height:768,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:buffer,left:Math.max(20,Math.min(492-width,left)),top:744-height}]).png().toFile(path.join(folder,String(index).padStart(2,'0')+'.png'));
 }
 fs.mkdirSync(path.join(base,'source-sheets'),{recursive:true});fs.copyFileSync(input,path.join(base,'source-sheets',state+'.png'));
 fs.writeFileSync(path.join(base,'manifest.json'),JSON.stringify({frameWidth:512,frameHeight:768,spriteWidth:320,spriteHeight:480,states:definitions},null,2)+'\n');
 console.log(JSON.stringify({state,frames:count,dimensions:[512,768],scale}));
})().catch(error=>{console.error(error);process.exitCode=1;});
