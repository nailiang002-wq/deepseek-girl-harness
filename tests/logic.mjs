import assert from 'node:assert/strict';
import {definition} from '../projection.js';
import {geometry,greetingGeometry,latestAssistantKey,assistantPhase,taskState,visualState,canBeg,lastFedAt,FEED_QUIET_MS,greetingFor,greetingDue,rememberGreeting} from '../logic.js';
let checks=0;function test(name,fn){fn();checks++;console.log('PASS '+name);}
test('durable turn start and outcomes',()=>{let state=definition.init();state=definition.apply(state,{type:'turn/start',seq:1,data:{turn:1}});assert.equal(state.outcome,'working');for(const [kind,outcome]of [['completed','completed'],['error','error'],['aborted','stopped'],['blocked','stopped'],['max-tokens','stopped']]){const end=definition.apply(state,{type:'turn/end',seq:2,data:{turn:1,reason:{kind}}});assert.equal(end.outcome,outcome);definition.stateSchema.parse(end);}assert.equal(definition.apply(state,{type:'request/usage'}),state);});
test('reasoning stays thinking; body streams answering',()=>{assert.equal(assistantPhase({data:{status:'running',blocks:[{kind:'reasoning',text:'reason'}]}}),'thinking');assert.equal(assistantPhase({data:{status:'running',blocks:[{kind:'text',text:'answer'}]}}),'generating');assert.equal(assistantPhase({data:{status:'settled',blocks:[{kind:'text',text:'old answer'}]}}),'thinking');});
test('latest assistant ignores user message',()=>{const nodes=new Map([['a',{kind:'assistant-step'}],['b',{kind:'user-message'}]]);assert.equal(latestAssistantKey({order:['a','b'],nodes}),'a');});
test('running overrides previous error; drag/drop restore task',()=>{assert.equal(taskState(true,'generating',{outcome:'error'},true,true),'generating');assert.equal(taskState(false,'thinking',{outcome:'stopped'},false,false),'idle');assert.equal(visualState('thinking',true,true,'success'),'dragging');assert.equal(visualState('generating',false,true,null),'drop');assert.equal(visualState('generating',false,false,null),'generating');});
test('viewport clamps corrupt/oversized preferences',()=>{assert.deepEqual(geometry({x:-400,y:9999,size:400},800,600),{x:0,y:248,size:320});const tiny=geometry({size:144},40,30);assert.equal(tiny.size,30);assert.ok(tiny.x>=0&&tiny.y>=0);assert.equal(geometry({size:NaN},800,600).size,144);});
test('greeting stays on screen at corners, on narrow windows, and with taller text',()=>{
  for(const [width,height] of [[1280,800],[320,240],[180,130],[40,30]])for(const x of [0,width])for(const y of [0,height])for(const noteHeight of [85,170,500]){
    const box=greetingGeometry({x,y,size:144},width,height,noteHeight);
    assert.ok(box.left>=0&&box.top>=0);assert.ok(box.left+box.width<=width+.01);
    assert.ok(box.top+Math.min(noteHeight,box.maxHeight)<=height+.01);assert.ok(box.tailX>=0&&box.tailX<=box.width);
  }
  assert.equal(greetingGeometry({x:300,y:400,size:144},1280,800,120).side,'above');
  assert.equal(greetingGeometry({x:300,y:0,size:144},1280,800,120).side,'below');
});
test('feeding returns to current task and drag remains available',()=>{assert.equal(visualState('generating',false,false,null,true,false),'eating');assert.equal(visualState('generating',false,false,null,false,false),'generating');assert.equal(visualState('idle',true,false,null,true,true),'dragging');assert.equal(visualState('idle',false,false,null,false,true),'begging');assert.equal(visualState('error',false,false,null,false,true),'error');});
test('begging pauses after food, never replaces active work, and can be disabled',()=>{const now=1000000;assert.equal(canBeg('idle',{},now),true);assert.equal(canBeg('thinking',{},now),false);assert.equal(canBeg('sleeping',{},now),false);assert.equal(canBeg('idle',{beggingEnabled:false},now),false);assert.equal(canBeg('idle',{lastFed:now-1000},now),false);assert.equal(canBeg('idle',{lastFed:now-FEED_QUIET_MS},now),true);assert.equal(lastFedAt(now+9999,now),0);assert.equal(lastFedAt('oops',now),0);});
test('local greeting boundaries and future scheduling',()=>{
  for(const [hour,minute,period,nextHour] of [[0,0,'late',5],[4,59,'late',5],[5,0,'morning',11],[10,59,'morning',11],[11,0,'noon',14],[13,59,'noon',14],[14,0,'afternoon',18],[17,59,'afternoon',18],[18,0,'evening',23],[22,59,'evening',23],[23,0,'late',5]]){
    const date=new Date(2026,9,10,hour,minute,59,900),plan=greetingFor(date);
    assert.equal(plan.period,period);assert.equal(new Date(plan.nextAt).getHours(),nextHour);assert.ok(plan.nextAt>date.getTime());
  }
  assert.equal(greetingFor(new Date(2026,9,10,23)).key,greetingFor(new Date(2026,9,11,2)).key);
  assert.equal(greetingFor(new Date(2027,0,1,2)).key,'2026-12-31:late');
  assert.equal(greetingFor(new Date(2028,2,1,2)).key,'2028-02-29:late');
});
test('greetings persist once per period; disabled, future and invalid timestamps handled',()=>{
  const now=new Date(2026,9,10,20).getTime(),plan=greetingFor(new Date(now));
  assert.equal(greetingDue(plan,{},now),true);assert.equal(greetingDue(plan,{greetingsEnabled:false},now),false);
  const seen=rememberGreeting({},plan.key,now);assert.equal(greetingDue(plan,{greetingSeen:seen},now+9999),false);
  assert.equal(greetingDue(greetingFor(new Date(2026,9,10,23)),{greetingSeen:seen},now),true);
  assert.equal(greetingDue(plan,{greetingSeen:{[plan.key]:now+9999}},now),true);
  assert.equal(greetingDue(plan,{greetingSeen:{[plan.key]:'bad'}},now),true);
  const previous=Object.fromEntries(Array.from({length:30},(_,i)=>[`2026-09-${String(i+1).padStart(2,'0')}:morning`,now-i-1]));
  const bounded=rememberGreeting({...previous,bad:1},plan.key,now);assert.equal(Object.keys(bounded).length,20);assert.equal(bounded.bad,undefined);assert.equal(bounded[plan.key],now);
});
console.log(JSON.stringify({passed:checks}));
