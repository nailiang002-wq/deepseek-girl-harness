const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const {registerMeal}=require('./register-pro-meal.cjs');
const root=path.resolve(__dirname,'..'),source=path.join(root,'assets');
const definitions=JSON.parse(fs.readFileSync(path.join(source,'manifest.json'),'utf8')).states;
const outfits=['maid','hoodie','pajamas','winter-puffer','winter-cape'];
function playback(state,definition){
 const count=definition.delays.length,repeats=state==='eating'?3:1;
 const sequence=Array.from({length:count*repeats},(_,index)=>index%count);
 return {count,sequence,delays:sequence.map(index=>definition.delays[index]),biteCount:state==='eating'?repeats:undefined};
}
async function buildOutfit(outfit,portrait=false){
 const assets={};
 const states=portrait?JSON.parse(fs.readFileSync(path.join(source,'forms/pro/manifest.json'),'utf8')).states:definitions;
 const frameWidth=320,frameHeight=portrait?480:320;
 for(const [state,definition]of Object.entries(states)){
  const plan=playback(state,definition);let frames=[],alignment;
  const folder=portrait?path.join(source,'forms/pro/frames',state):outfit==='maid'?path.join(source,'frames',definition.sourceFolder||state):path.join(source,'outfits',outfit,'frames',state);
  for(let index=0;index<plan.count;index++){
   const file=path.join(folder,String(index).padStart(2,'0')+'.png');
   if(!fs.existsSync(file))throw Error(`Missing ${outfit}/${state} frame ${index}: ${file}`);
   frames.push(await sharp(file).resize(frameWidth,frameHeight).png().toBuffer());
  }
  if(portrait&&state==='eating'){
   const registered=await registerMeal(frames);frames=registered.frames;alignment=registered.alignment;
   const proof=path.join(root,'.cache/pro-meal-registered');fs.mkdirSync(proof,{recursive:true});
   for(let index=0;index<frames.length;index++)fs.writeFileSync(path.join(proof,String(index).padStart(2,'0')+'.png'),frames[index]);
  }
  const strip=await sharp({create:{width:plan.count*frameWidth,height:frameHeight,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(frames.map((input,index)=>({input,left:index*frameWidth,top:0}))).webp({quality:90,alphaQuality:100}).toBuffer();
  const still=await sharp(frames[0]).webp({quality:90,alphaQuality:100}).toBuffer();
  assets[state]={strip:'data:image/webp;base64,'+strip.toString('base64'),still:'data:image/webp;base64,'+still.toString('base64'),...plan,duration:plan.delays.reduce((sum,delay)=>sum+delay,0),loop:definition.loop,outfit,...alignment?{alignment}:{}};
 }
 return assets;
}
(async()=>{
 const all={};for(const outfit of outfits)all[outfit]=await buildOutfit(outfit);
 const pro=await buildOutfit('pro',true);
 const spriteCSS=Object.entries({...all.maid,'transform-in':pro['transform-in'],'transform-out':pro['transform-out']}).map(([state,asset])=>{
  let elapsed=0;const stops=asset.delays.map((delay,index)=>{const position=asset.sequence[index],stop=`${(elapsed/asset.duration*100).toFixed(6)}%{transform:translate3d(${(-position/asset.count*100).toFixed(6)}%,0,0)}`;elapsed+=delay;return stop;});
  stops.push(`100%{transform:translate3d(${asset.loop?0:(-asset.sequence.at(-1)/asset.count*100).toFixed(6)}%,0,0)}`);
  return `@keyframes dsg-frames-${state}{${stops.join('')}}`;
 }).join('\n');
 const props={};for(const id of ['hat','rice']){const bytes=await sharp(path.join(source,'props',id+'.png')).resize({width:320}).webp({quality:92,alphaQuality:100}).toBuffer();props[id]='data:image/webp;base64,'+bytes.toString('base64');}
 const font=fs.readFileSync(path.join(source,'fonts/greeting-hand.woff2'));
 const template=fs.readFileSync(path.join(root,'client.template.js'),'utf8');
 if(!template.includes('__OUTFIT_ASSETS__'))throw Error('Wardrobe client template is required');
 const code=template.replace('__ASSETS__',()=>JSON.stringify(all.maid)).replace('__OUTFIT_ASSETS__',()=>JSON.stringify(Object.fromEntries(Object.entries(all).filter(([id])=>id!=='maid')))).replace('__PRO_ASSETS__',()=>JSON.stringify(pro)).replace('__PROPS__',()=>JSON.stringify(props)).replace('__GREETING_FONT__',()=>'data:font/woff2;base64,'+font.toString('base64')).replace('__SPRITE_CSS__',()=>spriteCSS).replace('__LOGIC__',()=>fs.readFileSync(path.join(root,'logic.js'),'utf8').replace(/export /g,'')).replace('__MODEL_FORM__',()=>fs.readFileSync(path.join(root,'model-form.js'),'utf8').replace(/export /g,'')).replace('__PRO_MOTION__',()=>fs.readFileSync(path.join(root,'pro-motion.js'),'utf8').replace(/export /g,'')).replace('__FINANCE__',()=>fs.readFileSync(path.join(root,'finance-protocol.js'),'utf8').replace(/export /g,'')+'\n'+fs.readFileSync(path.join(root,'finance-client.js'),'utf8'));
 if(/__[A-Z_]+__/.test(code))throw Error('Unresolved build placeholder');
 fs.writeFileSync(path.join(root,'client.js'),code);
 fs.mkdirSync(path.join(root,'.cache'),{recursive:true});
 fs.writeFileSync(path.join(root,'.cache/animation-assets.json'),JSON.stringify(all.maid));
 fs.writeFileSync(path.join(root,'.cache/outfit-assets.json'),JSON.stringify(all));
 fs.writeFileSync(path.join(root,'.cache/pro-assets.json'),JSON.stringify(pro));
 await sharp(path.join(source,'frames/idle/00.png')).resize(128,128).png().toFile(path.join(root,'icon.png'));
 const flashFrames=outfits.reduce((sum,outfit)=>sum+Object.values(all[outfit]).reduce((total,asset)=>total+asset.count,0),0),proFrames=Object.values(pro).reduce((sum,a)=>sum+a.count,0);
 console.log(JSON.stringify({bundleBytes:Buffer.byteLength(code),outfits,states:Object.keys(all.maid),physicalFrames:flashFrames,proFrames,totalFrames:flashFrames+proFrames,meal:{physicalFrames:all.maid.eating.count,playbackPoses:all.maid.eating.sequence.length,bites:all.maid.eating.biteCount,duration:all.maid.eating.duration}}));
})().catch(error=>{console.error(error);process.exitCode=1;});
