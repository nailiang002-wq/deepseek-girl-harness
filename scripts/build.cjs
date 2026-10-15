const fs=require('fs'),path=require('path');
const sharp=require('sharp');
const dest=path.resolve(__dirname,'..'),src=path.join(dest,'assets');
const interactions=src;
const definitions=JSON.parse(fs.readFileSync(path.join(src,'manifest.json'),'utf8')).states;
(async()=>{const assets={},spriteCss=[];for(const [state,definition]of Object.entries(definitions)){const timing=definition.delays,count=timing.length,frames=[];for(let i=0;i<count;i++){frames.push(await sharp(path.join(src,'frames',definition.sourceFolder||state,String(i).padStart(2,'0')+'.png')).resize(320,320).png().toBuffer());}
const strip=await sharp({create:{width:count*320,height:320,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(frames.map((input,i)=>({input,left:i*320,top:0}))).webp({quality:90,alphaQuality:100}).toBuffer();
const still=await sharp(frames[0]).webp({quality:90,alphaQuality:100}).toBuffer();
const loop=definition.loop,duration=timing.reduce((a,b)=>a+b,0);assets[state]={strip:'data:image/webp;base64,'+strip.toString('base64'),still:'data:image/webp;base64,'+still.toString('base64'),delays:timing,duration,loop,count};
let elapsed=0;const stops=timing.map((delay,i)=>{const stop=`${(elapsed/duration*100).toFixed(6)}%{transform:translate3d(${(-i/count*100).toFixed(6)}%,0,0)}`;elapsed+=delay;return stop;});stops.push(`100%{transform:translate3d(${loop?0:(-(count-1)/count*100).toFixed(6)}%,0,0)}`);spriteCss.push(`@keyframes dsg-frames-${state}{${stops.join('')}}`);
}
const props={};for(const id of ['hat','rice']){const buffer=await sharp(path.join(interactions,'props',id+'.png')).resize({width:320}).webp({quality:92,alphaQuality:100}).toBuffer();props[id]='data:image/webp;base64,'+buffer.toString('base64');}
const font=fs.readFileSync(path.join(src,'fonts/greeting-hand.woff2'));
const code=fs.readFileSync(path.join(dest,'client.template.js'),'utf8').replace('__ASSETS__',JSON.stringify(assets)).replace('__PROPS__',JSON.stringify(props)).replace('__GREETING_FONT__','data:font/woff2;base64,'+font.toString('base64')).replace('__SPRITE_CSS__',spriteCss.join('\n')).replace('__LOGIC__',fs.readFileSync(path.join(dest,'logic.js'),'utf8').replace(/export /g,''));fs.writeFileSync(path.join(dest,'client.js'),code);
fs.mkdirSync(path.join(dest,'.cache'),{recursive:true});fs.writeFileSync(path.join(dest,'.cache/animation-assets.json'),JSON.stringify(assets));
await sharp(path.join(src,'frames/idle/00.png')).resize(128,128).png().toFile(path.join(dest,'icon.png'));console.log(JSON.stringify({bundleBytes:Buffer.byteLength(code),states:Object.keys(assets),frames:Object.values(assets).reduce((sum,asset)=>sum+asset.count,0)}));})();
