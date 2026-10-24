const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const{chromium}=require('playwright'),{browserFixture,wheelAction}=require('./browser-support.cjs');
const{fixture,mount}=browserFixture(),proof=path.resolve('.cache/pro-wardrobe-browser');fs.mkdirSync(proof,{recursive:true});
const winters=['pro-winter-puffer','pro-winter-cape'];
(async()=>{const browser=await chromium.launch({executablePath:process.env.DSG_BROWSER_PATH,headless:true});try{
 const context=await browser.newContext({viewport:{width:900,height:720}}),externalRequests=[];
 context.on('request',r=>{if(!r.url().startsWith('http://winter.test/')&&!r.url().startsWith('data:'))externalRequests.push(r.url());});
 await context.route('http://winter.test/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#faf7f1;color:#426482;font-family:Microsoft YaHei,Arial;--dsw-alias-label-secondary:#6d8196;--dsw-alias-bg-layer-1:#fff;--dsw-alias-border-l2:#d9e2ec}header{margin:32px 36px}h1{font-size:25px}p{font-size:14px;line-height:1.9;color:#8195a7}</style><header><h1>Pro 娘的冬日衣柜</h1><p>奶油蓝羽绒服 · 月牙绒绒斗篷<br>身体站稳，尾巴轻摆。每套都能连续吃三口白饭。</p></header><div id="mount"></div>'}));
 const page=await context.newPage();
 async function boot(first=false){
  await page.goto('http://winter.test/');await page.addScriptTag({content:fixture});
  await page.evaluate(first=>{let value={status:'ready',current:{model:'deepseek-v4-pro'}};const listeners=new Set();window.__models={subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn);},getSnapshot:()=>value};window.__setModel=model=>{value={status:'ready',current:{model}};listeners.forEach(fn=>fn());};if(first)localStorage.setItem('deepseek-girl.preferences.v1',JSON.stringify({x:580,y:380,size:220,hat:true,outfit:'winter-cape',proOutfit:'invalid-legacy',beggingEnabled:false,greetingsEnabled:false}));},first);
  await page.addScriptTag({content:fs.readFileSync('client.js','utf8').replace('const decoded=new Map();','const decoded=window.__winterCache=new Map();')});
  await page.addScriptTag({content:mount.replace("sessionId:'animation-browser-test',","sessionId:'animation-browser-test',modelSource:__models,")});await page.evaluate(()=>{__running=false;__rerender();});await ready(first?'pro':(await prefs()).proOutfit||'pro');
 }
 const prefs=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('deepseek-girl.preferences.v1')));
 async function ready(outfit){await page.waitForFunction(outfit=>document.querySelector('.dsg-root')?.dataset.outfit===outfit&&document.querySelector('.dsg-pro-body .dsg-clip')?.getAttribute('aria-busy')==='false',outfit);}
 async function wardrobe(){await page.locator('.dsg-character').press('Enter');await page.getByRole('button',{name:'打开小衣柜',exact:true}).click();await page.getByRole('dialog',{name:'今天想穿哪一套？'}).waitFor();}
 async function choose(id){await page.locator('[data-outfit-choice="'+id+'"]').click();await ready(id);await page.waitForFunction(()=>document.querySelector('.dsg-wear')?.disabled===false);}
 const save=()=>page.getByRole('button',{name:'就穿这套',exact:true}).click();
 await boot(true);const original=await prefs();
 await wardrobe();assert.equal(await page.locator('.dsg-outfit').count(),3);assert.equal(await page.locator('[data-outfit-choice="winter-cape"]').count(),0);
 await choose(winters[0]);assert.equal((await prefs()).proOutfit,'invalid-legacy');await page.getByRole('button',{name:'取消',exact:true}).click();await ready('pro');
 await wardrobe();await choose(winters[1]);await page.keyboard.press('Escape');await ready('pro');
 await wardrobe();await choose(winters[0]);await page.locator('.dsg-wardrobe-backdrop').click({position:{x:2,y:2}});await ready('pro');
 await wardrobe();await choose(winters[0]);await save();assert.equal((await prefs()).proOutfit,winters[0]);assert.equal((await prefs()).outfit,'winter-cape');
 for(const key of ['x','y','size','hat'])assert.equal((await prefs())[key],original[key]);
 // Remount preserves the independent Pro choice. No replayed transformation.
 await page.evaluate(()=>__unmount());await boot(false);await ready(winters[0]);assert.equal(await page.locator('.dsg-morph').count(),0);
 const checked=[];
 for(const outfit of winters){
  await wardrobe();await choose(outfit);const ratio=await page.locator('.dsg-outfit[aria-pressed="true"] .dsg-outfit-preview').evaluate(el=>el.clientWidth/el.clientHeight);assert.ok(Math.abs(ratio-2/3)<.02);
  await page.screenshot({path:path.join(proof,'wardrobe-'+outfit+'.png')});await save();
  for(const label of ['思考中','正在回答','完成啦','遇到错误','被拎起来啦','落地啦','休息中','捧盆求喂饭','被摸头','鼓脸啦']){
   await wheelAction(page,label);await ready(outfit);assert.equal(await page.locator('.dsg-pro-tail').count(),1);assert.equal(await page.locator('.dsg-pro-body .dsg-art').evaluate(img=>img.getAnimations().length),0);assert.ok(await page.evaluate(()=>__winterCache.size)<=8);checked.push(outfit+':'+label);
  }
  await wheelAction(page,'跟随当前任务');await page.evaluate(()=>{__running=false;__rerender();});await ready(outfit);
  await page.screenshot({path:path.join(proof,'portrait-'+outfit+'.png')});
  // Both transformation directions show the SAVED winter costume.
  await page.evaluate(()=>__setModel('deepseek-v4.1-flash'));await page.waitForSelector('.dsg-morph[data-direction="to-flash"]');assert.equal(await page.locator('.dsg-transform-art[data-outfit="'+outfit+'"]').count(),1);
  await page.waitForFunction(()=>document.querySelector('.dsg-root')?.dataset.form==='flash'&&document.querySelector('.dsg-root')?.dataset.transforming==='false');assert.equal(await page.locator('.dsg-root').getAttribute('data-outfit'),'winter-cape');
  await wardrobe();assert.equal(await page.locator('.dsg-outfit').count(),5);await page.keyboard.press('Escape');assert.equal((await prefs()).proOutfit,outfit);
  await page.evaluate(()=>__setModel('deepseek-v4-pro'));await page.waitForSelector('.dsg-morph[data-direction="to-pro"]');assert.equal(await page.locator('.dsg-transform-art[data-outfit="'+outfit+'"]').count(),1);await page.waitForFunction(()=>document.querySelector('.dsg-root')?.dataset.transforming==='false');await ready(outfit);
 }
 // A wardrobe change part-way through a real meal keeps the three-bite clock.
 await page.locator('.dsg-food').click();const began=Date.now();await page.waitForTimeout(4500);await wardrobe();await choose(winters[0]);
 const elapsed=await page.locator('.dsg-character .dsg-pro-meal-art').evaluate(img=>img.getAnimations()[0].currentTime-parseFloat(getComputedStyle(img).animationDelay)*1000);assert.ok(elapsed>=4400);await save();
 assert.equal(await page.locator('.dsg-root').getAttribute('data-deepseek-girl-state'),'eating');assert.equal(await page.locator('.dsg-character .dsg-pro-tail').count(),0);assert.equal(await page.locator('.dsg-character .dsg-pro-body img').count(),1);
 await page.waitForTimeout(Math.max(0,13080-(Date.now()-began))+120);await page.waitForFunction(()=>document.querySelector('.dsg-root')?.dataset.deepseekGirlState!=='eating');await ready(winters[0]);
 await page.setViewportSize({width:280,height:480});await wardrobe();await choose(winters[1]);const box=await page.locator('.dsg-wardrobe').boundingBox();assert.ok(box.x>=0&&box.y>=0&&box.x+box.width<=280&&box.y+box.height<=480);assert.equal(await page.locator('.dsg-wardrobe').evaluate(el=>el.scrollWidth<=el.clientWidth),true);
 await page.screenshot({path:path.join(proof,'narrow.png')});await page.getByRole('button',{name:'就穿这套',exact:true}).focus();await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.className),'dsg-outfit');
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.dsg-character .dsg-pro-tail').evaluate(el=>el.getAnimations().length),0);await save();
 assert.equal((await prefs()).outfit,'winter-cape');assert.equal((await prefs()).proOutfit,winters[1]);assert.deepEqual(externalRequests,[]);assert.deepEqual(await page.evaluate(()=>__fixtureErrors),[]);await page.evaluate(()=>__unmount());assert.equal(await page.evaluate(()=>__winterCache.size),0);
 const result={passed:true,outfits:winters,checked,independentFormMemory:true,previewCancelEscapeOutside:true,persistsAfterRemount:true,winterTransformationBothDirections:true,threeBiteClockSurvivesOutfitChange:true,preservesHatGeometry:true,portraitPreviews:true,narrowWindow:true,reducedMotion:true,cacheBoundAndCleanup:true,externalRequests,errors:[]};fs.writeFileSync(path.join(proof,'verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
