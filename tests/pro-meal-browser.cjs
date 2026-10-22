const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),sharp=require('sharp');
const {chromium}=require('playwright'),{browserFixture}=require('./browser-support.cjs'),{landmarks}=require('../scripts/register-pro-meal.cjs');
const {fixture,mount}=browserFixture(),meal=JSON.parse(fs.readFileSync('.cache/pro-assets.json','utf8')).eating,proof=path.resolve('.cache/pro-meal-browser');fs.mkdirSync(proof,{recursive:true});
(async()=>{
 assert.equal(meal.alignment.method,'complete-frame face-and-shoes registration');
 let maxFaceError=0,maxFeetError=0;
 for(let i=0;i<12;i++){
  const{data,info}=await sharp('.cache/pro-meal-registered/'+String(i).padStart(2,'0')+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}),a=landmarks(data,info.width,info.height),target=meal.alignment.target;
  maxFaceError=Math.max(maxFaceError,Math.hypot(...a.face.map((n,j)=>n-target.face[j])));maxFeetError=Math.max(maxFeetError,Math.hypot(...a.feet.map((n,j)=>n-target.feet[j])));
 }
 assert.ok(maxFaceError<2.5);assert.ok(maxFeetError<1.1);assert.equal(meal.biteCount,3);assert.equal(meal.sequence.length,36);
 const browser=await chromium.launch({executablePath:process.env.DSG_BROWSER_PATH,headless:true});try{
  const context=await browser.newContext({viewport:{width:760,height:620}}),externalRequests=[],cases=[];
  context.on('request',r=>{if(!r.url().startsWith('http://meal.test/')&&!r.url().startsWith('data:'))externalRequests.push(r.url());});
  await context.route('http://meal.test/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#fffaf2;color:#45647d;font-family:Microsoft YaHei,Arial;--dsw-alias-label-secondary:#6d8196;--dsw-alias-bg-layer-1:white;--dsw-alias-border-l2:#d9e2ec}header{padding:28px 34px;background:#fff;border-bottom:1px solid #e5e1d8}h1{font-size:22px;font-weight:500;margin:8px 0}small{color:#8f9fae}p{margin:26px 34px;font-size:14px;line-height:1.8}#bite{font-size:20px;color:#5b839e}</style><header><small>DEEPSEEK GIRL · LOCAL TEST</small><h1>完整动作帧，连续吃三口白饭。</h1><small>One complete drawing per pose. No pasted face or arms.</small></header><p><span id="bite">准备开饭</span><br>统一对齐脸部与脚的位置<br>待机继续只摆尾巴</p><div id="mount"></div>'}));
  const page=await context.newPage();
  for(const [size,hat]of [[176,false],[260,true]]){
   await page.goto('http://meal.test/');await page.addScriptTag({content:fixture});await page.evaluate(({size,hat})=>{localStorage.setItem('deepseek-girl.preferences.v1',JSON.stringify({x:440,y:300,size,hat,outfit:'maid',greetingsEnabled:false,beggingEnabled:false}));window.__models={subscribe:()=>()=>{},getSnapshot:()=>window.__modelSnapshot};window.__modelSnapshot={status:'ready',current:{model:'deepseek-v4-pro'}};},{size,hat});
   await page.addScriptTag({content:fs.readFileSync('client.js','utf8')});await page.addScriptTag({content:mount.replace("sessionId:'animation-browser-test',","sessionId:'animation-browser-test',modelSource:__models,")});await page.evaluate(()=>{__running=false;__rerender();});await page.waitForFunction(()=>document.querySelector('.dsg-pro-body .dsg-clip')?.getAttribute('aria-busy')==='false');
   await page.locator('.dsg-food').click();const began=Date.now();await page.waitForFunction(()=>document.querySelector('.dsg-pro-meal-art')?.getAnimations().length===1);await page.mouse.move(20,20);
   assert.equal(await page.locator('.dsg-pro-body img').count(),1);assert.equal(await page.locator('.dsg-pro-tail,.dsg-pro-action').count(),0);assert.equal(await page.locator('.dsg-pro-body').evaluate(el=>getComputedStyle(el).clipPath),'none');
   assert.equal(await page.locator('.dsg-hat').count(),hat?1:0);assert.equal(await page.locator('.dsg-motion').evaluate(el=>getComputedStyle(el).transform),'none');
   const box=await page.locator('.dsg-character').boundingBox(),roi={left:Math.ceil(box.x),top:Math.ceil(box.y),width:Math.floor(box.width),height:Math.floor(box.height)},firstBite=[],frames=[];
   for(let visit=0;visit<36;visit++){
    const pose=visit%12;await page.evaluate(bite=>{document.querySelector('#bite').textContent='第 '+bite+' 口 / 3';},Math.floor(visit/12)+1);
    await page.locator('.dsg-pro-meal-art').evaluate(async(img,{visit,delays})=>{const a=img.getAnimations()[0];a.pause();a.effect.updateTiming({delay:0});a.currentTime=delays.slice(0,visit).reduce((sum,n)=>sum+n,0)+delays[visit]/2;await new Promise(requestAnimationFrame);},{visit,delays:meal.delays});
    const screenshot=await page.screenshot(),character=await sharp(screenshot).extract(roi).raw().toBuffer();
    if(visit<12)firstBite.push(character);else assert.deepEqual(character,firstBite[pose],`size ${size}, bite ${Math.floor(visit/12)+1}, pose ${pose}: same complete drawing must repeat`);
    if(size===260)frames.push(await sharp(screenshot).ensureAlpha().raw().toBuffer());
    if(visit<12)fs.writeFileSync(path.join(proof,`size-${size}-pose-${String(pose).padStart(2,'0')}.png`),screenshot);
   }
   assert.ok(firstBite.some(b=>!b.equals(firstBite[0])),'The meal must visibly move, rather than freeze after removing the overlay');
   if(size===260)await sharp(Buffer.concat(frames),{raw:{width:760,height:620*frames.length,channels:4,pageHeight:620}}).gif({loop:0,delay:meal.delays,colours:128,dither:0,effort:6}).toFile(path.join(proof,'feeding-pro.gif'));
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('.dsg-pro-meal-art')?.getAnimations().length===0);assert.equal(await page.locator('.dsg-pro-body img').count(),1);
   await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>document.querySelector('.dsg-pro-meal-art')?.getAnimations().length===1);
   await page.waitForTimeout(Math.max(0,meal.duration-(Date.now()-began))+100);await page.waitForFunction(()=>document.querySelector('.dsg-root')?.dataset.deepseekGirlState==='idle');assert.equal(await page.locator('.dsg-pro-tail').count(),1);assert.equal(await page.locator('.dsg-food').isDisabled(),false);
   assert.deepEqual(await page.evaluate(()=>__fixtureErrors),[]);await page.evaluate(()=>__unmount());cases.push({size,hat,bites:3,poseVisits:36,singleCompleteImage:true,identicalRepeatedBites:true,returnsToIdleTail:true});
  }
  assert.deepEqual(externalRequests,[]);const result={passed:true,completeFramesOnly:true,noFaceOrArmOverlay:true,maxFaceAnchorError:maxFaceError,maxFeetAnchorError:maxFeetError,cases,reducedMotion:true,externalRequests,errors:[]};fs.writeFileSync(path.join(proof,'verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
