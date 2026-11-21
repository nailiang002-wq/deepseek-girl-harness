import assert from 'node:assert/strict';
import fs from 'node:fs';
import sharp from 'sharp';
import {AFTER_MEAL_DURATION,feedingVisit,awardCompanion,pendingMilestone,companionDictionaries} from '../companion.js';

const now=new Date(2026,10,21,10).getTime();
assert.equal(AFTER_MEAL_DURATION,3700);
assert.deepEqual(feedingVisit({},now),{streak:1,event:'feed'});
assert.deepEqual(feedingVisit({lastFed:now-20000},now),{streak:2,event:'feedAgain'});
assert.deepEqual(feedingVisit({lastFed:now-20000,mealStreak:2},now),{streak:3,event:'feedThird'});
assert.equal(feedingVisit({lastFed:now-300001,mealStreak:3},now).streak,1);
assert.equal(feedingVisit({lastFed:now+1,mealStreak:3},now).streak,1);
const first=awardCompanion({points:39},'feed',now);
assert.equal(first.points,42);assert.equal(pendingMilestone(first,now).level,1);
const again=awardCompanion(first,'feed',now+1000);
assert.deepEqual(again.milestone,first.milestone);
const consumed={...first,milestone:null};
assert.equal(awardCompanion(consumed,'pet',now+1000).milestone,null);
assert.equal(awardCompanion({points:157},'feed',now).milestone.level,2);
assert.equal(awardCompanion({points:180},'feed',now).milestone,null);
assert.equal(pendingMilestone({milestone:{level:3,time:now}},now),null);
assert.equal(pendingMilestone({milestone:{level:1,time:now+1}},now),null);
const dictionaries=companionDictionaries();
for(const language of ['zh','en'])for(const form of ['flash','pro'])for(const event of ['feedAgain','feedThird','levelup'])for(let level=0;level<3;level++)assert.ok(dictionaries[language][`reply_${form}_${event}_${level}`]);
const built=JSON.parse(fs.readFileSync('.cache/after-meal-assets.json','utf8'));
assert.equal(Object.keys(built).length,8);
for(const [outfit,asset] of Object.entries(built)){
 const folder='assets/after-meal/'+outfit;
 const manifest=JSON.parse(fs.readFileSync(folder+'/manifest.json','utf8'));
 assert.equal(asset.count,6);assert.equal(asset.duration,3700);assert.equal(asset.loop,false);
 for(let index=0;index<6;index++){
  const {data,info}=await sharp(folder+'/frames/'+String(index).padStart(2,'0')+'.png').raw().toBuffer({resolveWithObject:true});
  assert.equal(info.width,512);assert.equal(info.height,manifest.portrait?768:512);assert.equal(info.channels,4);
  let clear=0,left=info.width,right=0,top=info.height,bottom=0;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const alpha=data[(y*info.width+x)*4+3];if(!alpha)clear++;if(alpha>=128){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}}
  assert.ok(clear>info.width*info.height*.2);
  assert.ok(left>=6&&right<info.width-6&&top>=6&&bottom<info.height-6,`${outfit} frame ${index} clipped`);
  const landmark=manifest.alignment.measured[index].head,target=manifest.alignment.target.head;
  assert.ok(Math.hypot(landmark[0]-target[0],landmark[1]-target[1])<.8,`${outfit} head moves`);
 }
 const atlas=await sharp(Buffer.from(asset.strip.split(',')[1],'base64')).metadata();
 assert.equal(atlas.width,1920);assert.equal(atlas.height,manifest.portrait?480:320);
}
console.log(JSON.stringify({passed:true,outfits:8,completeFrames:48,alpha:true,headAlignment:true,noClipping:true,repeatFeeding:true,milestonesOnce:true,legacyProgress:true}));
