const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const dest=path.join(root,'dist','DshDeepSeekGirl');fs.mkdirSync(dest,{recursive:true});
// Marketing GIFs stay on GitHub; runtime art is embedded in client.js and the
// plugin gallery uses PNGs. Keep the installer small without changing playback.
for(const name of pkg.files)fs.cpSync(path.join(root,name),path.join(dest,name),{recursive:true,filter:source=>!source.toLowerCase().endsWith('.gif')});
for(const name of ['feeding.gif','petting.gif','quick-tour.gif'])fs.rmSync(path.join(dest,'docs/images',name),{force:true});
for(const name of ['README.md','README.en.md']){
 const file=path.join(dest,name);
 fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace(/docs\/images\/([\w-]+\.gif)/g,'https://raw.githubusercontent.com/nailiang002-wq/deepseek-girl-harness/main/docs/images/$1'));
}
const runtime={...pkg};delete runtime.scripts;delete runtime.devDependencies;delete runtime.engines;
fs.writeFileSync(path.join(dest,'package.json'),JSON.stringify(runtime,null,2)+'\n');
console.log(JSON.stringify({version:pkg.version,pluginFolder:dest}));
