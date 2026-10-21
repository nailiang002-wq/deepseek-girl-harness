const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
function createHarness(storage=new Map(),start=new Date(2026,9,10,10,59,50).getTime()) {
  let now=start,hook=0,hooks=[],pending=[],dirty=false,tree,running=false,loaded,dictionaries,props;
  let nextTimer=1,timers=new Map(),registrations=new Map();
  const winEvents=new Map(),docEvents=new Map();
  const listen=(map,key,fn)=>{if(!map.has(key))map.set(key,new Set());map.get(key).add(fn);};
  const unlisten=(map,key,fn)=>{map.get(key)?.delete(fn);if(!map.get(key)?.size)map.delete(key);};
  const emit=(map,event)=>[...(map.get(event.type)||[])].forEach(fn=>fn(event));
  class ClockDate extends Date {constructor(...args){super(...(args.length?args:[now]));}static now(){return now;}}
  class Component {constructor(props){this.props=props;this.state={};}}
  const React={Component,createElement:(type,props,...children)=>({type,props:{...props,children:children.length===1?children[0]:children}}),
    useState(initial){const index=hook++;if(!hooks[index])hooks[index]={value:typeof initial==='function'?initial():initial};return[hooks[index].value,value=>{const next=typeof value==='function'?value(hooks[index].value):value;if(!Object.is(next,hooks[index].value)){hooks[index].value=next;dirty=true;}}];},
    useRef(initial){const index=hook++;return hooks[index]||(hooks[index]={current:initial});},
    useEffect(create,deps){const index=hook++,old=hooks[index];if(!old||!deps||deps.some((value,i)=>!Object.is(value,old.deps?.[i]))||deps.length!==old.deps?.length){pending.push(()=>{old?.cleanup?.();hooks[index]={deps,cleanup:create()};});}},
    useSyncExternalStore(_subscribe,get){return get();}};
  const window={innerWidth:1280,innerHeight:800,__ModuleLoader__:{load:module=>loaded=module},matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}}),addEventListener:(key,fn)=>listen(winEvents,key,fn),removeEventListener:(key,fn)=>unlisten(winEvents,key,fn),dispatchEvent:event=>emit(winEvents,event)};
  const document={hidden:false,createElement:()=>({remove(){}}),head:{appendChild(){}},addEventListener:(key,fn)=>listen(docEvents,key,fn),removeEventListener:(key,fn)=>unlisten(docEvents,key,fn)};
  vm.runInNewContext(fs.readFileSync('client.js','utf8'),{window,document,Date:ClockDate,localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},console,Event:class{constructor(type){this.type=type;}},setTimeout:(fn,delay)=>{const id=nextTimer++;timers.set(id,{fn,at:now+delay});return id;},clearTimeout:id=>timers.delete(id)});
  loaded.factory(()=>React).apply({effect:create=>create(),locale:{register:(_id,value)=>{dictionaries=value;return()=>{};}},slots:{inject:(_name,create)=>create(),register:(opts,component)=>registrations.set(opts.name,component)}});
  props={sessionId:'greeting-test',t:key=>dictionaries.zh[key]||key,useSession:select=>select({running}),useProjection:()=>({outcome:'working',endSeq:1}),useChat:()=>'',useGirlNode:()=> 'thinking'};
  const component=registrations.get('conversation.composer.dock');
  function render(node){if(!node||typeof node!=='object')return node;if(Array.isArray(node))return node.map(render);if(typeof node.type==='function')return render(node.type.prototype?.render?new node.type(node.props).render():node.type(node.props));return{...node,props:{...node.props,children:render(node.props.children)}};}
  function flush(){let cycles=0;do{if(++cycles>100)throw Error('Render loop');dirty=false;hook=0;pending=[];tree=render(component(props));for(const effect of pending)effect();}while(dirty);return tree;}
  function walk(predicate,node){if(!node||typeof node!=='object')return;if(Array.isArray(node)){for(const child of node){const match=walk(predicate,child);if(match)return match;}return;}return predicate(node)?node:walk(predicate,node.props.children);}
  function find(predicate){return walk(predicate,tree);}
  function tick(duration){const target=now+duration;let cycles=0;while(true){const next=[...timers.entries()].sort((a,b)=>a[1].at-b[1].at)[0];if(!next||next[1].at>target)break;if(++cycles>1000)throw Error('Timer loop');now=next[1].at;timers.delete(next[0]);next[1].fn();flush();}now=target;flush();}
  function prefs(){return JSON.parse(storage.get('deepseek-girl.preferences.v1')||'{}');}
  function change(value){storage.set('deepseek-girl.preferences.v1',JSON.stringify({...prefs(),...value}));window.dispatchEvent({type:'deepseek-girl-preferences'});flush();}
  flush();return{storage,find,tick,prefs,change,setRunning(value){running=value;flush();},wake(){emit(winEvents,{type:'pointerdown'});flush();},hidden(value){document.hidden=value;emit(docEvents,{type:'visibilitychange'});flush();},unmount(){for(const item of hooks)item?.cleanup?.();assert.equal(timers.size,0);assert.equal(winEvents.size,0);assert.equal(docEvents.size,0);}};
}
const bubble=h=>h.find(node=>node.props?.className==='dsg-greeting');
let h=createHarness();h.tick(799);assert.equal(bubble(h),undefined);h.tick(1);assert.match(bubble(h).props.children[0].props.children,/早上好/);assert.ok(h.prefs().greetingSeen['2026-10-10:morning']);
h.tick(9200);h.tick(800);assert.match(bubble(h).props.children[0].props.children,/中午好/);h.tick(10000);assert.equal(bubble(h),undefined);const storage=h.storage;h.unmount();
h=createHarness(storage,new Date(2026,9,10,11,10).getTime());h.tick(2000);assert.equal(bubble(h),undefined);h.unmount();
h=createHarness(new Map(),new Date(2026,9,10,23).getTime());h.setRunning(true);h.tick(2000);assert.equal(bubble(h),undefined);h.setRunning(false);h.tick(800);assert.match(bubble(h).props.children[0].props.children,/熬夜.*注意身体/);const night=h.storage;h.unmount();
h=createHarness(night,new Date(2026,9,11,1).getTime());h.tick(2000);assert.equal(bubble(h),undefined);h.unmount();
h=createHarness(new Map(),new Date(2026,9,10,18).getTime());h.hidden(true);h.tick(2000);assert.equal(bubble(h),undefined);assert.equal(h.prefs().greetingSeen,undefined);h.hidden(false);h.tick(800);assert.match(bubble(h).props.children[0].props.children,/晚上好/);h.find(n=>n.props?.['aria-label']==='关闭问候气泡').props.onClick();h.tick(0);assert.equal(bubble(h),undefined);
h.change({greetingsEnabled:false});h.wake();h.tick(800);assert.equal(bubble(h),undefined);h.unmount();
h=createHarness(new Map([['deepseek-girl.preferences.v1',JSON.stringify({greetingsEnabled:false,hat:true})]]),new Date(2026,9,10,14).getTime());h.tick(1000);assert.equal(bubble(h),undefined);h.find(n=>n.props?.className==='dsg-character').props.onKeyDown({key:'Enter',preventDefault(){}});h.tick(0);h.find(n=>n.type==='button'&&n.props['aria-label']==='和我打个招呼').props.onClick();h.tick(0);assert.match(bubble(h).props.children[0].props.children,/下午好/);assert.equal(h.prefs().hat,true);h.tick(9000);h.find(n=>n.props?.className==='dsg-character').props.onKeyDown({key:'Enter',preventDefault(){}});h.tick(0);h.find(n=>n.type==='button'&&n.props['aria-label']==='和我打个招呼').props.onClick();h.tick(0);h.tick(1100);assert.ok(bubble(h));h.tick(8900);assert.equal(bubble(h),undefined);h.unmount();
console.log(JSON.stringify({passed:true,checks:['automatic greeting and dismissal','clock transition to noon','persisted deduplication after remount','busy task deferral','one late-night greeting across midnight','hidden window deferral','dismiss button','disabled automatic greetings','manual greeting preserves hat','complete timer and listener cleanup']}));
