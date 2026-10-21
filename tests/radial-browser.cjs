const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright'),{browserFixture,wheelAction}=require('./browser-support.cjs');
const {fixture,mount}=browserFixture(),proof=path.resolve('.cache/radial-browser');fs.mkdirSync(proof,{recursive:true});
const onScreen=(box,w,h)=>assert.ok(box&&box.x>=7&&box.y>=7&&box.x+box.width<=w-7&&box.y+box.height<=h-7,JSON.stringify({box,w,h}));
(async()=>{const browser=await chromium.launch({executablePath:process.env.DSG_BROWSER_PATH,headless:true});try{
 const context=await browser.newContext({viewport:{width:960,height:640}}),requests=[];
 context.on('request',r=>{if(!r.url().startsWith('http://mascot.test/')&&!r.url().startsWith('data:'))requests.push(r.url());});
 await context.route('http://mascot.test/**',r=>r.fulfill({contentType:'text/html',body:`<!doctype html><html><meta charset="utf-8"><style>body{margin:0;background:#f5f6f8;font-family:'Segoe UI','Microsoft YaHei',sans-serif;color:#414b59;--dsw-alias-label-secondary:#68788a;--dsw-alias-bg-layer-1:#fff;--dsw-alias-border-l2:#d9e1ea}.demo{margin:85px auto;width:580px;max-width:75vw}.demo small{color:#8d9aa7;letter-spacing:2px;font-size:10px}.demo h1{font-size:25px;font-weight:500;margin:17px 0}.demo p{font-size:14px;line-height:1.8;color:#8190a1}.prompt{background:white;border:1px solid #dde4ec;border-radius:18px;padding:20px;margin-top:24px;font-size:13px}.note{position:fixed;left:24px;bottom:20px;font-size:11px;color:#98a5b0}</style><body><main class="demo"><small>DEEPSEEK GIRL · INTERACTION PREVIEW</small><h1>写代码时，她也在身边。</h1><p>思考时安静陪你，休息时喂一盆白饭。<br>点一下身体，常用的小互动就在手边。</p><div class="prompt">继续完成今天的工作…</div></main><span class="note">独立演示页面 · 使用插件实际界面 · 不含个人会话</span><div id="mount"></div><button id="outside" style="position:fixed;left:20px;top:20px">Outside</button></body></html>`}));
 const page=await context.newPage();await page.goto('http://mascot.test/');await page.clock.install({time:new Date('2026-10-21T09:00:00+08:00')});
 await page.addScriptTag({content:fixture});await page.evaluate(()=>localStorage.setItem('deepseek-girl.preferences.v1',JSON.stringify({x:720,y:340,size:180,hat:false,outfit:'winter-puffer',greetingsEnabled:false,beggingEnabled:false})));
 await page.addScriptTag({content:fs.readFileSync('client.js','utf8')});await page.addScriptTag({content:mount});await page.waitForSelector('.dsg-art');await page.clock.runFor(200);
 const open=async()=>{await page.locator('.dsg-character').press('Enter');await page.locator('.dsg-menu').waitFor();await page.clock.runFor(180);};
 assert.equal(await page.locator('.dsg-finance-card').count(),0);
 await open();assert.equal(await page.locator('.dsg-wheel>button').count(),7);
 await page.addStyleTag({content:'*,::before,::after{corner-shape:squircle}'});if(await page.evaluate(()=>CSS.supports('corner-shape','round'))){assert.match(await page.locator('.dsg-wheel').evaluate(el=>getComputedStyle(el).cornerShape),/^(round|superellipse\(1\))$/);assert.match(await page.locator('.dsg-wheel-center').evaluate(el=>getComputedStyle(el).cornerShape),/^(round|superellipse\(1\))$/);}
 const box=await page.locator('.dsg-menu').boundingBox();onScreen(box,960,640);assert.ok(box.height<300);assert.equal(await page.locator('.dsg-menu').evaluate(el=>el.scrollHeight<=el.clientHeight),true);
 await page.evaluate(()=>document.fonts.ready);const font=await page.locator('.dsg-wheel').evaluate(el=>getComputedStyle(el).fontFamily);assert.match(font,/DSG Greeting Hand/);
 const labels=await page.locator('.dsg-wheel>button').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return{label:el.getAttribute('aria-label'),x:r.x,y:r.y,w:r.width,h:r.height};}));
 for(const b of labels){assert.ok(b.x>=box.x&&b.y>=box.y&&b.x+b.w<=box.x+box.width&&b.y+b.h<=box.y+box.height);}
 await page.locator('.dsg-wheel>button').first().focus();await page.keyboard.press('ArrowRight');assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')),'摸摸头');await page.keyboard.press('End');assert.equal(await page.evaluate(()=>document.activeElement.className),'dsg-wheel-center');await page.keyboard.press('Home');assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')),'喂她一盆白饭');
 await page.screenshot({path:path.join(proof,'wheel.png')});
 await wheelAction(page,'更多');assert.equal(await page.locator('.dsg-menu').getAttribute('data-wheel-page'),'more');
 await wheelAction(page,'小设置');assert.equal(await page.locator('.dsg-wheel [aria-pressed]').count(),3);await page.screenshot({path:path.join(proof,'settings.png')});await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.className),'dsg-character');
 // No finance card at rest. A head pat opens it, pointer hover and keyboard focus
 // keep it readable, and it expires after the user leaves it.
 await page.locator('.dsg-character').click({position:{x:90,y:45}});await page.clock.runFor(30);await page.locator('.dsg-finance-card').waitFor();await page.mouse.move(10,300);await page.clock.runFor(9900);assert.equal(await page.locator('.dsg-finance-card').count(),1);await page.clock.runFor(200);assert.equal(await page.locator('.dsg-finance-card').count(),0);
 await page.locator('.dsg-character').click({position:{x:90,y:45}});await page.clock.runFor(20);await page.locator('.dsg-finance-card').hover();await page.clock.runFor(11000);assert.equal(await page.locator('.dsg-finance-card').count(),1);await page.mouse.move(10,300);await page.clock.runFor(20);assert.equal(await page.locator('.dsg-finance-card').count(),0);
 await page.locator('.dsg-character').click({position:{x:90,y:45}});await page.clock.runFor(20);await page.locator('.dsg-finance-card').focus();await page.clock.runFor(11000);assert.equal(await page.locator('.dsg-finance-card').count(),1);await page.locator('#outside').focus();await page.clock.runFor(20);assert.equal(await page.locator('.dsg-finance-card').count(),0);
 await page.locator('.dsg-character').click({position:{x:90,y:45}});await page.clock.runFor(20);assert.equal(await page.locator('.dsg-finance-card').count(),1);await page.locator('.dsg-food').click();await page.clock.runFor(20);assert.equal(await page.locator('.dsg-finance-card').count(),0);await page.clock.fastForward(13200);
 await open();await page.locator('#outside').click();assert.equal(await page.locator('.dsg-menu').count(),0);
 await open();await wheelAction(page,'关闭摸头显示账本');await page.keyboard.press('Escape');await page.locator('.dsg-character').click({position:{x:90,y:45}});await page.clock.runFor(20);assert.equal(await page.locator('.dsg-finance-card').count(),0);
 await open();await wheelAction(page,'开启摸头显示账本');await page.keyboard.press('Escape');
 // Every wheel page fits all corners, including English labels at 280px width.
 for(const [w,h,locale]of [[280,360,'zh'],[280,360,'en'],[960,640,'en']]){
 await page.setViewportSize({width:w,height:h});await page.evaluate(locale=>{__props.t=k=>__language[locale][k]||k;__rerender();},locale);
 for(const [x,y]of [[0,0],[9999,0],[0,9999],[9999,9999]]){
 await page.evaluate(({x,y})=>{const p=JSON.parse(localStorage.getItem('deepseek-girl.preferences.v1'));localStorage.setItem('deepseek-girl.preferences.v1',JSON.stringify({...p,x,y}));window.dispatchEvent(new Event('deepseek-girl-preferences'));},{x,y});await page.clock.runFor(20);
 await open();onScreen(await page.locator('.dsg-menu').boundingBox(),w,h);
 await wheelAction(page,locale==='zh'?'表情预览':'Expressions');onScreen(await page.locator('.dsg-menu').boundingBox(),w,h);assert.equal(await page.locator('.dsg-wheel>button').count(),7);await page.getByRole('button',{name:locale==='zh'?'下一页表情':'Next expressions',exact:true}).click();await page.clock.runFor(180);onScreen(await page.locator('.dsg-menu').boundingBox(),w,h);
 if(w===280&&locale==='en'&&x===9999&&y===9999)await page.screenshot({path:path.join(proof,'wheel-narrow-en.png')});await page.keyboard.press('Escape');}
 }
 await page.emulateMedia({reducedMotion:'reduce'});await open();assert.equal(await page.locator('.dsg-menu').evaluate(el=>getComputedStyle(el).animationName),'none');await page.keyboard.press('Escape');
 assert.deepEqual(await page.evaluate(()=>__fixtureErrors),[]);assert.deepEqual(requests,[]);await page.evaluate(()=>__unmount());
 const result={passed:true,sixPrimaryActions:true,hostCornerShapeIsolated:true,secondarySettingsAndExpressions:true,menuUnder300px:true,offlineHandwriting:true,keyboardAndFocus:true,outsideDismiss:true,transientLedger10Seconds:true,feedingHidesLedger:true,hoverAndFocusHold:true,disablePatLedger:true,allCorners:true,narrowChineseAndEnglish:true,reducedMotion:true,externalRequests:requests,errors:[]};fs.writeFileSync(path.join(proof,'verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
