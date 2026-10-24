const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp'),assert=require('node:assert/strict'),crypto=require('node:crypto');
(async()=>{const all=JSON.parse(fs.readFileSync('.cache/pro-outfit-assets.json','utf8'));let sources=0;
 for(const id of ['winter-puffer','winter-cape']){
  const folder=path.resolve('assets/forms/pro/outfits',id),m=JSON.parse(fs.readFileSync(path.join(folder,'manifest.json'),'utf8')),assets=all['pro-'+id],hashes=new Set();
  assert.equal(Object.keys(m.states).length,13);assert.equal(Object.keys(assets).length,14);
  for(const[state,def]of Object.entries(m.states))for(let i=0;i<def.frames;i++){
   const file=path.join(folder,'frames',state,String(i).padStart(2,'0')+'.png'),bytes=fs.readFileSync(file),{data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});assert.deepEqual([info.width,info.height],[512,768]);
   let minX=512,minY=768,maxX=0,maxY=0,opaque=0,clear=0;for(let p=0;p<data.length;p+=4){const a=data[p+3];if(a===0)clear++;if(a>=8){opaque++;const x=p/4%512,y=Math.floor(p/4/512);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}}
   assert.ok(clear>512*768*.3&&opaque>512*768*.15);assert.ok(minX>=6&&maxX<=505&&minY>=8&&maxY<=744,JSON.stringify({id,state,i,minX,maxX,minY,maxY}));hashes.add(crypto.createHash('sha256').update(bytes).digest('hex'));sources++;
  }
  assert.equal(hashes.size,24);
  for(const[state,a]of Object.entries(assets)){
   const meta=await sharp(Buffer.from(a.strip.split(',')[1],'base64')).metadata();assert.deepEqual([meta.width,meta.height,meta.hasAlpha],[a.count*320,480,true]);assert.equal(a.outfit,'pro-'+id);assert.ok(a.hat?.left&&a.hat?.top);
   if(!['eating','transform-in','transform-out'].includes(state)){assert.equal(a.count,1);assert.match(a.tailRig.bodyClip,/^polygon/);assert.match(a.tailRig.tailClip,/^polygon/);}
  }
  assert.equal(assets.eating.count,12);assert.equal(assets.eating.sequence.length,36);assert.equal(assets.eating.biteCount,3);assert.equal(assets.eating.duration,13080);assert.equal(assets['transform-in'].still,assets.idle.still);
  const prompts=JSON.parse(fs.readFileSync(path.join(folder,'generation-prompts.json'),'utf8'));assert.equal(prompts.mode,'built-in image_gen');assert.equal(prompts.prompts.length,4);assert.ok(prompts.prompts.every(p=>p.prompt.length>500&&fs.existsSync(path.join(folder,p.output))));
 }
 console.log(JSON.stringify({passed:true,proWinterOutfits:2,sourceFrames:sources,completeDrawings:true,alphaAndPadding:true,allStates:true,mealBites:3,tailRigs:true,hatAnchors:true,promptProvenance:true}));
})().catch(e=>{console.error(e);process.exitCode=1;});
