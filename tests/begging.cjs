const assert=require('node:assert/strict'),{createHarness}=require('./greetings.cjs');
const start=new Date(2026,9,28,14).getTime(),MIN=600000,MAX=900000;
const storage=()=>new Map([['deepseek-girl.preferences.v1',JSON.stringify({greetingsEnabled:false,financeVisible:false})]]);
const state=h=>h.find(n=>n.props?.className==='dsg-root').props['data-deepseek-girl-state'];
function awakeAdvance(h,ms){while(ms>0){const part=Math.min(ms,60000);h.wake();h.tick(part);ms-=part;}}
let data=storage(),h=createHarness(data,start),due=h.prefs().nextBegAt;
assert.ok(due-start>=MIN&&due-start<=MAX);
awakeAdvance(h,due-start-1);assert.equal(state(h),'idle');h.tick(1);assert.equal(state(h),'begging');
let next=h.prefs().nextBegAt;assert.ok(next-due>=MIN&&next-due<=MAX);h.tick(6000);assert.equal(state(h),'idle');
// Remounts retain the deadline instead of restarting or shortening the wait.
h.unmount();h=createHarness(data,due+6000);assert.equal(h.prefs().nextBegAt,next);awakeAdvance(h,next-(due+6000)-1);assert.equal(state(h),'idle');h.tick(1);assert.equal(state(h),'begging');
// Feeding cancels the current request and starts a fresh 10–15 minute wait.
h.find(n=>n.props?.className==='dsg-food').props.onClick();h.tick(0);assert.equal(state(h),'eating');const fedAt=h.prefs().lastFed,afterFood=h.prefs().nextBegAt;assert.ok(afterFood-fedAt>=MIN&&afterFood-fedAt<=MAX);
awakeAdvance(h,MIN-1);assert.notEqual(state(h),'begging');awakeAdvance(h,afterFood-fedAt-(MIN-1));assert.equal(state(h),'begging');h.unmount();
// Sleep and hidden windows defer an overdue request until wake/visibility.
h=createHarness(storage(),start);due=h.prefs().nextBegAt;h.tick(due-start+1);assert.equal(state(h),'sleeping');h.wake();h.tick(0);assert.equal(state(h),'begging');h.unmount();
h=createHarness(storage(),start);due=h.prefs().nextBegAt;h.hidden(true);awakeAdvance(h,due-start+1);assert.notEqual(state(h),'begging');h.hidden(false);h.tick(0);assert.equal(state(h),'begging');h.unmount();
// Active tasks defer the request, and disabling it cancels the timer.
h=createHarness(storage(),start);due=h.prefs().nextBegAt;h.setRunning(true);h.tick(due-start+1);assert.equal(state(h),'thinking');h.setRunning(false);h.tick(0);assert.equal(state(h),'begging');h.unmount();
h=createHarness(storage(),start);h.change({beggingEnabled:false});awakeAdvance(h,MAX+1);assert.notEqual(state(h),'begging');h.unmount();
(async()=>{const{nextBegAt,savedBegAt}=await import('../logic.js');assert.equal(nextBegAt(start,0),start+MIN);assert.equal(nextBegAt(start,1),start+MAX);assert.equal(savedBegAt({nextBegAt:Infinity},start),0);assert.equal(savedBegAt({nextBegAt:start+MAX+1},start),0);assert.equal(savedBegAt({lastFed:start,nextBegAt:start-1},start),start+MIN);console.log(JSON.stringify({passed:true,intervalMinutes:[10,15],firstAndRepeatedRequests:true,feedingRestartsWait:true,remountPreservesDeadline:true,sleepBusyHiddenDeferral:true,disabled:true,timerCleanup:true}));})().catch(e=>{console.error(e);process.exitCode=1;});
