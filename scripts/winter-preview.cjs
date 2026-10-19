const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..');
const outfits=[['winter-puffer','奶油蓝羽绒服','Cream & blue puffer'],['winter-cape','月牙绒绒斗篷','Moonlit winter cape']];
(async()=>{
 const svg=Buffer.from(`<svg width="1200" height="720" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="720" fill="#fffaf2"/><g font-family="Microsoft YaHei, sans-serif" fill="#385574"><text x="52" y="65" font-size="34" font-weight="600">小鲸鱼的冬日衣柜</text><text x="54" y="94" font-size="15" fill="#7a8c9c">WINTER WARDROBE · TWO NEW LOOKS</text><text x="1140" y="76" font-size="38" fill="#a5c4de">✧</text><rect x="42" y="124" width="542" height="548" rx="30" fill="#edf4fc" stroke="#cfdfed" stroke-width="2"/><rect x="616" y="124" width="542" height="548" rx="30" fill="#edf4f1" stroke="#c9dcd7" stroke-width="2"/>${outfits.map(([,zh,en],i)=>`<text x="${313+i*574}" y="609" text-anchor="middle" font-size="26" font-weight="600">${zh}</text><text x="${313+i*574}" y="640" text-anchor="middle" font-size="16" fill="#7a8c9c">${en.replace('&','&amp;')}</text>`).join('')}</g></svg>`);
 const layers=[];
 for(let i=0;i<outfits.length;i++)layers.push({input:await sharp(path.join(root,'assets/outfits',outfits[i][0],'frames/idle/00.png')).resize(430,430).png().toBuffer(),left:98+i*574,top:142});
 const target=path.join(root,'docs/images/winter.png');
 await sharp(svg).composite(layers).png().toFile(target);
 console.log(JSON.stringify({preview:target,outfits:outfits.map(([id])=>id),syntheticArtworkOnly:true}));
})().catch(error=>{console.error(error);process.exitCode=1;});
