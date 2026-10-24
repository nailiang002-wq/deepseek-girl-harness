const{spawnSync}=require('node:child_process');
for(const outfit of ['pro-winter-puffer','pro-winter-cape'])for(const test of ['pro-tail-browser.cjs','pro-meal-browser.cjs']){
 const result=spawnSync(process.execPath,['tests/'+test],{stdio:'inherit',env:{...process.env,DSG_PRO_OUTFIT:outfit}});if(result.status!==0)process.exit(result.status||1);
}
