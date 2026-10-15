const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),assets=path.join(root,'assets');
const sheets=[['eating-v2',4,3],['petting',3,2],['pouting',3,2]];
function isolate(data,width,height){
  const visited=new Uint8Array(width*height),queue=new Uint32Array(width*height);let largest=[];
  for(let start=0;start<visited.length;start++){
    if(visited[start]||data[start*4+3]<8)continue;let head=0,tail=1;queue[0]=start;visited[start]=1;
    while(head<tail){const p=queue[head++],x=p%width;for(const n of [x>0?p-1:-1,x<width-1?p+1:-1,p-width,p+width])if(n>=0&&n<visited.length&&!visited[n]&&data[n*4+3]>=8){visited[n]=1;queue[tail++]=n;}}
    if(tail>largest.length)largest=Array.from(queue.subarray(0,tail));
  }
  if(largest.length<width*height*.15)throw Error('Missing character silhouette');
  const keep=new Uint8Array(visited.length);for(const p of largest){const x=p%width,y=Math.floor(p/width);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(x+dx>=0&&x+dx<width&&y+dy>=0&&y+dy<height)keep[(y+dy)*width+x+dx]=1;}
  let left=width,top=height,right=0,bottom=0;for(let p=0;p<keep.length;p++){if(!keep[p])data[p*4+3]=0;if(data[p*4+3]>=8){const x=p%width,y=Math.floor(p/width);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}}
  return {data,box:{left,top,width:right-left+1,height:bottom-top+1}};
}
(async()=>{
  const report={};
  for(const [state,cols,rows]of sheets){
    const file=path.join(assets,'source-sheets/v1.5.0',state+'.png'),meta=await sharp(file).metadata();if(!meta.hasAlpha)throw Error(state+': source has no alpha');
    const pieces=[];for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
      const left=Math.round(col*meta.width/cols),top=Math.round(row*meta.height/rows),width=Math.round((col+1)*meta.width/cols)-left,height=Math.round((row+1)*meta.height/rows)-top;
      const data=await sharp(file).extract({left,top,width,height}).ensureAlpha().raw().toBuffer();const piece=isolate(data,width,height);pieces.push({...piece,width,height});
    }
    const scale=Math.min(464/Math.max(...pieces.map(p=>p.box.width)),464/Math.max(...pieces.map(p=>p.box.height)));
    const destination=path.join(assets,'frames',state);fs.mkdirSync(destination,{recursive:true});
    for(let index=0;index<pieces.length;index++){
      const p=pieces[index],width=Math.round(p.box.width*scale),height=Math.round(p.box.height*scale);
      const input=await sharp(p.data,{raw:{width:p.width,height:p.height,channels:4}}).extract(p.box).resize(width,height).png().toBuffer();
      await sharp({create:{width:512,height:512,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input,left:Math.round((512-width)/2),top:488-height}]).png().toFile(path.join(destination,String(index).padStart(2,'0')+'.png'));
    }
    report[state]={frames:pieces.length,sourceDimensions:[meta.width,meta.height],scale};
  }
  const manifestFile=path.join(assets,'manifest.json'),manifest=JSON.parse(fs.readFileSync(manifestFile,'utf8'));
  manifest.states.eating={label:'开心吃白饭',delays:[280,240,240,240,320,380,360,360,420,420,500,600],loop:false,sourceFolder:'eating-v2'};
  manifest.states.petting={label:'被摸头',delays:[200,260,380,380,320,260],loop:false};
  manifest.states.pouting={label:'鼓脸啦',delays:[350,250,350,250,300,300],loop:false};
  fs.writeFileSync(manifestFile,JSON.stringify(manifest,null,2)+'\n');
  fs.mkdirSync(path.join(root,'.cache'),{recursive:true});fs.writeFileSync(path.join(root,'.cache/sprite-import-v1.5.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
})().catch(error=>{console.error(error);process.exitCode=1;});
