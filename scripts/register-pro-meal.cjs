const sharp=require('sharp');

// Geometric atlas registration only: retain every complete source drawing.
// Face and shoes anchor the pose without compositing independently drawn limbs.
function landmarks(data,width,height,{headband=false}={}){
 const skin=new Uint8Array(width*height),seen=new Uint8Array(width*height),queue=new Uint32Array(width*height);
 let footLeft=width,footRight=-1,footBottom=-1,headbandTop=height;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const p=y*width+x,i=p*4,r=data[i],g=data[i+1],b=data[i+2],a=data[i+3];if(a<128)continue;
  if(y>=height*.9){footLeft=Math.min(footLeft,x);footRight=Math.max(footRight,x);footBottom=Math.max(footBottom,y);}
  // Winter feeding hands can touch the chin, so use the expression-independent
  // white lace headband there. Existing maid assets retain their face anchor.
  const match=headband?y>height*.035&&y<height*.19&&r>175&&g>175&&b>175&&Math.abs(r-b)<20&&g>=r*.92:y>height*.1&&y<height*.29&&r>180&&r>g*1.07&&r>b*1.1;
  if(x>width*.32&&x<width*.72&&match){skin[p]=1;if(headband)headbandTop=Math.min(headbandTop,y);}
 }
 // The top lace arc is separate from white sclera farther down the face.
 if(headband)for(let p=0;p<skin.length;p++)if(Math.floor(p/width)>headbandTop+height*.04)skin[p]=0;
 let largest=null;
 if(headband){let count=0,sx=0,sy=0;for(let p=0;p<skin.length;p++)if(skin[p]){count++;sx+=p%width;sy+=Math.floor(p/width);}if(count)largest={count,x:sx/count,y:sy/count};}
 for(let start=0;start<skin.length;start++){
  if(headband)break;
  if(!skin[start]||seen[start])continue;let read=0,count=1,sx=0,sy=0;queue[0]=start;seen[start]=1;
  while(read<count){const p=queue[read++],x=p%width,y=Math.floor(p/width);sx+=x;sy+=y;for(const next of [x?p-1:-1,x<width-1?p+1:-1,p-width,p+width])if(next>=0&&next<skin.length&&skin[next]&&!seen[next]){seen[next]=1;queue[count++]=next;}}
  if(!largest||count>largest.count)largest={count,x:sx/count,y:sy/count};
 }
 if(!largest||largest.count<width*height*(headband?.0004:.003)||footRight<footLeft)throw Error('Cannot register Pro meal head and shoes');
 return{face:[largest.x,largest.y],feet:[(footLeft+footRight)/2,footBottom]};
}
function registration(source,target){
 const [sx,sy]=source.feet,[tx,ty]=target.feet,vx=source.face[0]-sx,vy=source.face[1]-sy,ux=target.face[0]-tx,uy=target.face[1]-ty,n=vx*vx+vy*vy;
 const a=(vx*ux+vy*uy)/n,b=(vx*uy-vy*ux)/n,e=tx-a*sx+b*sy,f=ty-b*sx-a*sy;
 const scale=Math.hypot(a,b),angle=Math.atan2(b,a)*180/Math.PI;
 if(scale<.9||scale>1.1||Math.abs(angle)>6)throw Error('Pro meal source needs visual review before registration');
 return{matrix:[a,b,-b,a,e,f],scale,angle};
}
async function registerMeal(frames,options={}){
 const anchors=[];for(const bytes of frames){const{data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});anchors.push(landmarks(data,info.width,info.height,options));}
 const {width,height}=await sharp(frames[0]).metadata(),target=anchors[0],output=[],transforms=[];
 for(let index=0;index<frames.length;index++){
  const transform=registration(anchors[index],target);transforms.push(transform);
  const svg=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'"><image width="'+width+'" height="'+height+'" xlink:href="data:image/png;base64,'+frames[index].toString('base64')+'" transform="matrix('+transform.matrix.join(' ')+')"/></svg>');
  output.push(await sharp(svg).png().toBuffer());
 }
 return{frames:output,alignment:{method:options.headband?'complete-frame headband-and-shoes registration':'complete-frame face-and-shoes registration',reference:0,...options.headband?{landmarkMode:'headband'}:{},anchors,transforms,target}};
}
module.exports={registerMeal,landmarks,registration};
