const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const dest=path.join(root,'dist','DshDeepSeekGirl');fs.mkdirSync(dest,{recursive:true});
for(const name of pkg.files)fs.cpSync(path.join(root,name),path.join(dest,name),{recursive:true});
const runtime={...pkg};delete runtime.scripts;delete runtime.devDependencies;delete runtime.engines;
fs.writeFileSync(path.join(dest,'package.json'),JSON.stringify(runtime,null,2)+'\n');
console.log(JSON.stringify({version:pkg.version,pluginFolder:dest}));
