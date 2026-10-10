const fs=require('fs'),path=require('path');
const sharp=require('sharp');
const dest=path.resolve(__dirname,'..'),src=path.join(dest,'assets');
const interactions=src;
const delays={idle:[1800,100,90,130,400,700],thinking:[350,300,130,300,350,350],generating:[180,180,120,180,180,180],success:[160,160,220,160,230,400],error:[800,400,120,200,500,600],dragging:[150,150,150,150,150,150],drop:[100,120,140,160,220,300],sleeping:[450,450,450,450,450,450]};
Object.assign(delays,{eating:[450,450,600,700,650,1100],begging:[400,400,400,220,400,480]});
(async()=>{const assets={},spriteCss=[];for(const [state,timing]of Object.entries(delays)){const frames=[];const source=['eating','begging'].includes(state)?interactions:src;for(let i=0;i<6;i++){frames.push(await sharp(path.join(source,'frames',state,String(i).padStart(2,'0')+'.png')).resize(320,320).png().toBuffer());}
const strip=await sharp({create:{width:1920,height:320,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(frames.map((input,i)=>({input,left:i*320,top:0}))).webp({quality:90,alphaQuality:100}).toBuffer();
const still=await sharp(frames[0]).webp({quality:90,alphaQuality:100}).toBuffer();
const loop=!['success','drop','eating'].includes(state),duration=timing.reduce((a,b)=>a+b,0);assets[state]={strip:'data:image/webp;base64,'+strip.toString('base64'),still:'data:image/webp;base64,'+still.toString('base64'),delays:timing,duration,loop,count:6};
let elapsed=0;const stops=timing.map((delay,i)=>{const stop=`${(elapsed/duration*100).toFixed(6)}%{transform:translate3d(${(-i/6*100).toFixed(6)}%,0,0)}`;elapsed+=delay;return stop;});stops.push(`100%{transform:translate3d(${loop?0:(-5/6*100).toFixed(6)}%,0,0)}`);spriteCss.push(`@keyframes dsg-frames-${state}{${stops.join('')}}`);
}
const props={};for(const id of ['hat','rice']){const buffer=await sharp(path.join(interactions,'props',id+'.png')).resize({width:320}).webp({quality:92,alphaQuality:100}).toBuffer();props[id]='data:image/webp;base64,'+buffer.toString('base64');}
const code=fs.readFileSync(path.join(dest,'client.template.js'),'utf8').replace('__ASSETS__',JSON.stringify(assets)).replace('__PROPS__',JSON.stringify(props)).replace('__SPRITE_CSS__',spriteCss.join('\n')).replace('__LOGIC__',fs.readFileSync(path.join(dest,'logic.js'),'utf8').replace(/export /g,''));fs.writeFileSync(path.join(dest,'client.js'),code);
fs.mkdirSync(path.join(dest,'.cache'),{recursive:true});fs.writeFileSync(path.join(dest,'.cache/animation-assets.json'),JSON.stringify(assets));
await sharp(path.join(src,'frames/idle/00.png')).resize(128,128).png().toFile(path.join(dest,'icon.png'));console.log(JSON.stringify({bundleBytes:Buffer.byteLength(code),states:Object.keys(assets),frames:Object.keys(assets).length*6}));})();
