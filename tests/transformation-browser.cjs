const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright'),{browserFixture,wheelAction}=require('./browser-support.cjs');
const {fixture,mount}=browserFixture(),assets=JSON.parse(fs.readFileSync('.cache/pro-assets.json','utf8'));
const proof=path.resolve('.cache/transformation-browser');fs.mkdirSync(proof,{recursive:true});
const selection=model=>({status:'ready',current:{provider:'deepseek',model,reasoningEffort:'high'}});
(async()=>{const browser=await chromium.launch({...(process.env.DSG_BROWSER_PATH?{executablePath:process.env.DSG_BROWSER_PATH}:{}),headless:true});try{
 const context=await browser.newContext({viewport:{width:800,height:620}}),externalRequests=[];
 context.on('request',r=>{if(!r.url().startsWith('http://mascot.test/')&&!r.url().startsWith('data:'))externalRequests.push(r.url());});
 await context.route('http://mascot.test/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><style>body{margin:0;background:#f4f7ff;--dsw-alias-bg-layer-1:white;--dsw-alias-bg-layer-2:#f5f7fb;--dsw-alias-label-primary:#202535;--dsw-alias-label-secondary:#626777;--dsw-alias-border-l2:#d8dee8;font-family:Arial}</style><body><div id="mount"></div></body></html>'}));
 const page=await context.newPage();
 async function boot(model='deepseek-v4.1-flash'){
  await page.goto('http://mascot.test/');await page.addScriptTag({content:fixture});
  await page.evaluate(snapshot=>{let value=snapshot;const listeners=new Set();window.__models={subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn);},getSnapshot:()=>value};window.__setModel=next=>{value=next;listeners.forEach(fn=>fn());};window.__modelListeners=listeners;localStorage.setItem('deepseek-girl.preferences.v1',JSON.stringify({x:570,y:370,size:176,hat:true,outfit:'hoodie',beggingEnabled:false,greetingsEnabled:false}));},model?selection(model):null);
  await page.addScriptTag({content:fs.readFileSync('client.js','utf8').replace('const decoded=new Map();','const decoded=window.__proDecodeCache=new Map();')});
  await page.addScriptTag({content:mount.replace("sessionId:'animation-browser-test',","sessionId:'animation-browser-test',modelSource:__models,")});
  await page.waitForSelector('.dsg-art');await page.waitForFunction(()=>document.querySelector('.dsg-root')?.dataset.form==='pro'?document.querySelector('.dsg-pro-body .dsg-clip')?.getAttribute('aria-busy')==='false':document.querySelector('.dsg-art')?.getAnimations().length===1);
 }
 const form=()=>page.locator('.dsg-root').getAttribute('data-form');
 const morph=()=>page.locator('.dsg-morph').count();
 const model=async(name,status='ready')=>page.evaluate(s=>__setModel(s),{...selection(name),status});
 const waitForm=name=>page.waitForFunction(name=>document.querySelector('.dsg-root')?.dataset.form===name&&document.querySelector('.dsg-root')?.dataset.transforming==='false',name);
 const state=name=>page.waitForFunction(name=>document.querySelector('.dsg-root')?.dataset.deepseekGirlState===name,name);
 const prefs=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('deepseek-girl.preferences.v1')));
 const bounds=async(selector)=>{const b=await page.locator(selector).boundingBox(),v=page.viewportSize();assert.ok(b&&b.x>=-.1&&b.y>=-.1&&b.x+b.width<=v.width+.1&&b.y+b.height<=v.height+.1,JSON.stringify({selector,b,v}));return b;};
 await boot('deepseek-v4.1-pro');assert.equal(await form(),'pro');assert.equal(await morph(),0);assert.equal(await page.locator('.dsg-root').getAttribute('data-outfit'),'pro');await bounds('.dsg-character');await page.screenshot({path:path.join(proof,'pro-thinking.png')});
 await boot(null);await model('deepseek-v4.1-pro');await waitForm('pro');assert.equal(await morph(),0);
 await boot();const original=await prefs(),flashBox=await page.locator('.dsg-character').boundingBox();
 for(const status of ['selecting','loading','error']){await model('deepseek-v4.1-pro',status);await page.waitForTimeout(520);assert.equal(await form(),'flash');assert.equal(await morph(),0);}
 await model('deepseek-v4.1-flash');await model('deepseek-v4.1-pro');await page.waitForSelector('.dsg-morph[data-direction="to-pro"]');
 assert.equal(await page.locator('.dsg-transform-art').count(),2);await page.waitForFunction(()=>[...document.querySelectorAll('.dsg-transform-art')].every(img=>img.getAnimations().length===1));
 await page.waitForTimeout(1150);await page.screenshot({path:path.join(proof,'transform-to-pro.png')});await waitForm('pro');
 const proBox=await bounds('.dsg-character');assert.ok(proBox.height>flashBox.height*1.6);assert.ok(Math.abs(proBox.y+proBox.height-flashBox.y-flashBox.height)<1);assert.deepEqual(await prefs(),original);
 assert.ok(await page.locator('.dsg-hat').evaluate(h=>h.getBoundingClientRect().width/h.closest('.dsg-character').getBoundingClientRect().width<.35));
 const beforeRenders=await page.evaluate(()=>__rootRenders);await page.waitForTimeout(600);assert.equal(await page.evaluate(()=>__rootRenders),beforeRenders);
 await model('deepseek-v4.1-pro');await page.waitForTimeout(520);assert.equal(await morph(),0);
 // Last settled selection wins, including a new choice during an active morph.
 await model('deepseek-v4.1-flash');await page.waitForTimeout(80);await model('deepseek-v4.1-pro');await page.waitForTimeout(550);assert.equal(await morph(),0);
 await model('deepseek-v4.1-flash');await page.waitForSelector('.dsg-morph[data-direction="to-flash"]');await model('deepseek-v4.1-pro');await page.waitForSelector('.dsg-morph[data-direction="to-pro"]');await waitForm('pro');
 // Pro previews Flash clothes without replacing the mature artwork.
 await page.locator('.dsg-character').press('Enter');await page.getByRole('button',{name:'打开小衣柜',exact:true}).click();await page.locator('[data-outfit-choice="winter-cape"]').click();
 await page.waitForFunction(()=>document.querySelector('.dsg-wear')?.disabled===false);assert.equal(await page.locator('.dsg-root').getAttribute('data-outfit'),'pro');await page.screenshot({path:path.join(proof,'pro-flash-wardrobe.png')});
 await model('deepseek-v4.1-flash');await page.waitForTimeout(650);assert.equal(await form(),'pro');assert.equal(await morph(),0);await page.getByRole('button',{name:'就穿这套',exact:true}).click();await waitForm('flash');assert.equal((await prefs()).outfit,'winter-cape');assert.equal(await page.locator('.dsg-root').getAttribute('data-outfit'),'winter-cape');
 await model('deepseek-v4.1-pro');await waitForm('pro');
 // Every mature state uses a portrait atlas and leaves no decoded-cache growth.
 const labels={idle:'待机',thinking:'思考中',generating:'正在回答',success:'完成啦',error:'遇到错误',dragging:'被拎起来啦',drop:'落地啦',sleeping:'休息中',begging:'捧盆求喂饭',eating:'开心吃白饭',petting:'被摸头',pouting:'鼓脸啦'};
 for(const [name,label]of Object.entries(labels)){
  await wheelAction(page,label);await state(name);await page.waitForFunction(name=>document.querySelector('.dsg-art')?.dataset.state===name&&(name==='eating'?document.querySelector('.dsg-pro-meal-art'):document.querySelector('.dsg-pro-tail'))?.getAnimations().length===1,name);
  const dimensions=await page.locator('.dsg-art').evaluate(img=>[img.naturalWidth,img.naturalHeight]);assert.deepEqual(dimensions,[name==='eating'?assets.eating.count*320:320,480]);assert.ok(await page.evaluate(()=>__proDecodeCache.size)<=8);
 }
 await page.keyboard.press('Escape');await wheelAction(page,'跟随当前任务');await state('thinking');
 // Head target fits her new proportions; the long dress opens the wheel.
 await page.locator('.dsg-character').click({position:{x:proBox.width*.5,y:proBox.height*.16}});await state('petting');assert.equal(await page.locator('.dsg-finance-card').count(),1);await bounds('.dsg-finance-card');
 await page.locator('.dsg-character').click({position:{x:proBox.width*.5,y:proBox.height*.6}});assert.equal(await page.locator('.dsg-menu').count(),1);await bounds('.dsg-menu');await page.keyboard.press('Escape');
 // A real meal completes all three spoon visits before a pending form change.
 await page.getByRole('button',{name:'喂她一盆白饭',exact:true}).click();await state('eating');await page.waitForFunction(()=>document.querySelector('.dsg-pro-meal-art')?.naturalWidth===3840);const began=Date.now();await model('deepseek-v4.1-flash');
 const spoon=await page.locator('.dsg-pro-meal-art').evaluate(async(img,asset)=>{const a=img.getAnimations()[0],elapsed=a.currentTime;a.pause();a.effect.updateTiming({delay:0});const result=[];for(const index of [5,17,29]){a.currentTime=asset.delays.slice(0,index).reduce((a,b)=>a+b,0)+asset.delays[index]/2;await new Promise(requestAnimationFrame);result.push(new DOMMatrix(getComputedStyle(img).transform).m41);}a.currentTime=elapsed;a.play();return{result,frame:parseFloat(getComputedStyle(img).width)/asset.count};},assets.eating);
 spoon.result.forEach(x=>assert.ok(Math.abs(x+5*spoon.frame)<.1));assert.equal(assets.eating.biteCount,3);
 await page.waitForTimeout(4700);assert.equal(await form(),'pro');assert.equal(await morph(),0);await state('eating');await page.screenshot({path:path.join(proof,'pro-eating.png')});
 await page.waitForTimeout(Math.max(0,assets.eating.duration-(Date.now()-began))+120);await waitForm('flash');assert.equal((await prefs()).outfit,'winter-cape');
 // The tall form remains draggable. A model choice during a drag waits for landing.
 await model('deepseek-v4.1-pro');await waitForm('pro');const dragBox=await page.locator('.dsg-character').boundingBox();
 await page.mouse.move(dragBox.x+dragBox.width*.5,dragBox.y+dragBox.height*.5);await page.mouse.down();await page.mouse.move(dragBox.x+dragBox.width*.5-70,dragBox.y+dragBox.height*.5-45,{steps:8});await state('dragging');
 await model('deepseek-v4.1-flash');await page.waitForTimeout(650);assert.equal(await form(),'pro');assert.equal(await morph(),0);await page.mouse.up();await state('drop');assert.equal(await form(),'pro');await waitForm('flash');const moved=await prefs();assert.ok(Math.abs(moved.x-original.x+70)<1);assert.ok(Math.abs(moved.y-original.y+45)<1);
 await model('deepseek-v4.1-pro');await waitForm('pro');await page.evaluate(()=>{__running=false;__rerender();});await state('idle');
 for(const [x,y]of [[0,0],[624,0],[0,412],[624,412]]){
  await page.evaluate(({x,y})=>{const p=JSON.parse(localStorage.getItem('deepseek-girl.preferences.v1'));localStorage.setItem('deepseek-girl.preferences.v1',JSON.stringify({...p,x,y}));window.dispatchEvent(new Event('deepseek-girl-preferences'));},{x,y});await bounds('.dsg-character');
  await wheelAction(page,'和我打个招呼');await page.waitForSelector('.dsg-greeting');await bounds('.dsg-greeting');await page.getByRole('button',{name:'关闭问候气泡',exact:true}).click();
 }
 // Accessibility and hidden windows snap, with no decorative motion.
 await page.emulateMedia({reducedMotion:'reduce'});await model('deepseek-v4.1-flash');await waitForm('flash');assert.equal(await morph(),0);await model('deepseek-v4.1-pro');await waitForm('pro');assert.equal(await morph(),0);assert.equal(await page.locator('.dsg-art').evaluate(img=>img.getAnimations().length),0);await page.emulateMedia({reducedMotion:'no-preference'});
 await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('deepseek-girl.preferences.v1'));localStorage.setItem('deepseek-girl.preferences.v1',JSON.stringify({...p,animate:false}));window.dispatchEvent(new Event('deepseek-girl-preferences'));});await model('deepseek-v4.1-flash');await waitForm('flash');assert.equal(await morph(),0);await model('deepseek-v4.1-pro');await waitForm('pro');assert.equal(await morph(),0);await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('deepseek-girl.preferences.v1'));localStorage.setItem('deepseek-girl.preferences.v1',JSON.stringify({...p,animate:true}));window.dispatchEvent(new Event('deepseek-girl-preferences'));});
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});await model('deepseek-v4.1-flash');await waitForm('flash');assert.equal(await morph(),0);await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'));});
 await model('deepseek-v4.1-pro');await page.evaluate(()=>{__props.sessionId='different-conversation';__rerender();});await waitForm('pro');assert.equal(await morph(),0);
 await page.setViewportSize({width:280,height:360});await page.waitForFunction(()=>{const r=document.querySelector('.dsg-character')?.getBoundingClientRect();return r&&r.right<=innerWidth+.1&&r.bottom<=innerHeight+.1;});await bounds('.dsg-character');await page.locator('.dsg-character').press('Enter');await bounds('.dsg-menu');await page.keyboard.press('Escape');
 assert.deepEqual(externalRequests,[]);assert.deepEqual(await page.evaluate(()=>__fixtureErrors),[]);await page.evaluate(()=>__unmount());assert.equal(await page.evaluate(()=>__modelListeners.size),0);assert.equal(await page.evaluate(()=>__proDecodeCache.size),0);
 const result={version:'1.10.0',passed:true,startupHydration:true,successfulSelectionOnly:true,bothDirections:true,lastChoiceWins:true,noPerFrameReactRenders:true,preservesFlashOutfit:true,proStates:12,portraitAtlases:true,hat:true,headPatLedger:true,mealBites:3,mealDefersTransform:true,wardrobeDefersTransform:true,dragDefersUntilLanding:true,savedPortraitDragPosition:true,greetingsAtAllCorners:true,reducedMotion:true,hiddenWindow:true,conversationChangeSnaps:true,narrowWindow:true,cacheBoundAndCleanup:true,externalRequests,errors:[]};fs.writeFileSync(path.join(proof,'verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
