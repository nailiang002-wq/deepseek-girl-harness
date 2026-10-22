const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),sharp=require('sharp');
(async()=>{
 const root=path.resolve('assets/forms/pro'),manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8')),assets=JSON.parse(fs.readFileSync('.cache/pro-assets.json','utf8'));let frames=0;
 assert.equal(Object.keys(manifest.states).length,14);
 for(const [state,def]of Object.entries(manifest.states)){
  const hashes=new Set();
  for(let i=0;i<def.delays.length;i++){
   const bytes=fs.readFileSync(path.join(root,'frames',state,String(i).padStart(2,'0')+'.png')),meta=await sharp(bytes).metadata();assert.deepEqual([meta.width,meta.height,meta.hasAlpha],[512,768,true]);hashes.add(crypto.createHash('sha256').update(bytes).digest('hex'));
   const raw=await sharp(bytes).raw().toBuffer();let clear=0,visible=0,left=512,right=0,top=768,bottom=0;
   for(let p=0;p<512*768;p++){const a=raw[p*4+3];if(a===0)clear++;if(a>=8){visible++;const x=p%512,y=Math.floor(p/512);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}}
   assert.ok(clear>512*768*.2&&visible>512*768*.15);assert.ok(left>=20&&right<=491&&top>=20&&bottom<=744,`${state}/${i}: ${[left,top,right,bottom]}`);frames++;
  }
  assert.ok(hashes.size>=3);const a=assets[state],atlas=await sharp(Buffer.from(a.strip.split(',')[1],'base64')).metadata();assert.deepEqual([atlas.width,atlas.height,atlas.hasAlpha],[def.delays.length*320,480,true]);assert.equal(a.outfit,'pro');assert.equal(a.duration,def.delays.reduce((a,b)=>a+b,0)*(state==='eating'?3:1));
 }
 assert.equal(frames,90);assert.equal(assets.eating.sequence.length,36);assert.equal(assets.eating.biteCount,3);
 console.log(JSON.stringify({passed:true,proStates:12,transitionStates:2,sourceFrames:frames,trueAlpha:true,portraitAtlases:true,mealBites:3,normalizedPadding:true}));
})().catch(e=>{console.error(e);process.exitCode=1;});
