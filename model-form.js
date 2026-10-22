// Read-only model selection: this module never changes a Harness model or sends a prompt.
export const MORPH_DURATION=2200;
export const MODEL_SETTLE_MS=450;
export function modelForm(snapshot,projection){
 let selection;
 if(snapshot&&typeof snapshot==='object'&&'current' in snapshot){
  if(snapshot.status!=='ready')return null;
  selection=snapshot.current;
 }else selection=projection?.next??projection?.lastUsed;
 if(!selection||typeof selection.model!=='string'||!selection.model.trim())return null;
 const id=selection.model.trim().toLowerCase();
 return /^deepseek-(?:v\d+(?:\.\d+)?-)?pro(?:-\d{4,8})?$/.test(id)?'pro':'flash';
}
export function formGeometry(value,width,height,form='flash'){
 const finite=(n,fallback)=>Number.isFinite(n)?n:fallback;
 const w=Math.max(1,finite(width,1280)),h=Math.max(1,finite(height,800));
 const size=Math.max(1,finite(value?.size,144)),x=finite(value?.x,0),y=finite(value?.y,0);
 if(form!=='pro')return{x,y,width:size,height:size};
 const artHeight=Math.max(1,Math.min(size*1.65,h-32,w*1.5));
 const artWidth=artHeight*2/3;
 return{x:Math.max(0,Math.min(w-artWidth,x+size/2-artWidth/2)),y:Math.max(0,Math.min(h-artHeight-32,y+size-artHeight)),width:artWidth,height:artHeight};
}
export function isHeadTap(x,y,form='flash'){
 return form==='pro'?x>=.28&&x<=.73&&y>=0&&y<=.24:y<=.68;
}
