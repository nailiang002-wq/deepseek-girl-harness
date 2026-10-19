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
  const RPC_TIMEOUT_MS=15000,DONE=Promise.resolve(),CANCELLED=Symbol('finance request cancelled');
  let snapshot=FINANCE_EMPTY,disposed=false,timer=null,account=null,summary=null,summaryRevision=0,streamFactory=null,accountStream=null,accountRevision=0,accountView,aggregate=null;
  const channels={account:{pending:null,lastAttempt:0,sequence:0},summary:{pending:null,lastAttempt:0,sequence:0}};
  const listeners=new Set(),consumers=new Set(),cleanups=[];
  const publish=patch=>{if(disposed)return;snapshot={...snapshot,...patch};for(const listener of listeners){try{listener();}catch{}}};
  const active=()=>!disposed&&consumers.size>0&&document.hidden!==true;
  const metadata=()=>({version:FINANCE_ACCOUNT_VERSION,locale:ctx.locale?.getSnapshot?.().active||'zh',timezoneOffsetSeconds:-new Date().getTimezoneOffset()*60});
  const stopWatch=()=>{const stream=accountStream;accountStream=null;try{return Promise.resolve(stream?.dispose?.()).catch(()=>{});}catch{return DONE;}};
  const clearTimer=()=>{if(timer!==null){clearTimeout(timer);timer=null;}};
  function publishBusy(){const refreshing=!!(channels.account.pending||channels.summary.pending);if(snapshot.refreshing!==refreshing)publish({refreshing});}
  function cancelChannel(name,retry=false){const channel=channels[name],pending=channel.pending;if(retry)channel.lastAttempt=0;if(!pending)return;channel.sequence++;channel.pending=null;pending.cancel();publishBusy();}
  function schedule(){
    clearTimer();if(!active())return;
    const waits=[];for(const name of ['account','summary']){const available=name==='account'?account:summary,channel=channels[name];if(available&&!channel.pending)waits.push(channel.lastAttempt?FINANCE_POLL_MS-(Date.now()-channel.lastAttempt):1);}
    if(waits.length)timer=setTimeout(()=>{timer=null;refresh(false);},Math.max(1,Math.min(...waits)));
  }
  function signedOut(){accountRevision++;accountView='signed-out';cancelChannel('account');publish({account:{status:'signed-out',wallets:[],updatedAt:null}});}
  function startWatch(){
    if(!active()||!account?.watch||accountStream)return;
    const source=account;let stream;try{stream=streamFactory?streamFactory({name:'deepseek-girl-finance-account',open:signal=>source.watch(signal),ended:()=>new Error('account stream ended')}):source.watch();}catch{return;}
    accountStream=stream;let firstFrame=true;
    (async()=>{
      for await(const frame of stream){
        if(disposed||accountStream!==stream)break;
        const view=frame?.value??frame;
        if(view?.status!=='credential-stored'&&view?.status!=='signed-out'){frame?.accept?.();continue;}
        const changed=!firstFrame||accountView==='signed-out';firstFrame=false;
        if(view.status==='signed-out')signedOut();
        else {if(changed){accountRevision++;cancelChannel('account',true);publish({account:{status:'loading',wallets:[],updatedAt:null}});}accountView='credential-stored';if(changed){runChannel('account',true);schedule();}}
        frame?.accept?.();
      }
    })().catch(()=>{if(!disposed&&accountStream===stream){accountStream=null;if(active())publish({account:{status:'failed',wallets:[],updatedAt:null}});}});
  }
  async function readAccount(valid){
    const source=account,revision=accountRevision;
    if(!source)return {status:'unavailable',wallets:[],updatedAt:null};
    const current=()=>valid()&&source===account&&revision===accountRevision;
    if(!current())return null;
    try{
      if(accountView!=='credential-stored'&&source.getState){const state=await source.getState();if(!current())return null;if(!state?.ok)throw Error('unavailable');if(state.value?.status==='signed-out'){signedOut();return null;}if(state.value?.status!=='credential-stored')throw Error('unavailable');accountView='credential-stored';}
      if(accountView==='signed-out')return {status:'signed-out',wallets:[],updatedAt:null};
      if(!current())return null;
      const response=await source.getBalance(metadata());if(!current())return null;if(!response?.ok)throw Error('unavailable');const value=response.value;if(value===null){signedOut();return null;}if(value.status!=='ready')throw Error('unavailable');
      const recharge=financeWallets(value.value),bonus=financeWallets(value.bonusWallets);if(recharge===null||bonus===null)throw Error('invalid balance');return {status:'ready',wallets:recharge.concat(bonus),recharge,bonus,updatedAt:Date.now()};
    }catch{return current()?{status:'failed',wallets:[],updatedAt:null}:null;}
  }
  async function readSummary(valid){
    const source=summary,revision=summaryRevision;if(!source)return {status:'unavailable'};
    const current=()=>valid()&&source===summary&&revision===summaryRevision;
    if(!current())return null;
    try{const result=await source({timezoneOffsetSeconds:-new Date().getTimezoneOffset()*60});return !current()?null:result?.ok?financeSummary(result.value):{status:'failed'};}catch{return current()?{status:'failed'}:null;}
  }
  function runChannel(name,force){
    const channel=channels[name],source=name==='account'?account:summary;
    if(!active()||!source)return DONE;
    if(channel.pending)return channel.pending.promise;
    if(!force&&channel.lastAttempt&&Date.now()-channel.lastAttempt<FINANCE_POLL_MS)return DONE;
    channel.lastAttempt=Date.now();const sequence=++channel.sequence;
    let timeout,resolveCancel;
    const record={promise:null,expired:false,cancel:()=>resolveCancel(CANCELLED)};channel.pending=record;
    const current=()=>active()&&channel.pending===record&&channel.sequence===sequence;
    const valid=()=>current()&&!record.expired;
    const cancelled=new Promise(resolve=>resolveCancel=resolve);
    const expired=new Promise(resolve=>{timeout=setTimeout(()=>{record.expired=true;resolve({status:'failed',...(name==='account'?{wallets:[],updatedAt:null}:{})});},RPC_TIMEOUT_MS);});
    if(snapshot[name].status==='unavailable')publish({[name]:name==='account'?{status:'loading',wallets:[],updatedAt:null}:{status:'loading'}});
    publishBusy();
    // The race observes every rejection, including a transport rejecting after timeout/cancellation.
    const task=Promise.resolve().then(()=>name==='account'?readAccount(valid):readSummary(valid));
    record.promise=Promise.race([task,cancelled,expired]).then(value=>{if(value!==CANCELLED&&value!==null&&current())publish({[name]:value});},()=>{if(current())publish({[name]:name==='account'?{status:'failed',wallets:[],updatedAt:null}:{status:'failed'}});}).then(()=>{
      clearTimeout(timeout);if(channel.pending===record){channel.pending=null;publishBusy();schedule();}
    });
    return record.promise;
  }
  function refresh(force=true){
    if(!active())return DONE;
    startWatch();
    const balance=runChannel('account',force),total=runChannel('summary',force);
    schedule();
    if(aggregate?.balance===balance&&aggregate?.total===total)return aggregate.promise;
    if(balance===DONE&&total===DONE)return DONE;
    const current={balance,total,promise:null};current.promise=Promise.all([balance,total]).then(()=>{if(aggregate===current)aggregate=null;});aggregate=current;return current.promise;
  }
  function reconcile(){clearTimer();if(active()){startWatch();refresh(false);}else{stopWatch();cancelChannel('account',!!channels.account.pending);cancelChannel('summary',!!channels.summary.pending);}}
  const visibility=()=>reconcile();document.addEventListener('visibilitychange',visibility);window.addEventListener('focus',visibility);
  cleanups.push(()=>document.removeEventListener('visibilitychange',visibility),()=>window.removeEventListener('focus',visibility));
  if(typeof ctx.inject==='function'){
    // $mount registers descriptors through the calling scope's Typert service.
    // Cordis does not inherit a service's own dependencies into this caller.
    ctx.inject(['remote','typert'],scope=>{
      if(typeof FINANCE_REMOTE==='undefined'||typeof scope.remote.$mount!=='function')return;
      const mount=scope.remote.$mount.bind(scope.remote);let live=true,release;
      scope.effect(()=>()=>{live=false;try{return Promise.resolve(release?.()).catch(()=>{});}catch{}});
      Promise.resolve().then(()=>mount(FINANCE_REMOTE)).then(dispose=>{if(!live){try{return Promise.resolve(dispose?.()).catch(()=>{});}catch{}}else release=dispose;}).catch(()=>{if(!summary)publish({summary:{status:'unavailable'}});});
    });
    ctx.inject(['remote','remote.account'],scope=>{
      const remote=scope.remote,source=remote.account;cancelChannel('account',true);account={getBalance:source.getBalance.bind(source),...(typeof source.getState==='function'?{getState:source.getState.bind(source)}:{}),...(typeof source.watch==='function'?{watch:source.watch.bind(source)}:{})};const current=account;streamFactory=typeof remote.$stream==='function'?remote.$stream.bind(remote):null;accountView=undefined;accountRevision++;reconcile();
      scope.effect(()=>()=>{if(account!==current)return;stopWatch();account=null;streamFactory=null;accountRevision++;cancelChannel('account',true);publish({account:{status:'unavailable',wallets:[],updatedAt:null}});schedule();});
    });
    ctx.inject(['remote','remote.deepseekGirlFinance'],scope=>{
      const source=scope.remote.deepseekGirlFinance;cancelChannel('summary',true);summary=source.summary.bind(source);const current=summary;summaryRevision++;reconcile();
      scope.effect(()=>()=>{if(summary!==current)return;summary=null;summaryRevision++;cancelChannel('summary',true);publish({summary:{status:'unavailable'}});schedule();});
    });
  }
  return {subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);},getSnapshot:()=>snapshot,acquire(enabled=true){const token={};if(enabled)consumers.add(token);reconcile();return()=>{consumers.delete(token);reconcile();};},refresh,dispose(){if(disposed)return;disposed=true;clearTimer();stopWatch();cancelChannel('account');cancelChannel('summary');consumers.clear();listeners.clear();for(const cleanup of cleanups)cleanup();}};
}
