import assert from 'node:assert/strict';
import {modelForm,formGeometry,isHeadTap,MORPH_DURATION,MODEL_SETTLE_MS} from '../model-form.js';
import {geometry,greetingGeometry} from '../logic.js';
for(const model of ['deepseek-pro','deepseek-v4.1-pro','deepseek-v4-pro-1017',' DEEPSEEK-PRO '])assert.equal(modelForm({status:'ready',current:{model}}),'pro');
for(const model of ['deepseek-flash','deepseek-v4.1-flash','deepseek-chat','some-provider-pro','other-model'])assert.equal(modelForm({status:'ready',current:{model}}),'flash');
for(const status of ['loading','selecting','error','idle'])assert.equal(modelForm({status,current:{model:'deepseek-flash'}},{next:{model:'deepseek-pro'}}),null);
assert.equal(modelForm(null,{next:{model:'deepseek-pro'}}),'pro');assert.equal(modelForm(null,{next:null,lastUsed:{model:'deepseek-flash'}}),'flash');assert.equal(modelForm(null,{}),null);assert.equal(modelForm({status:'ready',current:{model:33}}),null);
const base={x:420,y:350,size:144},flash=formGeometry(base,900,700),pro=formGeometry(base,900,700,'pro');assert.equal(flash.y+flash.height,pro.y+pro.height);assert.equal(flash.x+flash.width/2,pro.x+pro.width/2);assert.ok(pro.height>flash.height);assert.ok(pro.width<flash.width*1.11);
for(const [w,h]of [[1280,800],[280,360],[250,180],[40,30]])for(const x of [0,9999])for(const y of [0,9999]){const prefs=geometry({x,y,size:320},w,h),box=formGeometry(prefs,w,h,'pro');assert.ok(box.x>=0&&box.y>=0);assert.ok(box.x+box.width<=w+.01&&box.y+box.height<=h+.01);const bubble=greetingGeometry(prefs,w,h,110,box);assert.ok(bubble.left>=0&&bubble.top>=0&&bubble.left+bubble.width<=w+.01&&bubble.top+Math.min(110,bubble.maxHeight)<=h+.01);}
assert.ok(isHeadTap(.5,.13,'pro'));assert.equal(isHeadTap(.5,.55,'pro'),false);assert.equal(isHeadTap(.12,.12,'pro'),false);assert.ok(isHeadTap(.5,.55,'flash'));assert.equal(MORPH_DURATION,2200);assert.equal(MODEL_SETTLE_MS,450);
console.log(JSON.stringify({passed:true,officialModelFamilies:true,pendingAndFailureNeverSwitch:true,defaultProjectionFallback:true,footAndCenterAnchor:true,portraitFitsCorners:true,headHitArea:true}));
