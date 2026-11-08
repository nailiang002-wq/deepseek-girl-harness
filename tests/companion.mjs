import assert from 'node:assert/strict';
import {awardCompanion,companionProgress,normalizeNickname,companionDictionaries,companionLine} from '../companion.js';

const start=new Date(2026,10,7,10).getTime();
assert.equal(companionProgress(undefined,start).points,0);
assert.equal(companionProgress({points:NaN,earned:Infinity},start).level,0);
assert.equal(normalizeNickname('  小鲸\n鱼\u202e  '),'小鲸鱼');
assert.equal(Array.from(normalizeNickname('🐳'.repeat(20))).length,16);
let bond=awardCompanion(undefined,'feed',start);
assert.equal(bond.points,3);
bond=awardCompanion(bond,'feed',start+1000);
assert.equal(bond.points,3);
bond=awardCompanion(bond,'pet',start+1000);
assert.equal(bond.points,4);
bond=awardCompanion(bond,'pet',start+2000);
assert.equal(bond.points,4);
for(let i=1;i<7;i++){
  bond=awardCompanion(bond,'feed',start+i*120000);
  bond=awardCompanion(bond,'pet',start+i*120000);
  bond=awardCompanion(bond,'task',start+i*120000,{sessionId:'test-session',seq:i});
}
assert.equal(bond.points,20);
assert.equal(bond.earned,20);
const nextDay=start+86400000;
assert.equal(companionProgress(bond,nextDay).earned,0);
assert.equal(awardCompanion(bond,'task',nextDay,{sessionId:'test-session',seq:6}).points,20);
bond=awardCompanion(bond,'task',nextDay,{sessionId:'test-session',seq:7});
assert.equal(bond.points,22);
assert.equal(bond.earned,2);
assert.equal(awardCompanion(bond,'task',nextDay,{sessionId:'test-session',seq:6}).points,22);
assert.equal(awardCompanion(bond,'task',nextDay).points,22);
assert.equal(companionProgress({points:40},start).level,1);
assert.equal(companionProgress({points:160},start).level,2);
for(let i=0;i<60;i++) bond=awardCompanion(bond,'task',nextDay,{sessionId:'session-'+i,seq:1});
assert.equal(Object.keys(bond.completed).length,32);
bond=awardCompanion(bond,'task',nextDay,{sessionId:'__proto__',seq:2});
assert.equal(Object.getPrototypeOf(bond.completed),Object.prototype);
const dictionaries=companionDictionaries();
for(const language of ['zh','en']){
  const t=key=>key==='nicknameJoin'?(language==='zh'?'，':', '):dictionaries[language][key];
  for(const points of [0,40,160]) for(const form of ['flash','pro']) for(const event of ['morning','noon','afternoon','evening','late','pet','pout','feed','meal','success']){
    const text=companionLine({companion:{points},nickname:'Test'},form,event,t);
    assert.ok(text.startsWith('Test')&&!text.includes('undefined'));
    assert.notEqual(text,companionLine({companion:{points},nickname:'Test'},form==='flash'?'pro':'flash',event,t));
  }
}
console.log(JSON.stringify({passed:true,dailyCap:20,cooldowns:true,taskDedup:true,midnight:true,legacyPrefs:true,unicodeName:true,allFormsAndStages:true,boundedHistory:true}));
