const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),assets=path.join(root,'assets'),manifest=JSON.parse(fs.readFileSync(path.join(assets,'manifest.json'),'utf8'));
const [action,outfit,state,inputFile]=process.argv.slice(2);
if(!['hoodie','pajamas','winter-puffer','winter-cape'].includes(outfit)||!manifest.states[state])throw Error('Expected: reference|import outfit state [source.png]');
const definition=manifest.states[state],count=definition.delays.length,cols=count===12?4:3,rows=count/cols;
function isolate(data,width,height){
 const seen=new Uint8Array(width*height),queue=new Uint32Array(width*height);let largest=[];
 for(let start=0;start<seen.length;start++){
  if(seen[start]||data[start*4+3]<8)continue;let read=0,write=1;queue[0]=start;seen[start]=1;
  while(read<write){const point=queue[read++],x=point%width;for(const next of [x?point-1:-1,x<width-1?point+1:-1,point-width,point+width])if(next>=0&&next<seen.length&&!seen[next]&&data[next*4+3]>=8){seen[next]=1;queue[write++]=next;}}
  if(write>largest.length)largest=Array.from(queue.subarray(0,write));
 }
 if(largest.length<width*height*.12)throw Error('No sufficiently large character silhouette');
 const keep=new Uint8Array(seen.length);for(const point of largest){const x=point%width,y=Math.floor(point/width);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(x+dx>=0&&x+dx<width&&y+dy>=0&&y+dy<height)keep[(y+dy)*width+x+dx]=1;}
 let left=width,top=height,right=0,bottom=0;for(let point=0;point<keep.length;point++){if(!keep[point])data[point*4+3]=0;if(data[point*4+3]>=8){const x=point%width,y=Math.floor(point/width);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}}
 return {data,box:{left,top,width:right-left+1,height:bottom-top+1}};
}
(async()=>{
 const base=path.join(assets,'outfits',outfit);fs.mkdirSync(base,{recursive:true});
 if(action==='reference'){
  const target=path.join(root,'.cache/wardrobe-reference',outfit,state+'.png');fs.mkdirSync(path.dirname(target),{recursive:true});
  const layers=[];for(let index=0;index<count;index++)layers.push({input:path.join(assets,'frames',definition.sourceFolder||state,String(index).padStart(2,'0')+'.png'),left:(index%cols)*512,top:Math.floor(index/cols)*512});
  await sharp({create:{width:cols*512,height:rows*512,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(layers).png().toFile(target);console.log(JSON.stringify({reference:target,state,cols,rows,count}));return;
 }
 if(action!=='import'||!inputFile)throw Error('Import needs a generated source sheet path');
 const source=path.resolve(inputFile),meta=await sharp(source).metadata();if(!meta.hasAlpha)throw Error('Generated sheet lacks alpha');
 const pieces=[];for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
  const left=Math.round(col*meta.width/cols),top=Math.round(row*meta.height/rows),width=Math.round((col+1)*meta.width/cols)-left,height=Math.round((row+1)*meta.height/rows)-top;
  const data=await sharp(source).extract({left,top,width,height}).ensureAlpha().raw().toBuffer();pieces.push({...isolate(data,width,height),width,height});
 }
 const scale=Math.min(464/Math.max(...pieces.map(piece=>piece.box.width)),464/Math.max(...pieces.map(piece=>piece.box.height)));
 const target=path.join(base,'frames',state);fs.mkdirSync(target,{recursive:true});
 for(let index=0;index<pieces.length;index++){
  const piece=pieces[index],width=Math.round(piece.box.width*scale),height=Math.round(piece.box.height*scale);
  const data=await sharp(piece.data,{raw:{width:piece.width,height:piece.height,channels:4}}).extract(piece.box).resize(width,height).png().toBuffer();
  await sharp({create:{width:512,height:512,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:data,left:Math.round((512-width)/2),top:488-height}]).png().toFile(path.join(target,String(index).padStart(2,'0')+'.png'));
 }
 const sheets=path.join(base,'source-sheets');fs.mkdirSync(sheets,{recursive:true});const stored=path.join(sheets,state+'.png');if(path.resolve(stored)!==source)fs.copyFileSync(source,stored);
 console.log(JSON.stringify({outfit,state,frames:count,sourceDimensions:[meta.width,meta.height],scale,target}));
})().catch(error=>{console.error(error);process.exitCode=1;});
