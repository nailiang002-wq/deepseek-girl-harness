const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp'),{component}=require('./pro-winter-art.cjs');
const base=path.resolve(__dirname,'../assets/forms/pro/outfits');
const percent=([x,y])=>(x/512*100).toFixed(4)+'% '+(y/768*100).toFixed(4)+'%';
function rig(edge){
 const first=edge[0],last=edge.at(-1),body=[[0,0],[512,0],[512,768],[0,768],[0,last[1]],...edge.toReversed(),[0,first[1]]],tail=[[0,first[1]],...edge.map(([x,y])=>[x+2,y]),[0,last[1]]];
 return{bodyClip:'polygon('+body.map(percent).join(',')+')',tailClip:'polygon('+tail.map(percent).join(',')+')',origin:percent([last[0]+5,last[1]-8]),edge};
}
(async()=>{for(const id of ['winter-puffer','winter-cape']){
 const folder=path.join(base,id),file=path.join(folder,'manifest.json'),m=JSON.parse(fs.readFileSync(file,'utf8'));
 for(const[state,def]of Object.entries(m.states)){
  const{data,info:{width:w,height:h}}=await sharp(path.join(folder,'frames',state,'00.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let headTop=h,headLeft=w,headRight=0;
  for(let y=20;y<150;y++)for(let x=150;x<370;x++){const i=(y*w+x)*4;if(data[i+3]>128&&Math.min(data[i],data[i+1],data[i+2])>210&&Math.max(data[i],data[i+1],data[i+2])-Math.min(data[i],data[i+1],data[i+2])<45){headTop=Math.min(headTop,y);headLeft=Math.min(headLeft,x);headRight=Math.max(headRight,x);}}
  if(headTop===h)throw Error('Missing winter headband');
  def.hat={left:(((headLeft+headRight)/2+5)/512*100-15.5).toFixed(3)+'%',top:((headTop+8)/768*100).toFixed(3)+'%',width:'31%'};
  if(state==='eating'||state==='transform-out')continue;
  const tail=component(data,w,h,(x,y,i)=>x<120&&y>280&&y<580&&data[i+3]>=128);if(tail.length<400)throw Error('Missing tail '+id+'/'+state);
  let minX=w,minY=h;for(const p of tail){minX=Math.min(minX,p%w);minY=Math.min(minY,Math.floor(p/w));}
  const secondary=['dragging','drop','sleeping','petting','pouting'].includes(state);
  const edge=id==='winter-puffer'?[[165,368],[161,405],[150,446],[136,493],[121,539]]:secondary?[[144,322],[150,351],[138,400],[121,444],[159,486],[148,519]]:[[160,340],[170,366],[159,410],[141,452],[172,491],[160,523]];
  const anchor=id==='winter-puffer'?[45,370]:secondary?[23,327]:[54,348],dx=Math.round((minX-anchor[0])*.45),dy=minY-anchor[1];
  const proposed=edge.map(([x,y])=>[x+dx,y+dy]),guarded=[];
  // Trace the existing garment edge: ivory fur, a cream coat, or gold trim must
  // remain on the fixed-body side instead of moving with the blue tail.
  for(let y=proposed[0][1];y<=proposed.at(-1)[1];y++){
   const k=proposed.findIndex((p,i)=>i&&y<=p[1]),p=proposed[Math.max(0,k-1)],q=proposed[Math.max(1,k)];
   let x=p[0]+(q[0]-p[0])*(y-p[1])/(q[1]-p[1]);
   for(let col=0;col<x;col++){const i=(y*w+col)*4;if(data[i+3]>=128&&data[i]>150&&data[i+1]>120){x=Math.min(x,col-4);break;}}
   guarded.push([Math.max(0,Math.floor(x)),y]);
  }
  def.tailRig=rig(guarded);
 }
 fs.writeFileSync(file,JSON.stringify(m,null,2)+'\n');console.log(JSON.stringify({id,states:Object.keys(m.states).length}));
}})().catch(e=>{console.error(e);process.exitCode=1;});
