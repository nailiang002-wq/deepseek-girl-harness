const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..');
async function buildAfterMeal(){
 const {AFTER_MEAL_DELAYS}=await import('../companion.js');
 const result={};
 for(const outfit of ['maid','hoodie','pajamas','winter-puffer','winter-cape','pro','pro-winter-puffer','pro-winter-cape']){
  const folder=path.join(root,'assets/after-meal',outfit);
  const manifest=JSON.parse(fs.readFileSync(path.join(folder,'manifest.json'),'utf8'));
  const frames=[];
  for(let index=0;index<6;index++) frames.push(await sharp(path.join(folder,'frames',String(index).padStart(2,'0')+'.png')).resize(320,manifest.portrait?480:320).png().toBuffer());
  const height=manifest.portrait?480:320;
  const strip=await sharp({create:{width:1920,height,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(frames.map((input,index)=>({input,left:index*320,top:0}))).webp({quality:90,alphaQuality:100}).toBuffer();
  const still=await sharp(frames[5]).webp({quality:90,alphaQuality:100}).toBuffer();
  result[outfit]={outfit,count:6,sequence:[0,1,2,3,4,5],delays:AFTER_MEAL_DELAYS,duration:AFTER_MEAL_DELAYS.reduce((a,b)=>a+b,0),loop:false,strip:'data:image/webp;base64,'+strip.toString('base64'),still:'data:image/webp;base64,'+still.toString('base64'),hat:manifest.hat,alignment:manifest.alignment};
 }
 return result;
}
module.exports={buildAfterMeal};
