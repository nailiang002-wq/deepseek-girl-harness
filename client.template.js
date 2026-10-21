window.__ModuleLoader__.load({
  id: '@local/dsh-deepseek-girl',
  factory(require) {
    const React = require('react'), h = React.createElement;
    const ASSETS = __ASSETS__;
    const OUTFIT_ASSETS = __OUTFIT_ASSETS__;
    const OUTFITS = [{id:'maid',zh:'经典女仆装',en:'Classic maid'},{id:'hoodie',zh:'蓝白休闲卫衣',en:'Blue & white hoodie'},{id:'pajamas',zh:'星星睡衣',en:'Star pajamas'},{id:'winter-puffer',zh:'奶油蓝羽绒服',en:'Cream & blue puffer'},{id:'winter-cape',zh:'月牙绒绒斗篷',en:'Moonlit winter cape'}];
    const PROPS = __PROPS__;
    __LOGIC__
    __FINANCE__
    const STATES = ["idle","thinking","generating","success","error","dragging","drop","sleeping","begging","eating","petting","pouting"];
    const DICTIONARIES = {"zh":{"idle":"待机","thinking":"思考中","generating":"正在回答","success":"完成啦","error":"遇到错误","dragging":"被拎起来啦","drop":"落地啦","sleeping":"休息中","hint":"轻点头部：摸头 · 身体 / 右键：菜单 · 拖动：移动 · Ctrl+滚轮：缩放","preview":"预览 · ","menu":"DeepSeek 娘 · 表情与互动","follow":"跟随当前任务","resume":"开启动画","pause":"暂停动画","reset":"恢复默认位置和大小","help":"轻点头部摸摸头，快速点三次会鼓脸。身体点击 / 右键打开菜单。点白饭盆喂饭；拖动移动，Ctrl + 滚轮缩放。帽子可开关，喂饱后两分钟不再求饭。","accessible":"轻点头部摸头，身体点击或右键打开菜单，拖动移动，Ctrl 加滚轮缩放","begging":"捧盆求喂饭","eating":"开心吃白饭","feed":"喂她一盆白饭","hat":"铁盆帽","hatOn":"戴上铁盆帽","hatOff":"摘下铁盆帽","begOn":"开启待机捧盆求饭","begOff":"关闭待机捧盆求饭","greet_morning":"早上好～今天也一起加油吧！","greet_noon":"中午好～记得吃午饭，我也想要一盆白饭！","greet_afternoon":"下午好～忙了一阵，喝口水休息一下吧。","greet_evening":"晚上好～辛苦啦，记得放松一下。","greet_late":"已经很晚啦～熬夜也要注意身体，记得休息哦。","greetNow":"和我打个招呼","greetingsOn":"开启时间问候","greetingsOff":"关闭时间问候","closeGreeting":"关闭问候气泡","petting":"被摸头","pouting":"鼓脸啦","pet":"摸摸头"},"en":{"idle":"Idle","thinking":"Thinking","generating":"Answering","success":"Done!","error":"Error","dragging":"Picked up!","drop":"Landed!","sleeping":"Sleeping","hint":"Tap head: pet · Body / right click: menu · Drag: move · Ctrl+wheel: resize","preview":"Preview · ","menu":"DeepSeek Girl · Expressions & interactions","follow":"Follow task","resume":"Resume animation","pause":"Pause animation","reset":"Reset position and size","help":"Tap her head for a pat; three quick taps make her pout. Click her body or right-click for the menu. Feed with the rice basin, drag to move, Ctrl + wheel to resize. Toggle her hat; feeding pauses rice requests for two minutes.","accessible":"Tap her head to pet, click her body or right-click for the menu, drag to move, Ctrl plus wheel to resize","begging":"Asking for rice","eating":"Enjoying white rice","feed":"Feed a basin of white rice","hat":"Iron basin hat","hatOn":"Wear basin hat","hatOff":"Remove basin hat","begOn":"Enable idle rice requests","begOff":"Disable idle rice requests","greet_morning":"Good morning! Let’s make it a lovely day.","greet_noon":"Good afternoon! Remember lunch. I’d love a basin of rice, too!","greet_afternoon":"Hello! Take a moment to rest and have some water.","greet_evening":"Good evening! You’ve worked hard. Remember to relax.","greet_late":"It’s getting late. Take care of yourself and get some rest.","greetNow":"Say hello","greetingsOn":"Enable time greetings","greetingsOff":"Disable time greetings","closeGreeting":"Dismiss greeting","petting":"Enjoying head pats","pouting":"Pouting","pet":"Pat her head"}};
    Object.assign(DICTIONARIES.zh,{wardrobe:'打开小衣柜',wardrobeTitle:'今天想穿哪一套？',wardrobeHint:'点选衣服预览，确认后会记住你的选择。',wear:'就穿这套',cancelOutfit:'取消',outfitLoading:'正在整理衣服…',outfitError:'衣服暂时没准备好，请重新点选。',outfitSaved:'正在穿',outfitPreview:'预览中',outfit_maid:'经典女仆装',outfit_hoodie:'蓝白休闲卫衣',outfit_pajamas:'星星睡衣','outfit_winter-puffer':'奶油蓝羽绒服','outfit_winter-cape':'月牙绒绒斗篷'});
    Object.assign(DICTIONARIES.en,{wardrobe:'Open wardrobe',wardrobeTitle:'What shall I wear today?',wardrobeHint:'Choose a look to preview; confirm to remember it.',wear:'Wear this outfit',cancelOutfit:'Cancel',outfitLoading:'Getting dressed…',outfitError:'This outfit could not load. Please select it again.',outfitSaved:'Wearing',outfitPreview:'Preview',outfit_maid:'Classic maid',outfit_hoodie:'Blue & white hoodie',outfit_pajamas:'Star pajamas','outfit_winter-puffer':'Cream & blue puffer','outfit_winter-cape':'Moonlit winter cape'});
    Object.assign(DICTIONARIES.zh,{financeShow:'显示余额与今日预估',financeHide:'隐藏余额与今日预估',financeTitle:'她的饭钱小账本',financeOpen:'查看余额与今日用量明细',financeBalance:'登录账户余额',financeToday:'今日预估',financeLoading:'查询中…',financeFailed:'暂时查询失败',financeUnavailable:'暂不可用',financeSignedOut:'登录后查看',financeRefresh:'刷新账本',financeRefreshing:'正在刷新…',financeClose:'收起账本',financeScope:'仅本机 Harness 今日已记录的模型用量；不包含其他设备或平台用量，也不是账户账单。',financePricing:'按已知模型公开价格估算；区间对应不同时段价格，实际扣费可能不同。',financeAccountScope:'余额来自 Harness 登录账户，包含充值与赠送余额；可能与 API Key 所属账户不同。',financeTokens:'今日 Token',financeInput:'非缓存输入',financeOutput:'输出',financeCacheRead:'缓存命中',financeCacheWrite:'缓存写入',financeTotal:'总计',financeRequests:'已记录请求',financeMissing:'缺少用量的请求',financeUnpriced:'未匹配价格的请求',financeRecharge:'充值余额',financeBonus:'赠送余额',financeUpdated:'上次更新',financePriceSource:'价格来源',financeOfficialBill:'查看官方账单',financeNoWallet:'暂无余额数据',financePartial:'仅已知部分',financeSnapshot:'本机今日记录',financeNoSummary:'当前环境暂未提供用量汇总。'});
    Object.assign(DICTIONARIES.en,{financeShow:'Show balance and daily estimate',financeHide:'Hide balance and daily estimate',financeTitle:'Her little rice ledger',financeOpen:'View balance and today’s usage details',financeBalance:'Signed-in account balance',financeToday:'Estimated today',financeLoading:'Loading…',financeFailed:'Could not refresh',financeUnavailable:'Unavailable',financeSignedOut:'Sign in to view',financeRefresh:'Refresh ledger',financeRefreshing:'Refreshing…',financeClose:'Close ledger',financeScope:'Only model usage recorded by this Harness installation today. Excludes other devices and platforms; this is not your account bill.',financePricing:'Estimated from known models’ public prices. Ranges reflect different time bands; actual charges may differ.',financeAccountScope:'Balance belongs to the account signed in to Harness and includes topped-up and granted credits. Your API key may belong to another account.',financeTokens:'Today’s tokens',financeInput:'Uncached input',financeOutput:'Output',financeCacheRead:'Cache read',financeCacheWrite:'Cache write',financeTotal:'Total',financeRequests:'Recorded requests',financeMissing:'Requests missing usage',financeUnpriced:'Requests without prices',financeRecharge:'Topped-up balance',financeBonus:'Granted balance',financeUpdated:'Last updated',financePriceSource:'Price source',financeOfficialBill:'View official bill',financeNoWallet:'No balance data',financePartial:'Known portion only',financeSnapshot:'Today on this installation',financeNoSummary:'Usage totals are unavailable in this environment.'});
    Object.assign(DICTIONARIES.zh,{wheelName:'小鲸鱼',wheelMore:'更多',wheelSettings:'小设置',wheelExpressions:'表情预览',wheelClose:'收起转轮',wheelBack:'返回上一层',wheelNext:'下一页表情',wheelPrevious:'上一页表情',wheelHint:'方向键选择 · Esc 收起',wheelFeed:'喂白饭',wheelPet:'摸摸头',wheelWardrobe:'换衣服',wheelHatOn:'戴帽子',wheelHatOff:'摘帽子',wheelHello:'打招呼',wheelLedger:'小账本',wheelFollow:'跟随任务',wheelPause:'暂停',wheelResume:'播放',wheelReset:'归位',wheelBeg:'捧盆求饭',wheelGreetings:'时间问候',wheelFinance:'摸头账本',wheelOn:'开',wheelOff:'关',financePeekHint:'摸摸头，给你看看今天的小账本',financeShow:'开启摸头显示账本',financeHide:'关闭摸头显示账本'});
    Object.assign(DICTIONARIES.en,{wheelName:'Little Whale',wheelMore:'More',wheelSettings:'Settings',wheelExpressions:'Expressions',wheelClose:'Close wheel',wheelBack:'Back',wheelNext:'Next expressions',wheelPrevious:'Previous expressions',wheelHint:'Arrows to select · Esc to close',wheelFeed:'Feed rice',wheelPet:'Head pat',wheelWardrobe:'Dress up',wheelHatOn:'Hat on',wheelHatOff:'Hat off',wheelHello:'Say hello',wheelLedger:'Ledger',wheelFollow:'Follow task',wheelPause:'Pause',wheelResume:'Play',wheelReset:'Reset',wheelBeg:'Ask for rice',wheelGreetings:'Greetings',wheelFinance:'Pat to peek',wheelOn:'On',wheelOff:'Off',financePeekHint:'A head pat, a little peek at today',financeShow:'Enable ledger after head pats',financeHide:'Disable ledger after head pats'});
    // Small, local SVG drawings keep the wheel sharp without downloading icons.
    function WheelIcon({name}){
      const paths={rice:'M3 11h18c-1 6-4 9-9 9S4 17 3 11Zm2-2c0-3 3-5 7-5s7 2 7 5M8 7l1-1m3 1 1-1m3 1 1 1',pet:'M5 12V9a2 2 0 0 1 4 0v2-6a2 2 0 0 1 4 0v6-5a2 2 0 0 1 4 0v7-3a2 2 0 0 1 4 0v5c0 5-4 7-8 7-3 0-5-2-7-4l-3-3a2 2 0 0 1 2-3Z',wardrobe:'m8 4 4 3 4-3 6 5-4 4-2-2v10H8V11l-2 2-4-4 6-5Z',hat:'M3 16h18M5 14l2-8h10l2 8M9 9h6',hello:'M4 5h16v12h-7l-5 4v-4H4V5Zm4 5h1m5 0h1m-7 3q4 3 8 0',more:'M4 12h1m6 0h1m6 0h1',expressions:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM8 9h1m6 0h1m-8 5q4 5 8 0',settings:'M4 7h16M4 17h16M8 4v6m8 4v6',ledger:'M5 3h14v18H5V3Zm4 5h6m-6 4h6m-6 4h3',follow:'m5 6 14 6-7 2-2 7L5 6Z',pause:'M8 5v14m8-14v14',play:'m8 4 12 8-12 8V4Z',reset:'M5 8a8 8 0 1 1-1 8M5 3v5h5',back:'m14 5-7 7 7 7M7 12h14',close:'m6 6 12 12M18 6 6 18',star:'m12 3 3 6 7 1-5 5 1 6-6-3-6 3 1-6-5-5 7-1 3-6Z'};
      return h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.6,strokeLinecap:'round',strokeLinejoin:'round','aria-hidden':true},h('path',{d:paths[name]||paths.expressions}));
    }
    let docks = 0;
    const listeners = new Set();
    const presence = { subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);}, snapshot(){return docks>0;} };
    const notify = () => listeners.forEach(fn=>fn());
    const viewport = value => geometry(value, window.innerWidth, window.innerHeight);
    function readPrefs(){try{const value=JSON.parse(localStorage.getItem(STORAGE_KEY));return value&&typeof value==='object'?{...value,outfit:normalizeOutfit(value.outfit)}:{outfit:'maid'};}catch{return {outfit:'maid'};}}
    function writePrefs(value){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(value));window.dispatchEvent(new Event('deepseek-girl-preferences'));}catch{}}
    const CSS = `
@font-face{font-family:'DSG Greeting Hand';src:url('__GREETING_FONT__') format('woff2');font-style:normal;font-weight:400;font-display:swap}
.dsg-root{position:fixed;z-index:60;display:flex;flex-direction:column;align-items:center;user-select:none;font-family:inherit}
.dsg-character{position:relative;width:100%;aspect-ratio:1;border:0;padding:0;background:transparent;cursor:grab;touch-action:none;border-radius:18px}
.dsg-character:active{cursor:grabbing}.dsg-character:focus-visible{outline:2px solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px}
.dsg-motion{width:100%;height:100%;display:block;position:relative;pointer-events:none;transform-origin:50% 85%;will-change:transform;filter:drop-shadow(0 3px 4px rgba(0,0,0,.14));animation:dsg-breathe 3.6s ease-in-out infinite}
.dsg-clip{width:100%;height:100%;display:block;overflow:hidden;contain:paint;pointer-events:none;border-radius:0}
.dsg-art,.dsg-wardrobe-art{height:100%;display:block;max-width:none;pointer-events:none;will-change:transform;animation-timing-function:steps(1,end);animation-fill-mode:forwards}
.dsg-motion[data-motion="thinking"]{animation:dsg-sway 2.6s ease-in-out infinite}.dsg-motion[data-motion="generating"]{animation:dsg-breathe 1.8s ease-in-out infinite}.dsg-motion[data-motion="sleeping"]{animation:dsg-breathe 4.4s ease-in-out infinite}
.dsg-motion[data-motion="begging"]{animation:dsg-sway 2s ease-in-out infinite}.dsg-motion[data-motion="eating"]{animation:dsg-breathe .9s ease-in-out infinite}.dsg-motion[data-motion="dragging"]{transform-origin:50% 20%;animation:dsg-swing 1.5s ease-in-out infinite}.dsg-motion[data-motion="success"]{animation:dsg-happy 1s ease-in-out infinite}.dsg-motion[data-motion="drop"]{animation:dsg-land .6s ease-out both}
.dsg-motion[data-motion="petting"]{animation:dsg-nuzzle 1.8s ease-in-out both}.dsg-motion[data-motion="pouting"]{animation:dsg-pout 1.8s ease-in-out both}
.dsg-motion[data-animate="false"]{animation:none;will-change:auto}.dsg-root[data-hidden="true"] .dsg-motion,.dsg-root[data-hidden="true"] .dsg-art,.dsg-root[data-hidden="true"] .dsg-wardrobe-art{animation-play-state:paused}
@keyframes dsg-breathe{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(0,-1%,0) scale(1.008)}}
@keyframes dsg-sway{0%,100%{transform:translate3d(0,0,0) rotate(-.7deg)}50%{transform:translate3d(0,-1.2%,0) rotate(.7deg)}}
@keyframes dsg-swing{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@keyframes dsg-happy{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-3%,0) rotate(.6deg)}}
@keyframes dsg-land{0%{transform:translate3d(0,-3%,0) scale(1.01)}40%{transform:translate3d(0,1%,0) scale(1.02,.98)}100%{transform:translate3d(0,0,0) scale(1)}}
@keyframes dsg-nuzzle{0%,100%{transform:rotate(0)}35%{transform:translate3d(-1%,-1%,0) rotate(-2deg)}70%{transform:translate3d(1%,-.5%,0) rotate(1.5deg)}}
@keyframes dsg-pout{0%,100%{transform:translate3d(0,0,0)}35%{transform:translate3d(0,-1%,0) rotate(-1deg)}65%{transform:rotate(1deg)}}
.dsg-affection{position:absolute;inset:0;overflow:visible;pointer-events:none}.dsg-heart{position:absolute;width:13%;height:13%;left:12%;top:17%;color:#e7a2b7;opacity:0;animation:dsg-heart-rise 1.3s ease-out both}.dsg-heart:nth-child(2){left:auto;right:9%;top:26%;width:10%;animation-delay:.15s}.dsg-heart:nth-child(3){left:22%;top:9%;width:8%;animation-delay:.3s}
@keyframes dsg-heart-rise{0%{opacity:0;transform:translate3d(0,5px,0) scale(.75)}20%{opacity:.9}100%{opacity:0;transform:translate3d(1px,-18px,0) scale(1.08)}}
.dsg-root[data-motion-enabled='false'] .dsg-heart{animation:none;opacity:.65}.dsg-root[data-hidden='true'] .dsg-heart{animation-play-state:paused}
__SPRITE_CSS__
.dsg-hat{position:absolute;left:20%;top:11%;width:60%;height:auto;pointer-events:none;filter:drop-shadow(0 2px 2px rgba(0,0,0,.12));transform:rotate(-5deg);transform-origin:50% 80%}
.dsg-footer{display:flex;align-items:center;justify-content:center;gap:3px;height:32px;max-width:100%}
.dsg-food{display:flex;align-items:center;justify-content:center;width:40px;height:32px;flex-shrink:0;border:0;background:transparent;cursor:pointer;border-radius:8px;padding:1px}
.dsg-food img{width:100%;height:100%;object-fit:contain;pointer-events:none}.dsg-food:hover{background:var(--dsw-alias-interactive-bg-hover);transform:scale(1.08)}.dsg-food:disabled{cursor:default;opacity:.55;transform:none}.dsg-food:focus-visible{outline:2px solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary))}
.dsg-label{pointer-events:none;font-size:11px;line-height:22px;padding:0 9px;max-width:100%;white-space:nowrap;border-radius:12px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2)}
.dsg-greeting{position:fixed;box-sizing:border-box;padding:23px 36px 23px 25px;color:#355575;font-family:'DSG Greeting Hand','KaiTi',cursive;font-size:18px;font-weight:400;line-height:1.65;letter-spacing:.3px;user-select:text;isolation:isolate;filter:drop-shadow(0 5px 7px rgba(44,67,95,.13));animation:dsg-note-arrive .18s ease-out both}
.dsg-greeting-text{position:relative;z-index:1;display:block;overflow-y:auto;max-height:var(--dsg-text-max-height);overflow-wrap:anywhere;text-wrap:pretty;scrollbar-width:thin}
.dsg-greeting-paper{position:absolute;inset:0;width:100%;height:100%;z-index:-1;overflow:visible;pointer-events:none}
.dsg-greeting:before{content:'';position:absolute;inset:8px;z-index:0;border-radius:22px;background-image:radial-gradient(#b8a88b24 .65px,transparent .8px);background-size:5px 5px;opacity:.42;pointer-events:none}
.dsg-greeting-tail{position:absolute;left:var(--dsg-tail-x);width:17px;height:17px;background:#fff9ee;z-index:0;transform:translateX(-50%) rotate(39deg);border:2px solid #83a6c7;border-radius:1px 4px 4px 5px;pointer-events:none}
.dsg-greeting[data-side='above'] .dsg-greeting-tail{bottom:-6px;border-top:0;border-left:0}.dsg-greeting[data-side='below'] .dsg-greeting-tail{top:-6px;border-right:0;border-bottom:0}
.dsg-greeting-doodle{position:absolute;bottom:10px;right:18px;width:36px;height:9px;color:#edb09d;pointer-events:none;opacity:.9}
.dsg-greeting-mark{position:absolute;left:-3px;top:-6px;width:24px;height:24px;transform:rotate(-13deg);pointer-events:none}
.dsg-greeting button{position:absolute;top:8px;right:8px;display:grid;place-items:center;border:0;background:transparent;color:#7195b7;cursor:pointer;width:26px;height:26px;border-radius:45% 55% 48% 52%;padding:5px;transition:background .12s,color .12s}.dsg-greeting button svg{width:16px;height:16px;pointer-events:none}.dsg-greeting button:hover{background:#e2edf3;color:#365e86}.dsg-greeting button:focus-visible{outline:2px dashed #416c98;outline-offset:2px}
@keyframes dsg-note-arrive{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}
.dsg-root[data-motion-enabled='false'] .dsg-greeting{animation:none}.dsg-root[data-hidden='true'] .dsg-greeting{animation-play-state:paused}
@media(prefers-reduced-motion:reduce){.dsg-greeting{animation:none}}
.dsg-menu{position:fixed;z-index:3;box-sizing:border-box;width:256px;max-width:calc(100vw - 16px);color:#45627c;font-family:'DSG Greeting Hand','KaiTi',cursive;font-size:13px;animation:dsg-wheel-arrive .16s ease-out both;filter:drop-shadow(0 6px 15px #304d7126)}
.dsg-wheel{position:relative;width:100%;aspect-ratio:1;border-radius:50%;background:#fffaf2f5;border:1.5px solid #a6bfd5;box-sizing:border-box;isolation:isolate}
.dsg-wheel,.dsg-wheel:before,.dsg-wheel:after,.dsg-wheel button{corner-shape:round}
.dsg-wheel:before{content:'';position:absolute;inset:14px;border:1px dashed #c2d2df;border-radius:50%;pointer-events:none}.dsg-wheel:after{content:'';position:absolute;inset:57px;border:1px solid #e5ddd0;border-radius:50%;z-index:-1;pointer-events:none}
.dsg-wheel button{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;width:76px;min-height:62px;padding:6px 3px;box-sizing:border-box;cursor:pointer;border:1px solid transparent;border-radius:20px;background:transparent;color:#4c6a84;font:inherit;line-height:1.25;transition:background .12s,border-color .12s,color .12s}
.dsg-wheel button svg{width:24px;height:24px;color:#638cb0}.dsg-wheel button span{font-size:13px;max-width:100%;overflow-wrap:anywhere;text-align:center}.dsg-wheel button:hover{background:#e9f2f8;border-color:#bacfde;color:#2f587e}.dsg-wheel button:focus-visible{outline:2px dashed #547b9e;outline-offset:1px;background:#edf4fa}.dsg-wheel button:disabled{opacity:.4;cursor:default}.dsg-wheel button[aria-pressed='true']{background:#eef4e9;border-color:#c4d7bb}.dsg-wheel button[aria-pressed='true'] svg{color:#769271}
.dsg-wheel .dsg-wheel-center{left:50%;top:50%;width:66px;min-height:66px;border-radius:50%;background:#f3eadc;border:1px solid #d8c6b0;color:#886f56;gap:3px}.dsg-wheel-center svg{width:18px!important;height:18px!important;color:#9a8063!important}.dsg-wheel-center span{font-size:11px!important}
.dsg-wheel-note{margin:8px 0 0;text-align:center;font:11px/1.4 'Segoe UI','Microsoft YaHei',sans-serif;color:#6a8197}.dsg-wheel-pager{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:7px;height:24px;font:12px/1.4 'Segoe UI','Microsoft YaHei',sans-serif}.dsg-wheel-pager button{width:29px;height:24px;border:1px solid #becfdd;border-radius:9px;background:#fffaf2;color:#537b9e;cursor:pointer}.dsg-wheel-pager button:focus-visible{outline:2px dashed #547b9e;outline-offset:2px}
@keyframes dsg-wheel-arrive{from{opacity:0;translate:0 5px}to{opacity:1;translate:0 0}}
@media(prefers-reduced-motion:reduce){.dsg-menu{animation:none}.dsg-wheel button{transition:none}}
.dsg-clip{position:relative}.dsg-loading-art{position:absolute;left:50%;bottom:3%;transform:translateX(-50%);max-width:90%;border-radius:10px;padding:3px 7px;background:#fff9eeed;color:#537394;font-size:10px;line-height:1.4;white-space:nowrap}
.dsg-wardrobe-backdrop{position:fixed;z-index:4;inset:0;display:flex;align-items:center;padding:12px;box-sizing:border-box;background:rgba(35,50,78,.13)}
.dsg-wardrobe{box-sizing:border-box;width:500px;max-width:100%;max-height:calc(100dvh - 24px);overflow-y:auto;padding:22px;border:2px solid #c7d6e9;border-radius:25px;background:#fffaf2;color:#385574;box-shadow:0 16px 60px #203f6e30;font-family:inherit;font-size:14px;line-height:1.5;user-select:none}
.dsg-wardrobe h2{font:25px/1.4 'DSG Greeting Hand','KaiTi',cursive;margin:0 0 6px;color:#42678d}.dsg-wardrobe p{margin:0 0 15px;font-size:12px;color:#6d7b8d}
.dsg-outfits{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.dsg-outfit{display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:7px;min-width:0;padding:10px 6px 9px;border:2px solid #e2e6ec;border-radius:17px;color:#486381;background:#fff;cursor:pointer;font:inherit;line-height:1.5;transition:border-color .12s,background .12s}
.dsg-outfit[aria-pressed='true']{border-color:#81a6d2;background:#edf5ff}.dsg-outfit:hover{border-color:#9ab8d9}.dsg-outfit img{width:100%;max-width:130px;aspect-ratio:1;object-fit:contain;pointer-events:none}.dsg-outfit span{font-size:12px}.dsg-outfit small{min-height:18px;color:#6e86a5;font-size:10px}
.dsg-outfit .dsg-outfit-preview{display:block;position:relative;width:100%;max-width:130px;aspect-ratio:1}.dsg-outfit .dsg-wardrobe-art{max-width:none;aspect-ratio:auto;object-fit:fill}.dsg-outfit .dsg-hat{width:60%;height:auto;max-width:none;aspect-ratio:auto}.dsg-outfit .dsg-loading-art{display:none}
.dsg-wardrobe-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:18px}.dsg-wardrobe-actions button{font:inherit;font-size:13px;border:1px solid #c5d4e5;background:#fff;border-radius:12px;padding:8px 16px;color:#52718e;cursor:pointer}.dsg-wardrobe-actions .dsg-wear{background:#668ebd;color:#fff;border-color:#668ebd}.dsg-wardrobe-actions button:disabled{opacity:.5;cursor:wait}.dsg-wardrobe button:focus-visible{outline:2px dashed #496f9e;outline-offset:3px}.dsg-wardrobe .dsg-wardrobe-status{margin:13px 0 0;min-height:18px}
@media(max-width:420px){.dsg-wardrobe{padding:16px 12px}.dsg-outfits{gap:5px}.dsg-outfit{padding:8px 3px}.dsg-wardrobe h2{font-size:22px}}
.dsg-finance-card{position:absolute;box-sizing:border-box;max-height:calc(100dvh - 16px);overflow:auto;z-index:1;border:1.5px solid #a5bdd3;border-radius:15px 19px 14px 18px;padding:10px 12px 8px;background:#fff9ee;color:#486580;box-shadow:0 4px 13px #2b456314;cursor:pointer;text-align:left;font-family:inherit;line-height:1.45}
.dsg-finance-card:before{content:'✦';position:absolute;right:7px;top:2px;color:#dcad69;font-size:13px}.dsg-finance-card:hover{border-color:#6e94bb;background:#fff7e8}.dsg-finance-card:focus-visible{outline:2px dashed #50769f;outline-offset:3px}.dsg-finance-line{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-size:10px}.dsg-finance-line+.dsg-finance-line{margin-top:4px}.dsg-finance-value{font-family:'DSG Greeting Hand','KaiTi',cursive;font-size:15px;overflow-wrap:anywhere;text-align:right}.dsg-finance-card small{display:block;margin-top:5px;color:#8796a2;font-size:10px;border-top:1px dashed #d6dfdf;padding-top:4px}
.dsg-finance-backdrop{position:fixed;z-index:5;inset:0;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;background:#23324e24}.dsg-finance-panel{box-sizing:border-box;min-width:0;width:430px;max-width:100%;max-height:calc(100dvh - 24px);overflow-y:auto;padding:23px;border:2px solid #b7cce0;border-radius:23px 28px 22px 26px;background:#fff9ee;color:#45627e;font-family:inherit;font-size:13px;line-height:1.6;user-select:text;box-shadow:0 16px 60px #203f6e30}
.dsg-finance-panel h2{font:24px/1.5 'DSG Greeting Hand','KaiTi',cursive;margin:0 0 5px;color:#42678d}.dsg-finance-date{color:#8393a1;font-size:11px;margin:0 0 14px}.dsg-finance-section{padding:12px 0;border-top:1px dashed #c4d1dc}.dsg-finance-section h3{font-size:12px;font-weight:500;margin:0 0 5px;color:#71869b}.dsg-finance-amount{font:23px/1.5 'DSG Greeting Hand','KaiTi',cursive;margin:0 0 4px;overflow-wrap:anywhere}.dsg-finance-panel p{margin:6px 0}.dsg-finance-note{font-size:11px;color:#7c8b99}.dsg-finance-panel dl{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:5px 12px;margin:9px 0}.dsg-finance-panel dt{color:#7a8b9b}.dsg-finance-panel dd{margin:0;text-align:right;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}.dsg-finance-panel a{color:#5982ab;text-decoration:underline;text-underline-offset:3px}.dsg-finance-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:17px}.dsg-finance-actions button{border:1px solid #bbcee0;border-radius:11px;padding:7px 13px;background:#fff;color:#537898;font:inherit;font-size:12px;cursor:pointer}.dsg-finance-actions button:disabled{opacity:.55;cursor:wait}.dsg-finance-actions button:focus-visible{outline:2px dashed #50769f;outline-offset:2px}
@media(max-width:360px){.dsg-finance-panel{padding:16px}.dsg-finance-panel h2{font-size:21px}.dsg-finance-amount{font-size:20px}}
`;
    const decoded=new Map();
    const CACHE_LIMIT=8;
    function assetFor(outfit,state){return (normalizeOutfit(outfit)==='maid'?ASSETS:OUTFIT_ASSETS[normalizeOutfit(outfit)])[state];}
    function warmAsset(state,outfit='maid'){
      const key=normalizeOutfit(outfit)+':'+state;
      if(decoded.has(key)){const entry=decoded.get(key);decoded.delete(key);decoded.set(key,entry);return entry.promise;}
      if(typeof Image==='undefined')return Promise.resolve(false);
      const image=new Image();image.decoding='async';
      const entry={image,promise:null,ready:false};
      entry.promise=new Promise(resolve=>{const done=ok=>{entry.ready=ok;if(!ok&&decoded.get(key)===entry)decoded.delete(key);resolve(ok);};image.onload=()=>{if(typeof image.decode==='function')image.decode().then(()=>done(true),()=>done(false));else done(true);};image.onerror=()=>done(false);image.src=assetFor(outfit,state).strip;});
      decoded.set(key,entry);while(decoded.size>CACHE_LIMIT)decoded.delete(decoded.keys().next().value);return entry.promise;
    }
    function SpriteArt({state,outfit='maid',animate,label,startedAt,onReady,loadingLabel,loadAttempt=0,artClass='dsg-art',hidden=false}){
      const asset=assetFor(outfit,state),key=normalizeOutfit(outfit)+':'+state;
      const [ready,setReady]=React.useState(null);
      const playback=String(animate)+':'+String(!asset.loop&&hidden);
      const requested=React.useRef({key:'',startedAt:0,attempt:-1,playback:'',token:0});
      if(requested.current.key!==key||requested.current.startedAt!==startedAt||requested.current.attempt!==loadAttempt||requested.current.playback!==playback)requested.current={key,startedAt,attempt:loadAttempt,playback,token:requested.current.token+1};
      const token=requested.current.token;
      const notifyReady=React.useRef(onReady);notifyReady.current=onReady;
      React.useEffect(()=>{let live=true;warmAsset(state,outfit).then(ok=>{if(live){setReady({key,token,ok,elapsed:Math.max(0,Date.now()-(startedAt||Date.now()))});notifyReady.current?.({key,ok});}});return()=>{live=false;};},[token]);
      const loaded=ready?.key===key&&ready.token===token&&ready.ok,play=animate&&loaded;
      return h('span',{className:'dsg-clip','aria-busy':!loaded},h('img',{key:key+':'+play,className:artClass,'data-outfit':normalizeOutfit(outfit),'data-state':state,src:play?asset.strip:asset.still,alt:label,draggable:false,
        style:{width:play?asset.count*100+'%':'100%',animationName:play?'dsg-frames-'+state:'none',animationDuration:asset.duration+'ms',animationDelay:play&&!asset.loop?'-'+Math.min(asset.duration,ready.elapsed||0)+'ms':'0ms',animationIterationCount:asset.loop?'infinite':1}}),!loaded&&loadingLabel&&h('span',{className:'dsg-loading-art',role:'status'},loadingLabel));
    }
    function Mascot({running=false,phase='thinking',status,sessionId='',finance=FINANCE_IDLE_STORE,t=key=>DICTIONARIES.zh[key]||key}){
      const [prefs,setPrefs]=React.useState(()=>({...readPrefs(),...viewport(readPrefs())}));
      const [dragging,setDragging]=React.useState(false),[dropping,setDropping]=React.useState(false);
      const [preview,setPreview]=React.useState(null),[menu,setMenu]=React.useState(false);
      const [wardrobe,setWardrobe]=React.useState(null),[outfitReadiness,setOutfitReadiness]=React.useState(null);
      const [financePanel,setFinancePanel]=React.useState(false);
      const [financePeek,setFinancePeek]=React.useState(0),[financeHeld,setFinanceHeld]=React.useState(false);
      const wheelRef=React.useRef(null);
      const [financeCardHeight,setFinanceCardHeight]=React.useState(104);
      const financeSnapshot=React.useSyncExternalStore(finance.subscribe,finance.getSnapshot,finance.getSnapshot);
      const [sleeping,setSleeping]=React.useState(false),[celebrating,setCelebrating]=React.useState(false);
      const [eating,setEating]=React.useState(false),[begging,setBegging]=React.useState(false);
      const [touch,setTouch]=React.useState(null);
      const [greeting,setGreeting]=React.useState(null),[clockPlan,setClockPlan]=React.useState(()=>greetingFor(new Date()));
      const [greetingHeight,setGreetingHeight]=React.useState(128);
      const [reduced,setReduced]=React.useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      const [hidden,setHidden]=React.useState(()=>document.hidden===true);
      const root=React.useRef(null), drag=React.useRef(null), prefsRef=React.useRef(prefs);
      const greetingRef=React.useRef(null);
      const wardrobeRef=React.useRef(null),wardrobeFocus=React.useRef(null),wardrobeWasOpen=React.useRef(false);
      const financePanelRef=React.useRef(null),financeCardRef=React.useRef(null),financeWasOpen=React.useRef(false),financeHeightRef=React.useRef(104);
      const mealStarted=React.useRef(0),previewStarted=React.useRef(0),dropStarted=React.useRef(0),visualTimeline=React.useRef({key:'',startedAt:0});
      prefsRef.current=prefs;
      const feedingRef=React.useRef(false);
      const touchRef=React.useRef(null),touchTaps=React.useRef([]),touchSequence=React.useRef(0);
      const task=taskState(running,phase,status,sleeping,celebrating);
      const eligible=task==='idle'&&!eating&&!touch&&!dragging&&!dropping&&!preview&&prefs.beggingEnabled!==false;
      const greetingReady=task==='idle'&&!eating&&!touch&&!dragging&&!dropping&&!preview&&!menu&&!wardrobe&&!financePanel&&!financePeek;
      (React.useLayoutEffect||React.useEffect)(()=>{const element=financeCardRef.current;if(!element?.getBoundingClientRect)return;const measure=()=>{const height=Math.ceil(element.getBoundingClientRect().height);if(financeHeightRef.current!==height){financeHeightRef.current=height;setFinanceCardHeight(height);}};measure();const observer=typeof ResizeObserver==='function'?new ResizeObserver(measure):null;observer?.observe(element);return()=>observer?.disconnect();},[financePeek,financePanel,wardrobe,dragging,greeting?.period,greetingReady]);
      const financeActive=prefs.financeVisible!==false&&Boolean(financePeek||financePanel);
      React.useEffect(()=>finance.acquire(financeActive),[finance,financeActive]);
      React.useEffect(()=>{if(!financePeek||financeHeld||financePanel)return;const timer=setTimeout(()=>setFinancePeek(0),Math.max(0,financePeek+10000-Date.now()));return()=>clearTimeout(timer);},[financePeek,financeHeld,financePanel]);
      React.useEffect(()=>{if(prefs.financeVisible===false){setFinancePanel(false);setFinancePeek(0);setFinanceHeld(false);}},[prefs.financeVisible]);
      (React.useLayoutEffect||React.useEffect)(()=>{if(financePanel){financeWasOpen.current=true;const panel=financePanelRef.current;if(panel){panel.scrollTop=0;panel.focus?.({preventScroll:true});}}else if(financeWasOpen.current){financeWasOpen.current=false;(financeCardRef.current||root.current?.querySelector?.('.dsg-character'))?.focus?.({preventScroll:true});}},[financePanel]);
      React.useEffect(()=>{
        if(!financePanel)return;
        const close=e=>{if(e.type==='pointerdown'){if(!financePanelRef.current?.contains(e.target)){closeFinance();}return;}if(e.key==='Escape'){e.preventDefault();closeFinance();return;}if(e.key==='Tab'){const controls=[...(financePanelRef.current?.querySelectorAll('button:not(:disabled),a[href]')||[])],index=controls.indexOf(document.activeElement);if(!controls.length)return;if(e.shiftKey&&index<=0){e.preventDefault();controls.at(-1).focus();}else if(!e.shiftKey&&(index===controls.length-1||index===-1)){e.preventDefault();controls[0].focus();}}};
        window.addEventListener('pointerdown',close);window.addEventListener('keydown',close);return()=>{window.removeEventListener('pointerdown',close);window.removeEventListener('keydown',close);};
      },[financePanel]);
      (React.useLayoutEffect||React.useEffect)(()=>{
        const element=greetingRef.current;if(!greeting||!greetingReady||!element?.getBoundingClientRect)return;
        let live=true;const measure=()=>{if(!live)return;const height=Math.ceil(element.getBoundingClientRect().height);setGreetingHeight(previous=>previous===height?previous:height);};
        measure();const observer=typeof ResizeObserver==='function'?new ResizeObserver(measure):null;observer?.observe(element);
        document.fonts?.ready.then(measure);return()=>{live=false;observer?.disconnect();};
      },[greeting?.period,greetingReady]);
      const seen=React.useRef(status?.endSeq),lastSession=React.useRef(sessionId);
      React.useEffect(()=>{if(lastSession.current!==sessionId){lastSession.current=sessionId;seen.current=status?.endSeq;setCelebrating(false);return;}
        if(status?.endSeq===undefined)return;if(seen.current===undefined){seen.current=status.endSeq;return;}
        if(status.endSeq!==seen.current){seen.current=status.endSeq;if(status.outcome==='completed')setCelebrating(true);}
      },[status?.endSeq,status?.outcome,sessionId]);
      React.useEffect(()=>{if(running){setCelebrating(false);setSleeping(false);}},[running]);
      React.useEffect(()=>{if(!celebrating)return;const timer=setTimeout(()=>setCelebrating(false),Math.max(3200,ASSETS.success.delays.reduce((a,b)=>a+b,0)));return()=>clearTimeout(timer);},[celebrating]);
      React.useEffect(()=>{if(!dropping)return;const timer=setTimeout(()=>setDropping(false),ASSETS.drop.delays.reduce((a,b)=>a+b,0));return()=>clearTimeout(timer);},[dropping]);
      React.useEffect(()=>{if(!preview)return;const timer=setTimeout(()=>setPreview(null),Math.max(3500,ASSETS[preview].duration));return()=>clearTimeout(timer);},[preview]);
      React.useEffect(()=>{if(!eating)return;const timer=setTimeout(()=>{feedingRef.current=false;setEating(false);},Math.max(0,ASSETS.eating.duration-(Date.now()-mealStarted.current)));return()=>clearTimeout(timer);},[eating]);
      React.useEffect(()=>{if(!touch)return;const timer=setTimeout(()=>{touchRef.current=null;touchTaps.current=[];setTouch(null);},ASSETS[touch.kind].duration);return()=>clearTimeout(timer);},[touch]);
      React.useEffect(()=>{
        const visibility=()=>setHidden(document.hidden===true);document.addEventListener('visibilitychange',visibility);
        return()=>document.removeEventListener('visibilitychange',visibility);
      },[]);
      React.useEffect(()=>()=>{if(drag.current?.raf)cancelAnimationFrame(drag.current.raf);},[]);
      React.useEffect(()=>{
        let timer,cancelled=false;
        const sync=()=>{if(cancelled)return;clearTimeout(timer);const plan=greetingFor(new Date());setClockPlan(plan);timer=setTimeout(sync,Math.max(1000,plan.nextAt-Date.now()));};
        sync();window.addEventListener('focus',sync);document.addEventListener('visibilitychange',sync);
        return()=>{cancelled=true;clearTimeout(timer);window.removeEventListener('focus',sync);document.removeEventListener('visibilitychange',sync);};
      },[]);
      React.useEffect(()=>{
        if(!greetingReady||document.hidden||!greetingDue(clockPlan,prefs,Date.now()))return;
        const timer=setTimeout(()=>{if(document.hidden)return;const plan=greetingFor(new Date()),current={...prefsRef.current,...readPrefs()};if(!greetingDue(plan,current,Date.now()))return;
          setGreeting({period:plan.period});writePrefs({...current,greetingSeen:rememberGreeting(current.greetingSeen,plan.key,Date.now())});
        },800);return()=>clearTimeout(timer);
      },[greetingReady,clockPlan,prefs.greetingsEnabled,prefs.greetingSeen]);
      React.useEffect(()=>{if(!greeting)return;const timer=setTimeout(()=>setGreeting(null),10000);return()=>clearTimeout(timer);},[greeting]);
      React.useEffect(()=>{
        setBegging(false);if(!eligible)return;
        let cancelled=false,timer;
        const start=()=>{if(cancelled)return;if(!canBeg('idle',prefsRef.current,Date.now())){timer=setTimeout(start,12000);return;}
          setBegging(true);timer=setTimeout(()=>{if(cancelled)return;setBegging(false);timer=setTimeout(start,25000);},6000);};
        timer=setTimeout(start,Math.max(12000,lastFedAt(prefs.lastFed,Date.now())+FEED_QUIET_MS-Date.now()));
        return()=>{cancelled=true;clearTimeout(timer);};
      },[eligible,prefs.lastFed,prefs.beggingEnabled]);
      React.useEffect(()=>{
        let timer;const wake=()=>{setSleeping(false);clearTimeout(timer);if(!running)timer=setTimeout(()=>setSleeping(true),90000);};wake();
        window.addEventListener('pointerdown',wake);window.addEventListener('keydown',wake);
        return()=>{clearTimeout(timer);window.removeEventListener('pointerdown',wake);window.removeEventListener('keydown',wake);};
      },[running]);
      React.useEffect(()=>{
        const refresh=()=>setPrefs({...readPrefs(),...viewport(readPrefs())});const resize=()=>setPrefs(p=>({...p,...viewport(p)}));
        window.addEventListener('deepseek-girl-preferences',refresh);window.addEventListener('storage',refresh);window.addEventListener('resize',resize);
        const media=window.matchMedia('(prefers-reduced-motion: reduce)'),change=()=>setReduced(media.matches);media.addEventListener('change',change);
        return()=>{window.removeEventListener('deepseek-girl-preferences',refresh);window.removeEventListener('storage',refresh);window.removeEventListener('resize',resize);media.removeEventListener('change',change);};
      },[]);
      React.useEffect(()=>{
        const el=root.current;if(!el)return;const wheel=e=>{if(!e.ctrlKey)return;e.preventDefault();const p=prefsRef.current;writePrefs({...p,...viewport({...p,size:p.size-e.deltaY*.15})});};
        el.addEventListener('wheel',wheel,{passive:false});return()=>el.removeEventListener('wheel',wheel);
      },[]);
      React.useEffect(()=>{
        if(!menu)return;
        const timer=setTimeout(()=>wheelRef.current?.querySelector?.('button:not(:disabled)')?.focus?.({preventScroll:true}),0);
        const close=e=>{if(e.type==='pointerdown'){if(!root.current?.contains(e.target))setMenu(false);return;}if(e.key==='Escape'){e.preventDefault();closeMenu();return;}
          if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(e.key)){const controls=[...(wheelRef.current?.querySelectorAll('button:not(:disabled)')||[])];if(!controls.length)return;e.preventDefault();const current=controls.indexOf(document.activeElement),next=e.key==='Home'?0:e.key==='End'?controls.length-1:(current+(e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:1)+controls.length)%controls.length;controls[next].focus();}};
        const blur=e=>{if(!root.current?.contains(e.target))setMenu(false);};
        window.addEventListener('pointerdown',close);window.addEventListener('keydown',close);window.addEventListener('focusin',blur);
        return()=>{clearTimeout(timer);window.removeEventListener('pointerdown',close);window.removeEventListener('keydown',close);window.removeEventListener('focusin',blur);};
      },[menu]);
      React.useEffect(()=>{
        if(!wardrobe){if(wardrobeWasOpen.current){wardrobeWasOpen.current=false;wardrobeFocus.current?.focus?.();}return;}
        if(!wardrobeWasOpen.current){wardrobeWasOpen.current=true;wardrobeFocus.current=root.current?.querySelector?.('.dsg-character')||document.activeElement;}
        const focusTimer=setTimeout(()=>wardrobeRef.current?.querySelector('[aria-pressed="true"]')?.focus(),0);
        const close=e=>{if(e.type==='pointerdown'){if(!wardrobeRef.current?.contains(e.target))setWardrobe(null);return;}
          if(e.key==='Escape'){e.preventDefault();setWardrobe(null);return;}
          if(e.key==='Tab'){const controls=[...(wardrobeRef.current?.querySelectorAll('button:not(:disabled)')||[])];if(!controls.length)return;const index=controls.indexOf(document.activeElement);if(e.shiftKey&&index<=0){e.preventDefault();controls.at(-1).focus();}else if(!e.shiftKey&&(index===controls.length-1||index===-1)){e.preventDefault();controls[0].focus();}}
        };
        window.addEventListener('pointerdown',close);window.addEventListener('keydown',close);return()=>{clearTimeout(focusTimer);window.removeEventListener('pointerdown',close);window.removeEventListener('keydown',close);};
      },[Boolean(wardrobe)]);
      React.useEffect(()=>{warmAsset('idle',prefs.outfit);},[prefs.outfit]);
      const state=visualState(task,dragging,dropping,preview,eating,begging&&eligible,touch?.kind);
      const outfit=wardrobe?.outfit||normalizeOutfit(prefs.outfit),outfitKey=outfit+':'+state;
      const outfitReady=decoded.get(outfitKey)?.ready===true||outfitReadiness?.key===outfitKey&&outfitReadiness.ok;
      const timelineKey=state+':'+(preview?'preview-'+previewStarted.current:eating?'meal-'+mealStarted.current:touch?'touch-'+touch.sequence:'task');
      if(visualTimeline.current.key!==timelineKey)visualTimeline.current={key:timelineKey,startedAt:Date.now()};
      const startedAt=preview&&state===preview?previewStarted.current:eating&&state==='eating'?mealStarted.current:touch&&state===touch.kind?touch.startedAt:state==='drop'?dropStarted.current:visualTimeline.current.startedAt;
      const animate=prefs.animate!==false&&!reduced;
      const greetingPosition=greetingGeometry(prefs,window.innerWidth,window.innerHeight,greetingHeight);
      const accountFinance=financeSnapshot.account,summaryFinance=financeSnapshot.summary;
      const financeStatus=value=>t(value==='loading'?'financeLoading':value==='failed'?'financeFailed':value==='signed-out'?'financeSignedOut':'financeUnavailable');
      const balanceText=accountFinance.status==='ready'?(financeBalanceText(accountFinance.wallets)||t('financeNoWallet')):financeStatus(accountFinance.status);
      const estimateText=summaryFinance.status==='ready'?financeEstimateText(summaryFinance.estimate):financeStatus(summaryFinance.status);
      const tokenCount=value=>Number.isSafeInteger(value)&&value>=0?value.toLocaleString():'—';
      const financeWidth=Math.max(1,Math.min(220,window.innerWidth-16)),financeBelow=prefs.y+prefs.size+39,financeAbove=financeBelow+financeCardHeight>window.innerHeight-8;
      const financePosition={left:clamp(prefs.x+prefs.size/2-financeWidth/2,8,Math.max(8,window.innerWidth-financeWidth-8))-prefs.x,top:Math.max(8,financeAbove?prefs.y-financeCardHeight-8:financeBelow)-prefs.y,width:financeWidth};
      const financeUpdated=Math.max(accountFinance.updatedAt||0,summaryFinance.updatedAt||0);
      function greet(){const plan=greetingFor(new Date());setGreeting({period:plan.period});setMenu(false);setPreview(null);setSleeping(false);writePrefs({...prefsRef.current,greetingSeen:rememberGreeting(prefsRef.current.greetingSeen,plan.key,Date.now())});}
      function stopTouch(){touchRef.current=null;touchTaps.current=[];setTouch(null);}
      function pet(){if(feedingRef.current||touchRef.current?.kind==='pouting')return;if(prefsRef.current.financeVisible!==false){setFinancePeek(Date.now());setGreeting(null);}const reaction=patReaction(touchTaps.current,Date.now());touchTaps.current=reaction.taps;const next={kind:reaction.state,sequence:++touchSequence.current,startedAt:Date.now()};touchRef.current=next;setTouch(next);setMenu(false);setPreview(null);setSleeping(false);setBegging(false);setDropping(false);}
      function feed(){if(feedingRef.current)return;feedingRef.current=true;setFinancePeek(0);setFinanceHeld(false);mealStarted.current=Date.now();stopTouch();setMenu(false);setPreview(null);setSleeping(false);setBegging(false);setDropping(false);setEating(true);writePrefs({...prefsRef.current,lastFed:Date.now()});}
      function down(e){if(e.button!==0)return;setFinancePeek(0);setFinanceHeld(false);setMenu(false);setPreview(null);setDropping(false);drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,start:{...prefsRef.current},moved:false};e.currentTarget.setPointerCapture(e.pointerId);}
      function move(e){const d=drag.current;if(!d||d.id!==e.pointerId)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(!d.moved&&Math.hypot(dx,dy)<4)return;if(!d.moved){d.moved=true;stopTouch();setDragging(true);}d.position=viewport({...d.start,x:d.start.x+dx,y:d.start.y+dy});
        if(!d.raf)d.raf=requestAnimationFrame(()=>{d.raf=0;if(drag.current!==d||!root.current)return;root.current.style.transform=`translate3d(${d.position.x-d.start.x}px,${d.position.y-d.start.y}px,0)`;});}
      function finish(e,cancel=false){const d=drag.current;if(!d||d.id!==e.pointerId)return;drag.current=null;if(d.raf)cancelAnimationFrame(d.raf);setDragging(false);if(d.moved){const next={...prefsRef.current,...d.position};if(root.current){root.current.style.left=next.x+'px';root.current.style.top=next.y+'px';root.current.style.transform='';}setPrefs(next);writePrefs(next);if(!cancel){dropStarted.current=Date.now();setDropping(true);}}else if(!cancel){const bounds=e.currentTarget.getBoundingClientRect();if(d.y-bounds.top<=bounds.height*.68)pet();else{toggleMenu();}}}
      function closeMenu(){setMenu(false);root.current?.querySelector?.('.dsg-character')?.focus?.({preventScroll:true});}
      function toggleMenu(){setFinancePeek(0);setFinanceHeld(false);setMenu(value=>value?false:'main');}
      function closeFinance(){setFinancePeek(Date.now());setFinancePanel(false);}
      const wheelPage=typeof menu==='string'?menu:'main';
      const wheelEntry=(icon,label,action,extra={})=>({icon,label,action,...extra});
      const switchPage=page=>()=>setMenu(page);
      const chooseState=key=>()=>{previewStarted.current=Date.now();setPreview(key);closeMenu();};
      const commonWheel=[
        wheelEntry('rice','feed',feed,{short:'wheelFeed',disabled:eating}),
        wheelEntry('pet','pet',pet,{short:'wheelPet',disabled:eating||touch?.kind==='pouting'}),
        wheelEntry('wardrobe','wardrobe',()=>{setWardrobe({outfit:normalizeOutfit(prefsRef.current.outfit),attempt:0});setMenu(false);},{short:'wheelWardrobe'}),
        wheelEntry('hat',prefs.hat?'hatOff':'hatOn',()=>writePrefs({...prefsRef.current,hat:!prefs.hat}),{short:prefs.hat?'wheelHatOff':'wheelHatOn',pressed:prefs.hat===true}),
        wheelEntry('hello','greetNow',greet,{short:'wheelHello'}),wheelEntry('more','wheelMore',switchPage('more'))];
      const moreWheel=[wheelEntry('expressions','wheelExpressions',switchPage('expressions-0')),wheelEntry('ledger','financeOpen',()=>{setFinancePanel(true);setFinancePeek(Date.now());setMenu(false);},{short:'wheelLedger',disabled:prefs.financeVisible===false}),wheelEntry('settings','wheelSettings',switchPage('settings')),wheelEntry('follow','follow',()=>{setPreview(null);closeMenu();},{short:'wheelFollow'}),wheelEntry(prefs.animate===false?'play':'pause',prefs.animate===false?'resume':'pause',()=>writePrefs({...prefsRef.current,animate:prefs.animate===false}),{short:prefs.animate===false?'wheelResume':'wheelPause'}),wheelEntry('reset','reset',()=>{writePrefs({...prefsRef.current,...viewport({})});closeMenu();},{short:'wheelReset'})];
      const settingsWheel=[wheelEntry('rice',prefs.beggingEnabled===false?'begOn':'begOff',()=>writePrefs({...prefsRef.current,beggingEnabled:prefs.beggingEnabled===false}),{short:'wheelBeg',pressed:prefs.beggingEnabled!==false}),wheelEntry('hello',prefs.greetingsEnabled===false?'greetingsOn':'greetingsOff',()=>{setGreeting(null);writePrefs({...prefsRef.current,greetingsEnabled:prefs.greetingsEnabled===false});},{short:'wheelGreetings',pressed:prefs.greetingsEnabled!==false}),wheelEntry('ledger',prefs.financeVisible===false?'financeShow':'financeHide',()=>writePrefs({...prefsRef.current,financeVisible:prefs.financeVisible===false}),{short:'wheelFinance',pressed:prefs.financeVisible!==false})];
      const expressionPage=wheelPage==='expressions-1'?1:0,isExpressions=wheelPage.startsWith('expressions-');
      const wheelEntries=wheelPage==='main'?commonWheel:wheelPage==='more'?moreWheel:wheelPage==='settings'?settingsWheel:STATES.slice(expressionPage*6,expressionPage*6+6).map(key=>wheelEntry('expressions',key,chooseState(key)));
      const wheelWidth=Math.min(256,window.innerWidth-16),wheelHeight=wheelWidth+32;
      const wheelLeft=prefs.x>=wheelWidth+20?prefs.x-wheelWidth-12:prefs.x+prefs.size+wheelWidth+20<=window.innerWidth?prefs.x+prefs.size+12:prefs.x+prefs.size/2-wheelWidth/2;
      const wheelPosition={left:clamp(wheelLeft,8,Math.max(8,window.innerWidth-wheelWidth-8)),top:clamp(prefs.y+(prefs.size+30)/2-wheelHeight/2,8,Math.max(8,window.innerHeight-wheelHeight-8)),width:wheelWidth};
      return h('div',{ref:root,className:'dsg-root',style:{left:prefs.x,top:prefs.y,width:prefs.size},'data-deepseek-girl-state':state,'data-outfit':outfit,'data-saved-outfit':normalizeOutfit(prefs.outfit),'data-hidden':String(hidden),'data-motion-enabled':String(animate)},
        greeting&&greetingReady&&h('div',{ref:greetingRef,className:'dsg-greeting',role:'status','aria-live':'polite','data-side':greetingPosition.side,style:{left:greetingPosition.left,top:greetingPosition.top,width:greetingPosition.width,'--dsg-tail-x':greetingPosition.tailX+'px','--dsg-text-max-height':Math.max(1,greetingPosition.maxHeight-46)+'px'}},
          h('span',{className:'dsg-greeting-text'},t('greet_'+greeting.period)),
          h('svg',{className:'dsg-greeting-paper',viewBox:'0 0 360 160',preserveAspectRatio:'none','aria-hidden':true},
            h('path',{d:'M30 5 C85 1 113 10 171 5 S274 7 328 4 Q354 5 353 28 C359 58 350 99 356 130 Q353 157 326 153 C272 159 234 148 179 153 S80 151 29 155 Q4 155 6 130 C1 96 10 65 4 29 Q5 6 30 5 Z',fill:'#fff9ee',stroke:'#83a6c7',strokeWidth:2.2,vectorEffect:'non-scaling-stroke',strokeLinecap:'round'}),
            h('path',{d:'M29 8 C95 6 227 10 328 8 Q351 8 351 31 L352 130 Q351 151 327 150 C236 153 115 147 31 151 Q9 152 9 130 L8 30 Q7 9 29 8',fill:'none',stroke:'#bad0df',strokeWidth:1.1,strokeDasharray:'17 4 9 3',vectorEffect:'non-scaling-stroke',strokeLinecap:'round'})),
          h('span',{className:'dsg-greeting-tail','aria-hidden':true}),
          h('svg',{className:'dsg-greeting-mark',viewBox:'0 0 24 24','aria-hidden':true},h('path',{d:'M12 3 L15 8 L21 10 L16 14 L16 21 L11 17 L5 19 L6 12 L2 8 L9 8 Z',fill:'#f5d595',stroke:'#d7aa67',strokeWidth:1.6,strokeLinejoin:'round',strokeLinecap:'round'})),
          h('svg',{className:'dsg-greeting-doodle',viewBox:'0 0 38 10','aria-hidden':true},h('path',{d:'M2 4 Q12 1 32 4 M5 8 Q16 5 36 6',fill:'none',stroke:'currentColor',strokeWidth:2.1,strokeLinecap:'round'})),
          h('button',{type:'button',title:t('closeGreeting'),'aria-label':t('closeGreeting'),onClick:()=>setGreeting(null)},h('svg',{viewBox:'0 0 20 20','aria-hidden':true},h('path',{d:'M5 4 Q9 9 15 16 M15 5 Q10 10 4 15',fill:'none',stroke:'currentColor',strokeWidth:2.1,strokeLinecap:'round'})))),
        h('button',{className:'dsg-character',type:'button','aria-label':'DeepSeek 娘：'+t(state)+'；'+t('accessible'),title:t('hint'),
          onPointerDown:down,onPointerMove:move,onPointerUp:e=>finish(e),onPointerCancel:e=>finish(e,true),onLostPointerCapture:e=>finish(e,true),
          onContextMenu:e=>{e.preventDefault();toggleMenu();},onKeyDown:e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggleMenu();}}},
          h('span',{className:'dsg-motion','data-motion':state,'data-animate':String(animate)},h(SpriteArt,{key:state+':'+(preview?'preview':eating?'meal':touch?'touch-'+touch.sequence:'task'),state,outfit,animate,hidden,startedAt,loadAttempt:wardrobe?.attempt||0,label:t(state),loadingLabel:t('outfitLoading'),onReady:setOutfitReadiness}),prefs.hat&&h('img',{className:'dsg-hat',src:PROPS.hat,alt:t('hat'),draggable:false})),
          state==='petting'&&h('span',{className:'dsg-affection',key:touch?.sequence||'preview','aria-hidden':true},[0,1,2].map(index=>h('svg',{className:'dsg-heart',key:index,viewBox:'0 0 24 24'},h('path',{d:'M12 20 C4 14 1 10 3 6 C5 2 10 3 12 7 C14 3 19 2 21 6 C23 10 20 14 12 20Z',fill:'currentColor'}))))),
        h('div',{className:'dsg-footer'},h('span',{className:'dsg-label'},(preview?t('preview'):'')+t(state)),
          h('button',{className:'dsg-food',type:'button',onClick:feed,disabled:eating,title:t('feed'),'aria-label':t('feed')},h('img',{src:PROPS.rice,alt:'',draggable:false}))),
        financeActive&&Boolean(financePeek)&&!dragging&&!wardrobe&&!financePanel&&!menu&&!hidden&&h('button',{ref:financeCardRef,type:'button',className:'dsg-finance-card',style:financePosition,'aria-label':t('financeOpen'),'aria-busy':financeSnapshot.refreshing,onPointerEnter:()=>setFinanceHeld(true),onPointerLeave:()=>{if(!financeCardRef.current?.contains(document.activeElement))setFinanceHeld(false);},onFocus:()=>setFinanceHeld(true),onBlur:e=>{if(!e.currentTarget.contains(e.relatedTarget)){setFinanceHeld(false);}},onClick:()=>{setFinancePanel(true);setMenu(false);}},
          h('span',{className:'dsg-finance-line'},h('span',null,t('financeBalance')),h('span',{className:'dsg-finance-value','data-finance-balance':accountFinance.status},balanceText)),
          h('span',{className:'dsg-finance-line'},h('span',null,t('financeToday')),h('span',{className:'dsg-finance-value','data-finance-estimate':summaryFinance.status},estimateText)),
          h('small',null,summaryFinance.status==='ready'?(financeIncomplete(summaryFinance)?t('financePartial')+' · ':'')+t('financeTokens')+' '+tokenCount(summaryFinance.tokens.total):t('financeSnapshot'))),
        menu&&h('div',{ref:wheelRef,className:'dsg-menu',role:'dialog','aria-label':t('menu'),'data-wheel-page':wheelPage,style:wheelPosition},
          h('div',{className:'dsg-wheel'},wheelEntries.map((item,index)=>{const angle=(-90+index*360/wheelEntries.length)*Math.PI/180;return h('button',{key:wheelPage+':'+item.label,type:'button','aria-label':t(item.label),title:t(item.label),disabled:item.disabled,'aria-pressed':item.pressed,onClick:item.action,style:{left:(50+33*Math.cos(angle))+'%',top:(50+33*Math.sin(angle))+'%'}},h(WheelIcon,{name:item.icon}),h('span',null,t(item.short||item.label)));}),
            h('button',{type:'button',className:'dsg-wheel-center','aria-label':t(wheelPage==='main'?'wheelClose':'wheelBack'),onClick:wheelPage==='main'?closeMenu:switchPage(wheelPage==='more'?'main':'more')},h(WheelIcon,{name:wheelPage==='main'?'close':'back'}),h('span',null,t(wheelPage==='main'?'wheelName':'wheelBack')))),
          isExpressions?h('div',{className:'dsg-wheel-pager'},h('button',{type:'button','aria-label':t('wheelPrevious'),onClick:switchPage('expressions-'+(1-expressionPage))},'‹'),h('span',{'aria-live':'polite'},(expressionPage+1)+' / 2'),h('button',{type:'button','aria-label':t('wheelNext'),onClick:switchPage('expressions-'+(1-expressionPage))},'›')):h('p',{className:'dsg-wheel-note'},t('wheelHint'))),
        wardrobe&&h('div',{className:'dsg-wardrobe-backdrop',style:{justifyContent:prefs.x+prefs.size/2>window.innerWidth/2?'flex-start':'flex-end'}},h('section',{ref:wardrobeRef,className:'dsg-wardrobe',role:'dialog','aria-modal':true,'aria-labelledby':'dsg-wardrobe-title','aria-describedby':'dsg-wardrobe-hint'},
          h('h2',{id:'dsg-wardrobe-title'},t('wardrobeTitle')),h('p',{id:'dsg-wardrobe-hint'},t('wardrobeHint')),
          h('div',{className:'dsg-outfits'},OUTFITS.map(item=>h('button',{key:item.id,type:'button',className:'dsg-outfit','data-outfit-choice':item.id,'aria-pressed':outfit===item.id,onClick:()=>{if(outfit===item.id&&outfitReadiness?.key===outfitKey&&outfitReadiness.ok===false){setOutfitReadiness(null);setWardrobe({outfit:item.id,attempt:(wardrobe.attempt||0)+1});}else if(outfit!==item.id){setOutfitReadiness(null);setWardrobe({outfit:item.id,attempt:0});}}},outfit===item.id?h('span',{className:'dsg-outfit-preview'},h(SpriteArt,{state,outfit,animate,hidden,startedAt,loadAttempt:wardrobe.attempt||0,label:t(state),artClass:'dsg-wardrobe-art'}),prefs.hat&&h('img',{className:'dsg-hat',src:PROPS.hat,alt:t('hat'),draggable:false})):h('img',{src:assetFor(item.id,'idle').still,alt:'',draggable:false}),h('span',null,t('outfit_'+item.id)),h('small',null,normalizeOutfit(prefs.outfit)===item.id?t('outfitSaved'):outfit===item.id?t('outfitPreview'):' ')))),
          h('p',{className:'dsg-wardrobe-status',role:'status','aria-live':'polite'},outfitReady?' ':outfitReadiness?.key===outfitKey&&outfitReadiness.ok===false?t('outfitError'):t('outfitLoading')),
          h('div',{className:'dsg-wardrobe-actions'},h('button',{type:'button',onClick:()=>setWardrobe(null)},t('cancelOutfit')),h('button',{className:'dsg-wear',type:'button',disabled:!outfitReady,onClick:()=>{writePrefs({...prefsRef.current,outfit});setWardrobe(null);}},t('wear'))))),
        financePanel&&h('div',{className:'dsg-finance-backdrop'},h('section',{ref:financePanelRef,className:'dsg-finance-panel',role:'dialog',tabIndex:-1,'aria-modal':true,'aria-labelledby':'dsg-finance-title'},
          h('h2',{id:'dsg-finance-title'},t('financeTitle')),h('p',{className:'dsg-finance-date'},summaryFinance.status==='ready'?summaryFinance.day+' · '+t('financeSnapshot'):t('financeSnapshot')),
          h('section',{className:'dsg-finance-section'},h('h3',null,t('financeBalance')),h('p',{className:'dsg-finance-amount'},balanceText),
            accountFinance.status==='ready'&&h('dl',null,h('dt',null,t('financeRecharge')),h('dd',null,financeBalanceText(accountFinance.recharge)||'—'),h('dt',null,t('financeBonus')),h('dd',null,financeBalanceText(accountFinance.bonus)||'—')),h('p',{className:'dsg-finance-note'},t('financeAccountScope'))),
          h('section',{className:'dsg-finance-section'},h('h3',null,t('financeToday')),h('p',{className:'dsg-finance-amount'},estimateText),
            summaryFinance.status==='ready'?h(React.Fragment,null,h('dl',null,['input','output','cacheRead','cacheWrite','total'].flatMap(key=>[h('dt',{key:'label-'+key},t('finance'+key[0].toUpperCase()+key.slice(1))),h('dd',{key:'value-'+key,'data-finance-token':key},tokenCount(summaryFinance.tokens[key]))])),h('dl',null,h('dt',null,t('financeRequests')),h('dd',null,tokenCount(summaryFinance.requests)),h('dt',null,t('financeMissing')),h('dd',null,tokenCount(summaryFinance.missingUsage)),h('dt',null,t('financeUnpriced')),h('dd',null,tokenCount(summaryFinance.estimate.unpricedRequests))),financeIncomplete(summaryFinance)&&h('p',{className:'dsg-finance-note'},t('financePartial')),h('p',{className:'dsg-finance-note'},t('financePricing')),summaryFinance.estimate.sourceUrl&&h('a',{href:summaryFinance.estimate.sourceUrl,target:'_blank',rel:'noopener noreferrer'},t('financePriceSource')+(summaryFinance.estimate.asOf?' · '+summaryFinance.estimate.asOf:''))):h('p',{className:'dsg-finance-note'},t('financeNoSummary')),
            h('p',{className:'dsg-finance-note'},t('financeScope')),h('a',{className:'dsg-finance-official-bill',href:'https://platform.deepseek.com/usage',target:'_blank',rel:'noopener noreferrer'},t('financeOfficialBill'))),
          h('p',{className:'dsg-finance-note','data-finance-updated':financeUpdated||''},t('financeUpdated')+' '+(financeUpdated?new Date(financeUpdated).toLocaleTimeString():'—')),
          h('div',{className:'dsg-finance-actions'},h('button',{type:'button',disabled:financeSnapshot.refreshing,onClick:()=>finance.refresh(true)},t(financeSnapshot.refreshing?'financeRefreshing':'financeRefresh')),h('button',{type:'button',onClick:closeFinance},t('financeClose'))))));
    }
    class Boundary extends React.Component{constructor(props){super(props);this.state={failed:false};}static getDerivedStateFromError(){return{failed:true};}componentDidCatch(error){console.error('[DeepSeek Girl]',error);}render(){return this.state.failed?null:this.props.children;}}
    const guarded=Component=>function Entry(props){if(!props)return null;return h(Boundary,null,h(Component,props));};
    return {inject:['slots','sessions','uiConversation','locale'],apply(ctx){
      ctx.effect(()=>ctx.locale.register('@local/dsh-deepseek-girl',DICTIONARIES));
      const finance=createFinanceClient(ctx);ctx.effect(()=>()=>finance.dispose?.());
      function SessionGirl(props){
        const running=props.useSession(s=>s?.running===true);
        const status=props.useProjection('deepseekGirlStatus');
        const key=props.useChat(latestAssistantKey);
        const phase=props.useGirlNode(key,assistantPhase);
        React.useEffect(()=>{docks++;notify();return()=>{docks--;notify();};},[]);
        return h(Mascot,{running,status,phase,sessionId:props.sessionId,finance,t:props.t});
      }
      function FloatingGirl(props){const dock=React.useSyncExternalStore(presence.subscribe,presence.snapshot,presence.snapshot);
        return dock?null:h(Mascot,{finance,t:props.t});
      }
      ctx.effect(()=>{const el=document.createElement('style');el.textContent=CSS;document.head.appendChild(el);return()=>el.remove();});
      ctx.effect(()=>()=>decoded.clear());
      ctx.slots.inject('conversation.composer.dock',()=>ctx.slots.register({name:'conversation.composer.dock',id:'deepseek-girl',order:25,locale:'@local/dsh-deepseek-girl',
        inject:sessionId=>{const binding=ctx.sessions.binding(sessionId),target=ctx.uiConversation.binding(binding).target('chat');return{keyedHooks:{girlNode:key=>key?target.getSnapshot().nodes.source(key):{getSnapshot:()=>undefined,subscribe:()=>()=>{}}}};}
      },guarded(SessionGirl)));
      ctx.slots.inject('shell.overlay',()=>ctx.slots.register({name:'shell.overlay',id:'deepseek-girl-floating',order:25,locale:'@local/dsh-deepseek-girl'},guarded(FloatingGirl)));
    }};
  }
});
