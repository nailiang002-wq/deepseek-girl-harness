const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright'),{browserFixture}=require('./browser-support.cjs');
const {fixture,mount}=browserFixture();
const output=path.resolve('.cache/greeting-browser');fs.mkdirSync(output,{recursive:true});
(async()=>{
  const browser=await chromium.launch({...(process.env.DSG_BROWSER_PATH?{executablePath:process.env.DSG_BROWSER_PATH}:{}),headless:true});
  try{
    const context=await browser.newContext({viewport:{width:640,height:480},timezoneId:'Asia/Shanghai'}),externalRequests=[];
    context.on('request',request=>{if(!request.url().startsWith('http://mascot.test/')&&!request.url().startsWith('data:'))externalRequests.push(request.url());});
    await context.route('http://mascot.test/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><style>body{margin:0;background:#f5f7ff;--dsw-alias-bg-layer-1:white;--dsw-alias-bg-layer-2:#f5f7fb;--dsw-alias-label-primary:#202535;--dsw-alias-label-secondary:#626777;--dsw-alias-border-l2:#d8dee8;font-family:Arial}</style><body><div id="mount"></div></body></html>'}));
    const page=await context.newPage();await page.goto('http://mascot.test/');await page.clock.setFixedTime(new Date('2026-10-12T08:00:00+08:00'));
    await page.addScriptTag({content:fixture});await page.addScriptTag({content:fs.readFileSync('client.js','utf8')});await page.addScriptTag({content:mount});await page.waitForSelector('.dsg-character');
    const periods=[['morning','08:00'],['noon','12:00'],['afternoon','15:00'],['evening','19:00'],['late','23:30']];
    async function hello(language,time,preferences={}){
      await page.clock.setFixedTime(new Date(`2026-10-12T${time}:00+08:00`));
      await page.evaluate(({language,preferences})=>{__running=false;__props.t=key=>__language[language][key]||key;__rerender();const prior=JSON.parse(localStorage.getItem('deepseek-girl.preferences.v1')||'{}');localStorage.setItem('deepseek-girl.preferences.v1',JSON.stringify({...prior,greetingsEnabled:false,beggingEnabled:false,x:238,y:270,size:164,...preferences}));window.dispatchEvent(new Event('deepseek-girl-preferences'));},{language,preferences});
      await page.waitForFunction(()=>document.querySelector('.dsg-root')?.dataset.deepseekGirlState==='idle');
      await page.locator('.dsg-character').press('Enter');await page.getByRole('button',{name:language==='zh'?'和我打个招呼':'Say hello',exact:true}).click();
      await page.locator('.dsg-greeting').waitFor();await page.evaluate(()=>document.fonts.load('18px "DSG Greeting Hand"'));await page.waitForTimeout(240);
    }
    async function bounds(){return page.locator('.dsg-greeting').evaluate(element=>{const box=element.getBoundingClientRect(),text=element.querySelector('.dsg-greeting-text'),style=getComputedStyle(element);return{x:box.x,y:box.y,width:box.width,height:box.height,viewport:[innerWidth,innerHeight],side:element.dataset.side,family:style.fontFamily,background:element.querySelector('svg path').getAttribute('fill'),fontSize:style.fontSize,scrollHeight:text.scrollHeight,clientHeight:text.clientHeight};});}
    function onScreen(box){assert.ok(box.x>=0&&box.y>=0,JSON.stringify(box));assert.ok(box.x+box.width<=box.viewport[0]+.5,JSON.stringify(box));assert.ok(box.y+box.height<=box.viewport[1]+.5,JSON.stringify(box));}
    const cases=[];
    for(const language of ['zh','en'])for(const [period,time]of periods){
      await hello(language,time);const box=await bounds();onScreen(box);assert.equal(box.scrollHeight,box.clientHeight);assert.match(box.family,/DSG Greeting Hand/);assert.equal(box.fontSize,'18px');
      const text=await page.locator('.dsg-greeting-text').innerText();const expected=await page.evaluate(({language,period})=>__language[language]['greet_'+period],{language,period});assert.equal(text,expected);cases.push({language,period,height:box.height});
      if(language==='zh'&&period==='morning')await page.screenshot({path:path.join(output,'morning.png')});
      if(language==='en'&&period==='noon')await page.screenshot({path:path.join(output,'english.png')});
      await page.locator('.dsg-greeting button').click();assert.equal(await page.locator('.dsg-greeting').count(),0);
    }
    const font=await page.evaluate(()=>[...document.fonts].find(font=>font.family==='DSG Greeting Hand')?.status);assert.equal(font,'loaded');
    for(const [x,y]of [[0,0],[9999,0],[0,9999],[9999,9999]]){await hello('en','12:00',{x,y});onScreen(await bounds());await page.locator('.dsg-greeting button').click();}
    await page.setViewportSize({width:320,height:240});await hello('zh','23:30',{x:0,y:0,size:96});onScreen(await bounds());await page.setViewportSize({width:250,height:180});await page.waitForTimeout(240);onScreen(await bounds());
    await page.setViewportSize({width:640,height:480});await page.locator('.dsg-greeting button').click();
    await page.evaluate(()=>{document.body.style.background='#1f273b';document.body.style.setProperty('--dsw-alias-bg-layer-1','#263248');document.body.style.setProperty('--dsw-alias-label-primary','#f3f6ff');});
    await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});await hello('zh','23:30');const dark=await bounds();assert.equal(dark.background,'#fff9ee');assert.equal(await page.locator('.dsg-greeting').evaluate(element=>element.getAnimations().length),0);await page.screenshot({path:path.join(output,'night.png')});
    fs.writeFileSync(path.join(output,'night-bubble.html'),await page.locator('.dsg-greeting').evaluate(element=>element.outerHTML));
    assert.deepEqual(externalRequests,[]);assert.deepEqual(await page.evaluate(()=>__fixtureErrors),[]);await page.evaluate(()=>__unmount());assert.equal(await page.locator('.dsg-root').count(),0);
    const report={passed:true,version:JSON.parse(fs.readFileSync('package.json','utf8')).version,fontLoaded:true,externalRequests,cases,corners:4,narrowWindowResize:true,darkPaperContrast:true,reducedMotion:true,dismissal:true};
    fs.writeFileSync(path.join(output,'verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
