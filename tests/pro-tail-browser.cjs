const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),sharp=require('sharp');
const {chromium}=require('playwright'),{browserFixture,wheelAction}=require('./browser-support.cjs');
const {fixture,mount}=browserFixture(),proof=path.resolve('.cache/pro-tail-browser');fs.mkdirSync(proof,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.DSG_BROWSER_PATH,headless:true});try{
 const context=await browser.newContext({viewport:{width:760,height:620}}),externalRequests=[];
 context.on('request',r=>{if(!r.url().startsWith('http://tail.test/')&&!r.url().startsWith('data:'))externalRequests.push(r.url());});
 await context.route('http://tail.test/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#fffaf2;color:#45647d;font-family:Microsoft YaHei,Arial;--dsw-alias-label-secondary:#6d8196;--dsw-alias-bg-layer-1:white;--dsw-alias-border-l2:#d9e2ec}header{padding:28px 34px;border-bottom:1px solid #e5e1d8;background:#fff}h1{font-size:23px;font-weight:500;margin:10px 0}small{color:#8f9fae}.note{margin:22px 34px;font-size:14px;line-height:1.8}</style><header><small>DEEPSEEK GIRL · LOCAL TEST</small><h1>身体站稳，只让尾巴轻轻摆动。</h1><small>A steady pose. A gentle tail.</small></header><p class="note">保留喂饭动作<br>取消整个人物的左右位移和摇摆</p><div id="mount"></div>'}));
 const page=await context.newPage();await page.goto('http://tail.test/');await page.addScriptTag({content:fixture});await page.evaluate(()=>{localStorage.setItem('deepseek-girl.preferences.v1',JSON.stringify({x:440,y:300,size:260,outfit:'maid',hat:false,greetingsEnabled:false,beggingEnabled:false}));window.__models={subscribe:()=>()=>{},getSnapshot:()=>window.__modelSnapshot};window.__modelSnapshot={status:'ready',current:{model:'deepseek-v4-pro'}};});
 await page.addScriptTag({content:fs.readFileSync('client.js','utf8')});await page.addScriptTag({content:mount.replace("sessionId:'animation-browser-test',","sessionId:'animation-browser-test',modelSource:__models,")});await page.waitForSelector('.dsg-pro-tail');
 const labels={idle:'待机',thinking:'思考中',generating:'正在回答',success:'完成啦',error:'遇到错误',dragging:'被拎起来啦',drop:'落地啦',sleeping:'休息中',begging:'捧盆求喂饭',petting:'被摸头',pouting:'鼓脸啦'},checked=[];
 async function ready(state){await page.waitForFunction(state=>document.querySelector('.dsg-pro-rig')?.dataset.state===state&&document.querySelector('.dsg-pro-body .dsg-clip')?.getAttribute('aria-busy')==='false'&&document.querySelector('.dsg-pro-body .dsg-art')?.complete,state);}
 async function sample(time){return page.evaluate(async time=>{const tail=document.querySelector('.dsg-pro-tail'),a=tail.getAnimations()[0];a.pause();a.currentTime=time;await new Promise(requestAnimationFrame);return{matrix:getComputedStyle(tail).transform,body:getComputedStyle(document.querySelector('.dsg-motion')).transform};},time);}
 for(const [state,label]of Object.entries(labels)){
  await wheelAction(page,label);await ready(state);const box=await page.locator('.dsg-character').boundingBox(),roi={left:Math.ceil(box.x+box.width*.45),top:Math.ceil(box.y+box.height*(state==='eating'?.53:.02)),width:Math.floor(box.width*.4),height:Math.floor(box.height*(state==='eating'?.43:.94))};
  const samples=[],matrices=new Set(),renders=await page.evaluate(()=>__rootRenders);
  for(const time of [0,1100,2200,3300]){const s=await sample(time);assert.equal(s.body,'none');matrices.add(s.matrix);samples.push(await sharp(await page.screenshot()).extract(roi).raw().toBuffer());}
  assert.ok(matrices.size>=3);for(const img of samples.slice(1))assert.deepEqual(img,samples[0],`${state}: fixed face/body/feet pixels must not drift`);
  assert.equal(await page.locator('.dsg-pro-body .dsg-art').evaluate(img=>img.getAnimations().length),0);assert.equal(await page.evaluate(()=>__rootRenders),renders);checked.push(state);
 }
 await wheelAction(page,'跟随当前任务');await page.evaluate(()=>{__running=false;__rerender();});await ready('idle');
 const frames=[],width=760,height=620,step=40;
 for(let time=0;time<4400;time+=step){await sample(time);frames.push(await sharp(await page.screenshot()).ensureAlpha().raw().toBuffer());}
 await sharp(Buffer.concat(frames),{raw:{width,height:height*frames.length,channels:4,pageHeight:height}}).gif({loop:0,delay:Array(frames.length).fill(step),colours:128,dither:0,effort:6}).toFile(path.join(proof,'tail-only.gif'));
 await sample(1100);await page.screenshot({path:path.join(proof,'tail-only.png')});
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});assert.equal(await page.locator('.dsg-pro-tail').evaluate(el=>el.getAnimations()[0].playState),'paused');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'));});await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('.dsg-pro-tail')?.getAnimations().length===0);assert.equal(await page.locator('.dsg-pro-body .dsg-art').evaluate(img=>img.getAnimations().length),0);
 assert.deepEqual(externalRequests,[]);assert.deepEqual(await page.evaluate(()=>__fixtureErrors),[]);await page.evaluate(()=>__unmount());
 const result={passed:true,states:checked,bodyPixelIdenticalAcrossTailCycle:true,tailOnlyRotation:true,noPerFrameReactRenders:true,feedingCheckedSeparately:'pro-meal-browser.cjs',hiddenPaused:true,reducedMotion:true,externalRequests,errors:[]};fs.writeFileSync(path.join(proof,'verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
