const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {browserFixture}=require('./browser-support.cjs');
const {fixture,mount}=browserFixture();
const proof=path.resolve('.cache/companion-browser');
fs.mkdirSync(proof,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.DSG_BROWSER_PATH,headless:true});
 try{
  const context=await browser.newContext({viewport:{width:820,height:660}});
  await context.route('http://mascot.test/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><style>body{margin:0;background:#f5f7fb;font-family:Arial}</style><body><div id="mount"></div></body></html>'}));
  const page=await context.newPage();
  await page.clock.install({time:new Date(2026,10,7,10)});
  async function boot(form='flash'){
   await page.goto('http://mascot.test/');await page.addScriptTag({content:fixture});
   await page.addScriptTag({content:fs.readFileSync('client.js','utf8')});
   await page.addScriptTag({content:mount.replace("window.__running=true;","window.__running=false;").replace("sessionId:'animation-browser-test',",`sessionId:'animation-browser-test',modelSource:{subscribe:()=>()=>{},getSnapshot:()=>window.__model},`).replace('window.__props=',`window.__model={status:'ready',current:{model:'deepseek-${form}'}};window.__status={endSeq:0,outcome:'idle'};window.__props=`).replace("useProjection:()=>({endSeq:1,outcome:'working'})","useProjection:()=>__status")});
   await page.locator('.dsg-character').waitFor();
  }
  const prefs=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('deepseek-girl.preferences.v1')));
  const journal=async()=>{await page.locator('.dsg-character').press('Enter');await page.getByRole('button',{name:'陪伴手账',exact:true}).click();await page.getByRole('dialog',{name:'我们的小小默契'}).waitFor();};
  await boot();await journal();
  assert.equal(await page.locator('#dsg-companion-name').evaluate(el=>el===document.activeElement),true);
  await page.locator('#dsg-companion-name').fill('小船长');await page.getByRole('button',{name:'记住这个称呼'}).click();assert.equal((await prefs()).nickname,'小船长');
  await page.keyboard.press('Escape');assert.equal(await page.locator('.dsg-bond-panel').count(),0);
  await page.locator('.dsg-food').click();assert.equal((await prefs()).companion.points,3);
  await page.locator('.dsg-greeting').waitFor();assert.match(await page.locator('.dsg-greeting-text').innerText(),/小船长，白饭/);
  await page.clock.runFor(13200);assert.match(await page.locator('.dsg-greeting-text').innerText(),/吃饱/);
  await page.locator('.dsg-character').click({position:{x:70,y:40}});assert.equal((await prefs()).companion.points,4);
  await page.locator('.dsg-finance-card .dsg-companion-line').waitFor();const flash=await page.locator('.dsg-companion-line').innerText();assert.match(flash,/小船长/);
  await page.locator('.dsg-character').click({position:{x:70,y:40}});assert.equal((await prefs()).companion.points,4);
  await page.evaluate(()=>{__status={endSeq:1,outcome:'completed'};__rerender();});await page.waitForFunction(()=>JSON.parse(localStorage.getItem('deepseek-girl.preferences.v1')).companion.points===6);
  await boot('pro');assert.equal((await prefs()).companion.points,6);
  await page.evaluate(()=>{__status={endSeq:1,outcome:'completed'};__rerender();});await page.clock.runFor(50);assert.equal((await prefs()).companion.points,6);
  await page.evaluate(()=>{__status={endSeq:2,outcome:'error'};__rerender();});await page.clock.runFor(50);assert.equal((await prefs()).companion.points,6);
  await page.evaluate(()=>{__status={endSeq:3,outcome:'stopped'};__rerender();});await page.clock.runFor(50);assert.equal((await prefs()).companion.points,6);
  await page.locator('.dsg-character').click({position:{x:75,y:30}});await page.locator('.dsg-companion-line').waitFor();assert.notEqual(await page.locator('.dsg-companion-line').innerText(),flash);
  await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('deepseek-girl.preferences.v1'));localStorage.setItem('deepseek-girl.preferences.v1',JSON.stringify({...p,companion:{...p.companion,points:160},financeVisible:false}));window.dispatchEvent(new Event('deepseek-girl-preferences'));});
  await journal();assert.match(await page.locator('.dsg-bond-panel').innerText(),/默契搭档/);await page.evaluate(()=>document.fonts.ready);assert.match(await page.locator('.dsg-bond-panel').evaluate(el=>getComputedStyle(el).fontFamily),/DSG Greeting Hand/);await page.screenshot({path:path.join(proof,'journal.png')});
  await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'收起手账');await page.keyboard.press('Tab');assert.equal(await page.locator('#dsg-companion-name').evaluate(el=>el===document.activeElement),true);
  await page.setViewportSize({width:280,height:360});
  const bounds=await page.locator('.dsg-bond-panel').boundingBox();assert.ok(bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=280&&bounds.y+bounds.height<=360);
  await page.getByRole('button',{name:'收起手账'}).click();
  await page.locator('.dsg-character').click({position:{x:75,y:30}});await page.locator('.dsg-greeting-text').waitFor();assert.match(await page.locator('.dsg-greeting-text').innerText(),/小船长，.*放松/);
  await page.evaluate(()=>{__props.t=key=>__language.en[key]||key;__rerender();});
  await page.locator('.dsg-character').press('Enter');await page.getByRole('button',{name:'Companion journal',exact:true}).click();await page.getByRole('dialog',{name:'Getting to know you'}).waitFor();assert.match(await page.locator('.dsg-bond-panel').innerText(),/In sync/);await page.getByRole('button',{name:'Close journal'}).click();
  assert.deepEqual(await page.evaluate(()=>__fixtureErrors),[]);await page.evaluate(()=>__unmount());assert.equal(await page.locator('.dsg-root').count(),0);
  const result={passed:true,namePersists:true,feedAndMealReplies:true,patCooldown:true,taskReward:true,taskReplayAndFailureIgnored:true,formMemory:true,proPersonality:true,stageUnlock:true,smallWindow:true,handwriting:true,focusTrap:true,english:true,cleanup:true};
  fs.writeFileSync(path.join(proof,'verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
