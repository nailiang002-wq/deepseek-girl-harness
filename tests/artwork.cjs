const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),definitions=JSON.parse(fs.readFileSync(path.join(root,'assets/manifest.json'),'utf8')).states;
(async()=>{
 const client=fs.readFileSync(path.join(root,'client.js'),'utf8');
 const all={maid:JSON.parse(client.match(/const ASSETS = (.+);/)[1]),...JSON.parse(client.match(/const OUTFIT_ASSETS = (.+);/)[1])};let frames=0;
 assert.deepEqual(Object.keys(all),['maid','hoodie','pajamas','winter-puffer','winter-cape']);
 for(const [outfit,assets]of Object.entries(all)){
  assert.deepEqual(Object.keys(assets),Object.keys(definitions));
  for(const [state,definition]of Object.entries(definitions)){
   const asset=assets[state],count=definition.delays.length,folder=path.join(root,outfit==='maid'?'assets/frames/'+(definition.sourceFolder||state):'assets/outfits/'+outfit+'/frames/'+state);
   const files=fs.readdirSync(folder).filter(name=>name.endsWith('.png')).sort();assert.equal(files.length,count,`${outfit}/${state} source count`);
   const distinct=new Set();
   for(let index=0;index<count;index++){
    const file=path.join(folder,String(index).padStart(2,'0')+'.png'),bytes=fs.readFileSync(file),meta=await sharp(bytes).metadata();
    assert.equal(meta.width,512);assert.equal(meta.height,512);assert.equal(meta.hasAlpha,true);distinct.add(crypto.createHash('sha256').update(bytes).digest('hex'));
    const raw=await sharp(bytes).ensureAlpha().raw().toBuffer();let visible=0,clear=0,left=512,right=0,top=512,bottom=0;
    for(let point=0;point<512*512;point++){const alpha=raw[point*4+3];if(alpha===0)clear++;if(alpha>=8){visible++;const x=point%512,y=Math.floor(point/512);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}}
    assert.ok(clear>512*512*.15&&visible>512*512*.15,`${outfit}/${state}/${index} real transparent silhouette`);
    if(outfit!=='maid')assert.ok(left>=20&&right<=491&&top>=20&&bottom<=491,`${outfit}/${state}/${index} unclipped bounds ${[left,top,right,bottom]}`);
    frames++;
   }
   assert.ok(distinct.size>=3,`${outfit}/${state} must contain distinct poses`);
   const repeats=state==='eating'?3:1;assert.equal(asset.count,count);assert.equal(asset.sequence.length,count*repeats);assert.equal(asset.delays.length,count*repeats);assert.equal(asset.outfit,outfit);
   asset.sequence.forEach((pose,index)=>assert.equal(pose,index%count));assert.equal(asset.duration,definition.delays.reduce((a,b)=>a+b,0)*repeats);
   const atlas=await sharp(Buffer.from(asset.strip.split(',')[1],'base64')).metadata();assert.equal(atlas.width,count*320);assert.equal(atlas.height,320);assert.ok(atlas.hasAlpha);
   if(outfit!=='maid')assert.notEqual(asset.strip,all.maid[state].strip,`${outfit}/${state} needs its own outfit art`);
  }
  assert.equal(assets.eating.biteCount,3);assert.equal(assets.eating.duration,13080);
 }
 assert.equal(frames,390);console.log(JSON.stringify({passed:true,outfits:5,statesPerOutfit:12,sourceFrames:frames,trueAlpha:true,unclippedOutfits:true,mealBites:3,mealDuration:13080}));
})().catch(error=>{console.error(error);process.exitCode=1;});
