const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {browserFixture}=require('./browser-support.cjs');
const {fixture,mount}=browserFixture();
const assets=JSON.parse(fs.readFileSync('.cache/after-meal-assets.json','utf8'));
const proof=path.resolve('.cache/after-meal-browser');fs.mkdirSync(proof,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.DSG_BROWSER_PATH,headless:true});
 try{
  const context=await browser.newContext({viewport:{width:850,height:650}}),external=[];
  context.on('request',request=>{if(!request.url().startsWith('http://meal.test/')&&!request.url().startsWith('data:'))external.push(request.url());});
  await context.route('http://meal.test/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><meta charset="utf-8"><style>body{margin:0;background:#f7f6ef;color:#506b86;font-family:Arial}header{padding:28px 35px}h1{font-size:24px}p{line-height:1.8}</style><body><header><h1>白饭吃完，也有小小的仪式感。</h1><p>擦擦嘴，摸摸肚子，把铁盆放好。<br>独立演示 · 使用模拟进度和模型选择</p></header><div id="mount"></div></body></html>'}));
  const page=await context.newPage(),start=new Date(2026,10,21,10);
  await page.clock.install({time:start});await page.clock.pauseAt(new Date(start.getTime()+1000));
  async function boot(outfit='maid',extra={}){
   await page.goto('http://meal.test/');await page.addScriptTag({content:fixture});
   await page.evaluate(({outfit,extra})=>{
    if(extra!==null)localStorage.setItem('deepseek-girl.preferences.v1',JSON.stringify({x:550,y:340,size:176,hat:true,greetingsEnabled:false,beggingEnabled:false,financeVisible:false,outfit:outfit.startsWith('pro')?'maid':outfit,proOutfit:outfit.startsWith('pro')?outfit:'pro',...extra}));
    window.__model={status:'ready',current:{model:outfit.startsWith('pro')?'deepseek-pro':'deepseek-flash'}};
    const listeners=new Set();window.__models={getSnapshot:()=>__model,subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn);}};
    window.__setModel=model=>{__model={status:'ready',current:{model}};listeners.forEach(fn=>fn());};
   },{outfit,extra});
   await page.addScriptTag({content:fs.readFileSync('client.js','utf8')});
   await page.addScriptTag({content:mount.replace('window.__running=true;','window.__running=false;').replace("sessionId:'animation-browser-test',","sessionId:'animation-browser-test',modelSource:__models,")});
   await page.waitForSelector('.dsg-character');await page.waitForFunction(()=>document.querySelector('.dsg-character .dsg-clip')?.getAttribute('aria-busy')==='false');
  }
  const state=()=>page.locator('.dsg-root').getAttribute('data-deepseek-girl-state');
  const prefs=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('deepseek-girl.preferences.v1')));
  const tick=async milliseconds=>{await page.clock.runFor(milliseconds);await page.evaluate(()=>require('react-dom').flushSync(()=>{}));};
  async function startMeal(){await page.locator('.dsg-food').click();assert.equal(await state(),'eating');await tick(13080);await page.locator('.dsg-root[data-deepseek-girl-state="aftermeal"]').waitFor();}
  const checked=[];
  for(const outfit of Object.keys(assets)){
   await boot(outfit);const before=await page.locator('.dsg-character').boundingBox();
   await startMeal();assert.equal(await page.locator('.dsg-food').isDisabled(),true);
   await page.waitForFunction(()=>document.querySelector('.dsg-character .dsg-art')?.getAnimations().length===1);
   assert.equal(await page.locator('.dsg-character .dsg-art').getAttribute('data-outfit'),outfit);
   assert.deepEqual(await page.locator('.dsg-character').boundingBox(),before);
   const positions=await page.locator('.dsg-character .dsg-art').evaluate((img,asset)=>{
    const animation=img.getAnimations()[0];animation.pause();let elapsed=0;
    return asset.delays.map(delay=>{animation.currentTime=elapsed+delay/2;elapsed+=delay;return new DOMMatrix(getComputedStyle(img).transform).m41;});
   },assets[outfit]);
   positions.forEach((position,index)=>assert.ok(Math.abs(position+index*before.width)<.15,`${outfit} frame ${index}`));
   assert.equal(await page.locator('.dsg-motion').evaluate(el=>getComputedStyle(el).animationName),'none');
   assert.equal(await page.locator('.dsg-hat').count(),1);
   if(outfit.startsWith('pro'))assert.equal(await page.locator('.dsg-character .dsg-pro-tail').count(),0);
   if(outfit==='maid'||outfit==='pro-winter-cape'){
    await page.locator('.dsg-character .dsg-art').evaluate(img=>{img.getAnimations()[0].currentTime=1100;});
    await page.screenshot({path:path.join(proof,outfit+'-wipe.png')});
   }
   await tick(3700);assert.equal(await state(),'idle');assert.equal(await page.locator('.dsg-food').isDisabled(),false);checked.push(outfit);
  }
  // A second and third meal get different responses; the reward cooldown applies.
  await boot('maid');await startMeal();await tick(3700);
  await page.locator('.dsg-food').click();assert.match(await page.locator('.dsg-greeting-text').innerText(),/又一盆/);assert.equal((await prefs()).mealStreak,2);assert.equal((await prefs()).companion.points,3);
  await tick(16780);await page.locator('.dsg-food').click();assert.match(await page.locator('.dsg-greeting-text').innerText(),/盆都给我摆好/);assert.equal((await prefs()).mealStreak,3);
  await tick(16780);await boot('maid',null);assert.equal((await prefs()).mealStreak,3);
  await tick(300001);await page.locator('.dsg-food').click();assert.equal((await prefs()).mealStreak,1);
  // A model choice waits for the complete meal, including the after-meal gestures.
  await tick(13080);await page.evaluate(()=>__setModel('deepseek-pro'));await tick(600);assert.equal(await page.locator('.dsg-root').getAttribute('data-form'),'flash');
  await tick(3100);await tick(500);await page.locator('.dsg-morph').waitFor();await tick(2300);assert.equal(await page.locator('.dsg-root').getAttribute('data-form'),'pro');
  // Wardrobe previews can change during the after-meal animation without resetting it.
  await boot('pro');await startMeal();await page.locator('.dsg-character').press('Enter');await page.getByRole('button',{name:'打开小衣柜',exact:true}).click();await page.locator('[data-outfit-choice="pro-winter-puffer"]').click();
  await page.waitForFunction(()=>document.querySelector('.dsg-wear')?.disabled===false);assert.equal(await state(),'aftermeal');await page.keyboard.press('Escape');await tick(3700);assert.equal(await state(),'idle');assert.equal((await prefs()).proOutfit,'pro');
  // Milestones wait until the meal finishes and are consumed once across reloads.
  await boot('maid',{companion:{points:39}});await startMeal();assert.equal((await prefs()).companion.milestone.level,1);assert.equal(await page.locator('.dsg-bond-celebration').count(),0);
  await tick(3700);await tick(2500);await page.locator('.dsg-bond-celebration[data-level="1"]').waitFor();assert.equal((await prefs()).companion.milestone,null);assert.match(await page.locator('.dsg-greeting-text').innerText(),/新的小回应/);
  await tick(300);await page.screenshot({path:path.join(proof,'level-up.png')});await boot('maid',null);await tick(4000);assert.equal(await page.locator('.dsg-bond-celebration').count(),0);
  await boot('pro-winter-cape',{companion:{points:157}});await page.emulateMedia({reducedMotion:'reduce'});await startMeal();assert.equal(await page.locator('.dsg-character .dsg-art').evaluate(img=>img.getAnimations().length),0);await tick(3700);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});await tick(4000);assert.equal((await prefs()).companion.milestone.level,2);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'));});await tick(2500);await page.locator('.dsg-bond-celebration[data-level="2"]').waitFor();assert.equal(await page.locator('.dsg-level-heart').first().evaluate(el=>getComputedStyle(el).animationName),'none');
  await tick(7000);assert.equal(await page.locator('.dsg-bond-celebration').count(),0);assert.deepEqual(external,[]);assert.deepEqual(await page.evaluate(()=>__fixtureErrors),[]);await page.evaluate(()=>__unmount());assert.equal(await page.locator('.dsg-root').count(),0);
  const result={passed:true,outfits:checked,allSixPoses:true,bodyStable:true,hats:true,threeBitesAndAfterMeal:true,repeatFeeding:true,reloadAndCooldown:true,wardrobeDuringAfterMeal:true,modelDeferral:true,milestones:[40,160],singleAnnouncement:true,hiddenDeferral:true,reducedMotion:true,externalRequests:external,errors:[]};
  fs.writeFileSync(path.join(proof,'verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
