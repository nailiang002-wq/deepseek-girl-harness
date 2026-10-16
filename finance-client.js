// Embedded verbatim in the browser bundle. Financial values stay in memory only.
const FINANCE_EMPTY = Object.freeze({account:Object.freeze({status:'unavailable',wallets:[],updatedAt:null}),summary:Object.freeze({status:'unavailable'}),refreshing:false});
const FINANCE_IDLE_STORE = {subscribe:()=>()=>{},getSnapshot:()=>FINANCE_EMPTY,acquire:()=>()=>{},refresh:()=>Promise.resolve()};
const FINANCE_POLL_MS = 60000;
// Matches the installed Harness account UI compatibility metadata.
const FINANCE_ACCOUNT_VERSION = '0.2.0-rc.2';
function financeDecimal(value){
  if(typeof value!=='string'||value.length>128)return null;
  const match=/^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))(?:[eE]([+-]?\d{1,3}))?$/.exec(value);
  if(!match)return null;
  const whole=match[2]||'',fraction=match[3]??match[4]??'',exponent=Number(match[5]||0);
  if(Math.abs(exponent)>96||whole.length+fraction.length>96)return null;
  let digits=(whole+fraction).replace(/^0+/,'')||'0',scale=fraction.length-exponent;
  if(digits==='0')return {amount:0n,scale:0};
  if(scale<0){if(digits.length-scale>96)return null;digits+='0'.repeat(-scale);scale=0;}
  if(scale>96)return null;
  return {amount:BigInt((match[1]==='-'?'-':'')+digits),scale};
}
function financeDecimalText({amount,scale}){const negative=amount<0n,digits=String(negative?-amount:amount).padStart(scale+1,'0');return(negative?'-':'')+(scale?digits.slice(0,-scale)+'.'+digits.slice(-scale):digits);}
function financeWallets(value){
  if(!Array.isArray(value)||value.length>64)return null;
  const result=[];for(const item of value){if(!item||(item.currency!=='CNY'&&item.currency!=='USD'))return null;const amount=financeDecimal(item.balance);if(amount===null)return null;result.push({currency:item.currency,balance:financeDecimalText(amount)});}return result;
}
function financeBalanceText(wallets){
  const totals=new Map();
  for(const wallet of financeWallets(wallets)||[]){const {amount,scale}=financeDecimal(wallet.balance),previous=totals.get(wallet.currency)||{amount:0n,scale:0},nextScale=Math.max(scale,previous.scale);totals.set(wallet.currency,{amount:previous.amount*10n**BigInt(nextScale-previous.scale)+amount*10n**BigInt(nextScale-scale),scale:nextScale});}
  return [...totals].map(([currency,{amount,scale}])=>{const symbol=currency==='CNY'?'¥':'$',negative=amount<0n,absolute=negative?-amount:amount,base=10n**BigInt(scale);if(amount===0n)return symbol+'0.00';if(!negative&&absolute*100n<base)return '<'+symbol+'0.01';let cents=absolute*100n/base;if(negative){if(absolute*100n%base*2n>=base)cents++;if(cents===0n)cents=1n;}const whole=String(cents/100n).replace(/\B(?=(\d{3})+(?!\d))/g,',');return(negative?'-':'')+symbol+whole+'.'+String(cents%100n).padStart(2,'0');}).join(' + ');
}
function financeEstimateText(estimate){
  if(!estimate||!Number.isFinite(estimate.min)||!Number.isFinite(estimate.max))return '—';
  const money=value=>value>0&&value<.0001?'<¥0.0001':'¥'+value.toFixed(4);
  return estimate.min===estimate.max?money(estimate.min):money(estimate.min)+' – '+money(estimate.max);
}
function financeSummary(value){
  if(!value||value.status!=='ready')return {status:value?.status==='failed'?'failed':'unavailable'};
  const count=number=>Number.isSafeInteger(number)&&number>=0;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value.day)||value.scope!=='harness-local'||!['input','output','cacheRead','cacheWrite','total'].every(key=>value.tokens?.[key]===null||count(value.tokens?.[key]))||!count(value.requests)||!count(value.missingUsage))return {status:'failed'};
  const estimate=value.estimate;
  if(!estimate||estimate.currency!=='CNY'||!((estimate.min===null&&estimate.max===null)||(Number.isFinite(estimate.min)&&Number.isFinite(estimate.max)&&estimate.min>=0&&estimate.max>=estimate.min))||!count(estimate.pricedRequests)||!count(estimate.unpricedRequests))return {status:'failed'};
  return {status:'ready',day:value.day,scope:'harness-local',tokens:Object.fromEntries(['input','output','cacheRead','cacheWrite','total'].map(key=>[key,value.tokens[key]])),requests:value.requests,missingUsage:value.missingUsage,estimate:{currency:'CNY',min:estimate.min,max:estimate.max,pricedRequests:estimate.pricedRequests,unpricedRequests:estimate.unpricedRequests,sourceUrl:typeof estimate.sourceUrl==='string'&&/^https:\/\/(?:api-docs\.)?deepseek\.com\//.test(estimate.sourceUrl)?estimate.sourceUrl:null,asOf:typeof estimate.asOf==='string'?estimate.asOf:null},updatedAt:Number.isFinite(value.updatedAt)?value.updatedAt:Date.now()};
}
function financeIncomplete(value){return value?.status==='ready'&&(value.missingUsage>0||value.tokens.total===null||value.estimate.unpricedRequests>0);}
function createFinanceClient(ctx){
  if(typeof ctx.inject!=='function')return FINANCE_IDLE_STORE;
  let snapshot=FINANCE_EMPTY,disposed=false,timer=null,inflight=null,lastAttempt=0,account=null,summary=null,summaryRevision=0,streamFactory=null,accountStream=null,accountRevision=0,accountView,refreshAgain=false;
  const listeners=new Set(),consumers=new Set(),cleanups=[];
  const publish=patch=>{if(disposed)return;snapshot={...snapshot,...patch};for(const listener of listeners)listener();};
  const active=()=>!disposed&&consumers.size>0&&document.hidden!==true;
  const metadata=()=>({version:FINANCE_ACCOUNT_VERSION,locale:ctx.locale?.getSnapshot?.().active||'zh',timezoneOffsetSeconds:-new Date().getTimezoneOffset()*60});
  const stopWatch=()=>{const stream=accountStream;accountStream=null;try{stream?.dispose?.();}catch{}};
  const clearTimer=()=>{if(timer!==null){clearTimeout(timer);timer=null;}};
  function schedule(){clearTimer();if(active())timer=setTimeout(()=>{timer=null;refresh(false);},Math.max(1,FINANCE_POLL_MS-(Date.now()-lastAttempt)));}
  function signedOut(){accountRevision++;accountView='signed-out';publish({account:{status:'signed-out',wallets:[],updatedAt:null}});}
  function startWatch(){
    if(!active()||!account?.watch||accountStream)return;
    let stream;try{stream=streamFactory?streamFactory({name:'deepseek-girl-finance-account',open:signal=>account.watch(signal),ended:()=>new Error('account stream ended')}):account.watch();}catch{return;}
    accountStream=stream;let firstFrame=true;
    (async()=>{for await(const frame of stream){if(disposed||accountStream!==stream)break;const view=frame?.value??frame;if(view?.status!=='credential-stored'&&view?.status!=='signed-out'){frame?.accept?.();continue;}const changed=!firstFrame||accountView==='signed-out';firstFrame=false;if(view.status==='signed-out')signedOut();else {if(changed){accountRevision++;publish({account:{status:'loading',wallets:[],updatedAt:null}});}accountView='credential-stored';if(changed){if(inflight)refreshAgain=true;else refresh(true);}}frame?.accept?.();}})().catch(()=>{if(!disposed&&accountStream===stream&&active())publish({account:{status:'failed',wallets:[],updatedAt:null}});});
  }
  async function readAccount(){
    if(!account)return {status:'unavailable',wallets:[],updatedAt:null};
    const revision=accountRevision;
    try{
      if(accountView!=='credential-stored'&&account.getState){const state=await account.getState();if(!active()||revision!==accountRevision)return null;if(!state?.ok)throw Error('unavailable');if(state.value?.status==='signed-out'){signedOut();return null;}if(state.value?.status!=='credential-stored')throw Error('unavailable');accountView='credential-stored';}
      if(accountView==='signed-out')return {status:'signed-out',wallets:[],updatedAt:null};
      const response=await account.getBalance(metadata());if(!active()||revision!==accountRevision)return null;if(!response?.ok)throw Error('unavailable');const value=response.value;if(value===null){signedOut();return null;}if(value.status!=='ready')throw Error('unavailable');
      const recharge=financeWallets(value.value),bonus=financeWallets(value.bonusWallets);if(recharge===null||bonus===null)throw Error('invalid balance');return {status:'ready',wallets:recharge.concat(bonus),recharge,bonus,updatedAt:Date.now()};
    }catch{return active()&&revision===accountRevision?{status:'failed',wallets:[],updatedAt:null}:null;}
  }
  async function readSummary(){if(!summary)return {status:'unavailable'};const source=summary,revision=summaryRevision;try{const result=await source({timezoneOffsetSeconds:-new Date().getTimezoneOffset()*60});return revision!==summaryRevision?null:result?.ok?financeSummary(result.value):{status:'failed'};}catch{return revision===summaryRevision?{status:'failed'}:null;}}
  function refresh(force=true){
    if(!active())return Promise.resolve();if(inflight)return inflight;if(!force&&Date.now()-lastAttempt<FINANCE_POLL_MS){schedule();return Promise.resolve();}
    lastAttempt=Date.now();publish({refreshing:true,account:snapshot.account.status==='unavailable'&&account?{status:'loading',wallets:[],updatedAt:null}:snapshot.account,summary:snapshot.summary.status==='unavailable'&&summary?{status:'loading'}:snapshot.summary});
    const request=Promise.all([readAccount(),readSummary()]).then(([balance,total])=>{if(active()){const patch={};if(total!==null)patch.summary=total;if(balance!==null)patch.account=balance;publish(patch);}}).finally(()=>{if(inflight!==request)return;inflight=null;if(!disposed)publish({refreshing:false});if(refreshAgain&&active()){refreshAgain=false;refresh(true);}else schedule();});inflight=request;return request;
  }
  function reconcile(){clearTimer();if(active()){startWatch();refresh(false);}else stopWatch();}
  const visibility=()=>reconcile();document.addEventListener('visibilitychange',visibility);window.addEventListener('focus',visibility);
  cleanups.push(()=>document.removeEventListener('visibilitychange',visibility),()=>window.removeEventListener('focus',visibility));
  if(typeof ctx.inject==='function'){
    ctx.inject(['remote'],scope=>{
      if(typeof FINANCE_REMOTE==='undefined'||typeof scope.remote.$mount!=='function')return;
      const mount=scope.remote.$mount.bind(scope.remote);let live=true,release;
      scope.effect(()=>()=>{live=false;try{return Promise.resolve(release?.()).catch(()=>{});}catch{}});
      Promise.resolve().then(()=>mount(FINANCE_REMOTE)).then(dispose=>{if(!live){try{return Promise.resolve(dispose?.()).catch(()=>{});}catch{}}else release=dispose;}).catch(()=>{if(!summary)publish({summary:{status:'unavailable'}});});
    });
    ctx.inject(['remote','remote.account'],scope=>{
      const remote=scope.remote,source=remote.account;account={getBalance:source.getBalance.bind(source),...(typeof source.getState==='function'?{getState:source.getState.bind(source)}:{}),...(typeof source.watch==='function'?{watch:source.watch.bind(source)}:{})};streamFactory=typeof remote.$stream==='function'?remote.$stream.bind(remote):null;accountView=undefined;accountRevision++;lastAttempt=0;reconcile();
      scope.effect(()=>()=>{stopWatch();account=null;streamFactory=null;accountRevision++;publish({account:{status:'unavailable',wallets:[],updatedAt:null}});});
    });
    ctx.inject(['remote','remote.deepseekGirlFinance'],scope=>{const source=scope.remote.deepseekGirlFinance;summary=source.summary.bind(source);summaryRevision++;lastAttempt=0;reconcile();scope.effect(()=>()=>{summary=null;summaryRevision++;publish({summary:{status:'unavailable'}});});});
  }
  return {subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);},getSnapshot:()=>snapshot,acquire(enabled=true){const token={};if(enabled)consumers.add(token);reconcile();return()=>{consumers.delete(token);reconcile();};},refresh,dispose(){if(disposed)return;disposed=true;clearTimer();stopWatch();consumers.clear();listeners.clear();for(const cleanup of cleanups)cleanup();}};
}
