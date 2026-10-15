window.__ModuleLoader__.load({
  id: '@local/dsh-deepseek-girl',
  factory(require) {
    const React = require('react'), h = React.createElement;
    const ASSETS = __ASSETS__;
    const OUTFIT_ASSETS = __OUTFIT_ASSETS__;
    const OUTFITS = [{id:'maid',zh:'经典女仆装',en:'Classic maid'},{id:'hoodie',zh:'蓝白休闲卫衣',en:'Blue & white hoodie'},{id:'pajamas',zh:'星星睡衣',en:'Star pajamas'}];
    const PROPS = __PROPS__;
    __LOGIC__
    const STATES = ["idle","thinking","generating","success","error","dragging","drop","sleeping","begging","eating","petting","pouting"];
    const DICTIONARIES = {"zh":{"idle":"待机","thinking":"思考中","generating":"正在回答","success":"完成啦","error":"遇到错误","dragging":"被拎起来啦","drop":"落地啦","sleeping":"休息中","hint":"轻点头部：摸头 · 身体 / 右键：菜单 · 拖动：移动 · Ctrl+滚轮：缩放","preview":"预览 · ","menu":"DeepSeek 娘 · 表情与互动","follow":"跟随当前任务","resume":"开启动画","pause":"暂停动画","reset":"恢复默认位置和大小","help":"轻点头部摸摸头，快速点三次会鼓脸。身体点击 / 右键打开菜单。点白饭盆喂饭；拖动移动，Ctrl + 滚轮缩放。帽子可开关，喂饱后两分钟不再求饭。","accessible":"轻点头部摸头，身体点击或右键打开菜单，拖动移动，Ctrl 加滚轮缩放","begging":"捧盆求喂饭","eating":"开心吃白饭","feed":"喂她一盆白饭","hat":"铁盆帽","hatOn":"戴上铁盆帽","hatOff":"摘下铁盆帽","begOn":"开启待机捧盆求饭","begOff":"关闭待机捧盆求饭","greet_morning":"早上好～今天也一起加油吧！","greet_noon":"中午好～记得吃午饭，我也想要一盆白饭！","greet_afternoon":"下午好～忙了一阵，喝口水休息一下吧。","greet_evening":"晚上好～辛苦啦，记得放松一下。","greet_late":"已经很晚啦～熬夜也要注意身体，记得休息哦。","greetNow":"和我打个招呼","greetingsOn":"开启时间问候","greetingsOff":"关闭时间问候","closeGreeting":"关闭问候气泡","petting":"被摸头","pouting":"鼓脸啦","pet":"摸摸头"},"en":{"idle":"Idle","thinking":"Thinking","generating":"Answering","success":"Done!","error":"Error","dragging":"Picked up!","drop":"Landed!","sleeping":"Sleeping","hint":"Tap head: pet · Body / right click: menu · Drag: move · Ctrl+wheel: resize","preview":"Preview · ","menu":"DeepSeek Girl · Expressions & interactions","follow":"Follow task","resume":"Resume animation","pause":"Pause animation","reset":"Reset position and size","help":"Tap her head for a pat; three quick taps make her pout. Click her body or right-click for the menu. Feed with the rice basin, drag to move, Ctrl + wheel to resize. Toggle her hat; feeding pauses rice requests for two minutes.","accessible":"Tap her head to pet, click her body or right-click for the menu, drag to move, Ctrl plus wheel to resize","begging":"Asking for rice","eating":"Enjoying white rice","feed":"Feed a basin of white rice","hat":"Iron basin hat","hatOn":"Wear basin hat","hatOff":"Remove basin hat","begOn":"Enable idle rice requests","begOff":"Disable idle rice requests","greet_morning":"Good morning! Let’s make it a lovely day.","greet_noon":"Good afternoon! Remember lunch. I’d love a basin of rice, too!","greet_afternoon":"Hello! Take a moment to rest and have some water.","greet_evening":"Good evening! You’ve worked hard. Remember to relax.","greet_late":"It’s getting late. Take care of yourself and get some rest.","greetNow":"Say hello","greetingsOn":"Enable time greetings","greetingsOff":"Disable time greetings","closeGreeting":"Dismiss greeting","petting":"Enjoying head pats","pouting":"Pouting","pet":"Pat her head"}};
    Object.assign(DICTIONARIES.zh,{wardrobe:'打开小衣柜',wardrobeTitle:'今天想穿哪一套？',wardrobeHint:'点选衣服预览，确认后会记住你的选择。',wear:'就穿这套',cancelOutfit:'取消',outfitLoading:'正在整理衣服…',outfitError:'衣服暂时没准备好，请重新点选。',outfitSaved:'正在穿',outfitPreview:'预览中',outfit_maid:'经典女仆装',outfit_hoodie:'蓝白休闲卫衣',outfit_pajamas:'星星睡衣'});
    Object.assign(DICTIONARIES.en,{wardrobe:'Open wardrobe',wardrobeTitle:'What shall I wear today?',wardrobeHint:'Choose a look to preview; confirm to remember it.',wear:'Wear this outfit',cancelOutfit:'Cancel',outfitLoading:'Getting dressed…',outfitError:'This outfit could not load. Please select it again.',outfitSaved:'Wearing',outfitPreview:'Preview',outfit_maid:'Classic maid',outfit_hoodie:'Blue & white hoodie',outfit_pajamas:'Star pajamas'});
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
.dsg-menu{position:absolute;z-index:2;box-sizing:border-box;width:252px;max-width:calc(100vw - 16px);max-height:calc(100vh - 64px);overflow-y:auto;padding:12px;border-radius:14px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);box-shadow:0 6px 28px rgba(0,0,0,.18);font-size:12px}
.dsg-menu strong{display:block;margin-bottom:9px}.dsg-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px}.dsg-menu button{cursor:pointer;font:inherit;color:inherit;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);border-radius:7px;padding:7px}.dsg-menu button:hover{color:var(--dsw-alias-state-business-primary)}.dsg-menu .dsg-wide{width:100%;margin-top:7px}.dsg-help{line-height:1.6;color:var(--dsw-alias-label-tertiary);margin:9px 0 0}
.dsg-clip{position:relative}.dsg-loading-art{position:absolute;left:50%;bottom:3%;transform:translateX(-50%);max-width:90%;border-radius:10px;padding:3px 7px;background:#fff9eeed;color:#537394;font-size:10px;line-height:1.4;white-space:nowrap}
.dsg-wardrobe-backdrop{position:fixed;z-index:4;inset:0;display:flex;align-items:center;padding:12px;box-sizing:border-box;background:rgba(35,50,78,.13)}
.dsg-wardrobe{box-sizing:border-box;width:500px;max-width:100%;max-height:calc(100dvh - 24px);overflow-y:auto;padding:22px;border:2px solid #c7d6e9;border-radius:25px;background:#fffaf2;color:#385574;box-shadow:0 16px 60px #203f6e30;font-family:inherit;font-size:14px;line-height:1.5;user-select:none}
.dsg-wardrobe h2{font:25px/1.4 'DSG Greeting Hand','KaiTi',cursive;margin:0 0 6px;color:#42678d}.dsg-wardrobe p{margin:0 0 15px;font-size:12px;color:#6d7b8d}
.dsg-outfits{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.dsg-outfit{display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:7px;min-width:0;padding:10px 6px 9px;border:2px solid #e2e6ec;border-radius:17px;color:#486381;background:#fff;cursor:pointer;font:inherit;line-height:1.5;transition:border-color .12s,background .12s}
.dsg-outfit[aria-pressed='true']{border-color:#81a6d2;background:#edf5ff}.dsg-outfit:hover{border-color:#9ab8d9}.dsg-outfit img{width:100%;max-width:130px;aspect-ratio:1;object-fit:contain;pointer-events:none}.dsg-outfit span{font-size:12px}.dsg-outfit small{min-height:18px;color:#6e86a5;font-size:10px}
.dsg-outfit .dsg-outfit-preview{display:block;position:relative;width:100%;max-width:130px;aspect-ratio:1}.dsg-outfit .dsg-wardrobe-art{max-width:none;aspect-ratio:auto;object-fit:fill}.dsg-outfit .dsg-hat{width:60%;height:auto;max-width:none;aspect-ratio:auto}.dsg-outfit .dsg-loading-art{display:none}
.dsg-wardrobe-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:18px}.dsg-wardrobe-actions button{font:inherit;font-size:13px;border:1px solid #c5d4e5;background:#fff;border-radius:12px;padding:8px 16px;color:#52718e;cursor:pointer}.dsg-wardrobe-actions .dsg-wear{background:#668ebd;color:#fff;border-color:#668ebd}.dsg-wardrobe-actions button:disabled{opacity:.5;cursor:wait}.dsg-wardrobe button:focus-visible{outline:2px dashed #496f9e;outline-offset:3px}.dsg-wardrobe .dsg-wardrobe-status{margin:13px 0 0;min-height:18px}
@media(max-width:420px){.dsg-wardrobe{padding:16px 12px}.dsg-outfits{gap:5px}.dsg-outfit{padding:8px 3px}.dsg-wardrobe h2{font-size:22px}}
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
    function Mascot({running=false,phase='thinking',status,sessionId='',t=key=>DICTIONARIES.zh[key]||key}){
      const [prefs,setPrefs]=React.useState(()=>({...readPrefs(),...viewport(readPrefs())}));
      const [dragging,setDragging]=React.useState(false),[dropping,setDropping]=React.useState(false);
      const [preview,setPreview]=React.useState(null),[menu,setMenu]=React.useState(false);
      const [wardrobe,setWardrobe]=React.useState(null),[outfitReadiness,setOutfitReadiness]=React.useState(null);
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
      const mealStarted=React.useRef(0),previewStarted=React.useRef(0),dropStarted=React.useRef(0),visualTimeline=React.useRef({key:'',startedAt:0});
      prefsRef.current=prefs;
      const feedingRef=React.useRef(false);
      const touchRef=React.useRef(null),touchTaps=React.useRef([]),touchSequence=React.useRef(0);
      const task=taskState(running,phase,status,sleeping,celebrating);
      const eligible=task==='idle'&&!eating&&!touch&&!dragging&&!dropping&&!preview&&prefs.beggingEnabled!==false;
      const greetingReady=task==='idle'&&!eating&&!touch&&!dragging&&!dropping&&!preview&&!menu&&!wardrobe;
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
      React.useEffect(()=>{if(!menu)return;const close=e=>{if(e.type==='keydown'&&e.key!=='Escape')return;if(e.type==='pointerdown'&&root.current?.contains(e.target))return;setMenu(false);};
        window.addEventListener('pointerdown',close);window.addEventListener('keydown',close);return()=>{window.removeEventListener('pointerdown',close);window.removeEventListener('keydown',close);};},[menu]);
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
      function greet(){const plan=greetingFor(new Date());setGreeting({period:plan.period});setMenu(false);setPreview(null);setSleeping(false);writePrefs({...prefsRef.current,greetingSeen:rememberGreeting(prefsRef.current.greetingSeen,plan.key,Date.now())});}
      function stopTouch(){touchRef.current=null;touchTaps.current=[];setTouch(null);}
      function pet(){if(feedingRef.current||touchRef.current?.kind==='pouting')return;const reaction=patReaction(touchTaps.current,Date.now());touchTaps.current=reaction.taps;const next={kind:reaction.state,sequence:++touchSequence.current,startedAt:Date.now()};touchRef.current=next;setTouch(next);setMenu(false);setPreview(null);setSleeping(false);setBegging(false);setDropping(false);}
      function feed(){if(feedingRef.current)return;feedingRef.current=true;mealStarted.current=Date.now();stopTouch();setMenu(false);setPreview(null);setSleeping(false);setBegging(false);setDropping(false);setEating(true);writePrefs({...prefsRef.current,lastFed:Date.now()});}
      function down(e){if(e.button!==0)return;setMenu(false);setPreview(null);setDropping(false);drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,start:{...prefsRef.current},moved:false};e.currentTarget.setPointerCapture(e.pointerId);}
      function move(e){const d=drag.current;if(!d||d.id!==e.pointerId)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(!d.moved&&Math.hypot(dx,dy)<4)return;if(!d.moved){d.moved=true;stopTouch();setDragging(true);}d.position=viewport({...d.start,x:d.start.x+dx,y:d.start.y+dy});
        if(!d.raf)d.raf=requestAnimationFrame(()=>{d.raf=0;if(drag.current!==d||!root.current)return;root.current.style.transform=`translate3d(${d.position.x-d.start.x}px,${d.position.y-d.start.y}px,0)`;});}
      function finish(e,cancel=false){const d=drag.current;if(!d||d.id!==e.pointerId)return;drag.current=null;if(d.raf)cancelAnimationFrame(d.raf);setDragging(false);if(d.moved){const next={...prefsRef.current,...d.position};if(root.current){root.current.style.left=next.x+'px';root.current.style.top=next.y+'px';root.current.style.transform='';}setPrefs(next);writePrefs(next);if(!cancel){dropStarted.current=Date.now();setDropping(true);}}else if(!cancel){const bounds=e.currentTarget.getBoundingClientRect();if(d.y-bounds.top<=bounds.height*.68)pet();else{setMenu(v=>!v);}}}
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
          onContextMenu:e=>{e.preventDefault();setMenu(v=>!v);},onKeyDown:e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setMenu(v=>!v);}}},
          h('span',{className:'dsg-motion','data-motion':state,'data-animate':String(animate)},h(SpriteArt,{key:state+':'+(preview?'preview':eating?'meal':touch?'touch-'+touch.sequence:'task'),state,outfit,animate,hidden,startedAt,loadAttempt:wardrobe?.attempt||0,label:t(state),loadingLabel:t('outfitLoading'),onReady:setOutfitReadiness}),prefs.hat&&h('img',{className:'dsg-hat',src:PROPS.hat,alt:t('hat'),draggable:false})),
          state==='petting'&&h('span',{className:'dsg-affection',key:touch?.sequence||'preview','aria-hidden':true},[0,1,2].map(index=>h('svg',{className:'dsg-heart',key:index,viewBox:'0 0 24 24'},h('path',{d:'M12 20 C4 14 1 10 3 6 C5 2 10 3 12 7 C14 3 19 2 21 6 C23 10 20 14 12 20Z',fill:'currentColor'}))))),
        h('div',{className:'dsg-footer'},h('span',{className:'dsg-label'},(preview?t('preview'):'')+t(state)),
          h('button',{className:'dsg-food',type:'button',onClick:feed,disabled:eating,title:t('feed'),'aria-label':t('feed')},h('img',{src:PROPS.rice,alt:'',draggable:false}))),
        menu&&h('div',{className:'dsg-menu',role:'dialog','aria-label':t('menu'),style:{left:clamp(-42,8-prefs.x,window.innerWidth-prefs.x-260),top:clamp(prefs.y-560,42,Math.max(42,window.innerHeight-616))-prefs.y}},
          h('strong',null,t('menu')),h('div',{className:'dsg-grid'},STATES.map(key=>h('button',{key,type:'button',onClick:()=>{previewStarted.current=Date.now();setPreview(key);setMenu(false);}},t(key)))),
          h('button',{className:'dsg-wide',type:'button',onClick:()=>{setWardrobe({outfit:normalizeOutfit(prefsRef.current.outfit),attempt:0});setMenu(false);}},t('wardrobe')),
          h('button',{className:'dsg-wide',type:'button',disabled:eating,onClick:feed},t('feed')),
          h('button',{className:'dsg-wide',type:'button',disabled:eating||touch?.kind==='pouting',onClick:pet},t('pet')),
          h('button',{className:'dsg-wide',type:'button','aria-pressed':prefs.hat===true,onClick:()=>writePrefs({...prefsRef.current,hat:!prefs.hat})},prefs.hat?t('hatOff'):t('hatOn')),
          h('button',{className:'dsg-wide',type:'button','aria-pressed':prefs.beggingEnabled!==false,onClick:()=>writePrefs({...prefsRef.current,beggingEnabled:prefs.beggingEnabled===false})},prefs.beggingEnabled===false?t('begOn'):t('begOff')),
          h('button',{className:'dsg-wide',type:'button',onClick:greet},t('greetNow')),
          h('button',{className:'dsg-wide',type:'button','aria-pressed':prefs.greetingsEnabled!==false,onClick:()=>{setGreeting(null);writePrefs({...prefsRef.current,greetingsEnabled:prefs.greetingsEnabled===false});}},prefs.greetingsEnabled===false?t('greetingsOn'):t('greetingsOff')),
          h('button',{className:'dsg-wide',type:'button',onClick:()=>{setPreview(null);setMenu(false);}},t('follow')),
          h('button',{className:'dsg-wide',type:'button',onClick:()=>writePrefs({...prefsRef.current,animate:prefs.animate===false})},prefs.animate===false?t('resume'):t('pause')),
          h('button',{className:'dsg-wide',type:'button',onClick:()=>{writePrefs({...prefsRef.current,...viewport({})});setMenu(false);}},t('reset')),
          h('p',{className:'dsg-help'},t('help'))),
        wardrobe&&h('div',{className:'dsg-wardrobe-backdrop',style:{justifyContent:prefs.x+prefs.size/2>window.innerWidth/2?'flex-start':'flex-end'}},h('section',{ref:wardrobeRef,className:'dsg-wardrobe',role:'dialog','aria-modal':true,'aria-labelledby':'dsg-wardrobe-title','aria-describedby':'dsg-wardrobe-hint'},
          h('h2',{id:'dsg-wardrobe-title'},t('wardrobeTitle')),h('p',{id:'dsg-wardrobe-hint'},t('wardrobeHint')),
          h('div',{className:'dsg-outfits'},OUTFITS.map(item=>h('button',{key:item.id,type:'button',className:'dsg-outfit','data-outfit-choice':item.id,'aria-pressed':outfit===item.id,onClick:()=>{if(outfit===item.id&&outfitReadiness?.key===outfitKey&&outfitReadiness.ok===false){setOutfitReadiness(null);setWardrobe({outfit:item.id,attempt:(wardrobe.attempt||0)+1});}else if(outfit!==item.id){setOutfitReadiness(null);setWardrobe({outfit:item.id,attempt:0});}}},outfit===item.id?h('span',{className:'dsg-outfit-preview'},h(SpriteArt,{state,outfit,animate,hidden,startedAt,loadAttempt:wardrobe.attempt||0,label:t(state),artClass:'dsg-wardrobe-art'}),prefs.hat&&h('img',{className:'dsg-hat',src:PROPS.hat,alt:t('hat'),draggable:false})):h('img',{src:assetFor(item.id,'idle').still,alt:'',draggable:false}),h('span',null,t('outfit_'+item.id)),h('small',null,normalizeOutfit(prefs.outfit)===item.id?t('outfitSaved'):outfit===item.id?t('outfitPreview'):' ')))),
          h('p',{className:'dsg-wardrobe-status',role:'status','aria-live':'polite'},outfitReady?' ':outfitReadiness?.key===outfitKey&&outfitReadiness.ok===false?t('outfitError'):t('outfitLoading')),
          h('div',{className:'dsg-wardrobe-actions'},h('button',{type:'button',onClick:()=>setWardrobe(null)},t('cancelOutfit')),h('button',{className:'dsg-wear',type:'button',disabled:!outfitReady,onClick:()=>{writePrefs({...prefsRef.current,outfit});setWardrobe(null);}},t('wear'))))));
    }
    class Boundary extends React.Component{constructor(props){super(props);this.state={failed:false};}static getDerivedStateFromError(){return{failed:true};}componentDidCatch(error){console.error('[DeepSeek Girl]',error);}render(){return this.state.failed?null:this.props.children;}}
    const guarded=Component=>function Entry(props){if(!props)return null;return h(Boundary,null,h(Component,props));};
    return {inject:['slots','sessions','uiConversation','locale'],apply(ctx){
      ctx.effect(()=>ctx.locale.register('@local/dsh-deepseek-girl',DICTIONARIES));
      function SessionGirl(props){
        const running=props.useSession(s=>s?.running===true);
        const status=props.useProjection('deepseekGirlStatus');
        const key=props.useChat(latestAssistantKey);
        const phase=props.useGirlNode(key,assistantPhase);
        React.useEffect(()=>{docks++;notify();return()=>{docks--;notify();};},[]);
        return h(Mascot,{running,status,phase,sessionId:props.sessionId,t:props.t});
      }
      function FloatingGirl(props){const dock=React.useSyncExternalStore(presence.subscribe,presence.snapshot,presence.snapshot);
        return dock?null:h(Mascot,{t:props.t});
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
