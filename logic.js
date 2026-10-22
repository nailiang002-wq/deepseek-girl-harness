export const STORAGE_KEY = 'deepseek-girl.preferences.v1';
export const DEFAULT_SIZE = 144;
export const MIN_SIZE = 64;
export const MAX_SIZE = 320;
export function normalizeOutfit(value) { return ['hoodie','pajamas','winter-puffer','winter-cape'].includes(value) ? value : 'maid'; }
export function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
export function geometry(value, width, height) {
  const w = Number.isFinite(width) && width > 0 ? width : 1280;
  const h = Number.isFinite(height) && height > 0 ? height : 800;
  const size = clamp(Number.isFinite(value?.size) ? value.size : DEFAULT_SIZE, Math.min(MIN_SIZE, w, h), Math.min(MAX_SIZE, w, h));
  return { size, x: clamp(Number.isFinite(value?.x) ? value.x : w - size - 28, 0, Math.max(0, w - size)),
    y: clamp(Number.isFinite(value?.y) ? value.y : h - size - 156, 0, Math.max(0, h - size - 32)) };
}
export function greetingGeometry(value, width, height, measuredHeight = 128, bounds = null) {
  const w = Number.isFinite(width) && width > 0 ? width : 1280;
  const h = Number.isFinite(height) && height > 0 ? height : 800;
  const margin = Math.min(12, w / 4, h / 4), gap = 15;
  const anchor = bounds ? {x:bounds.x,y:bounds.y,size:bounds.height,width:bounds.width} : geometry(value, w, h), bubbleWidth = Math.min(288, w - margin * 2);
  const maxHeight = Math.max(1, h - margin * 2);
  const bubbleHeight = clamp(Number.isFinite(measuredHeight) ? measuredHeight : 128, 1, maxHeight);
  const center = anchor.x + (anchor.width ?? anchor.size) / 2;
  const left = clamp(center - bubbleWidth / 2, margin, w - bubbleWidth - margin);
  const above = anchor.y - gap - margin, below = h - anchor.y - anchor.size - 32 - gap - margin;
  const side = above >= bubbleHeight || above >= below ? 'above' : 'below';
  const top = clamp(side === 'above' ? anchor.y - bubbleHeight - gap : anchor.y + anchor.size + 32 + gap, margin, h - bubbleHeight - margin);
  const tailMargin = Math.min(28, bubbleWidth / 2);
  return { width: bubbleWidth, maxHeight, left, top, side, tailX: clamp(center - left, tailMargin, bubbleWidth - tailMargin) };
}
export function latestAssistantKey(snapshot) {
  const order = snapshot?.order;
  if (!Array.isArray(order) || !snapshot?.nodes?.get) return '';
  for (let i = order.length - 1; i >= 0; i--) {
    const node = snapshot.nodes.get(order[i]);
    if (node?.kind === 'assistant-step') return order[i];
  }
  return '';
}
export function assistantPhase(node) {
  const data = node?.data;
  if (!data || data.status !== 'running') return 'thinking';
  return Array.isArray(data.blocks) && data.blocks.some(b => b.kind === 'text' && typeof b.text === 'string' && b.text.trim()) ? 'generating' : 'thinking';
}
export function taskState(running, phase, status, sleeping, celebrating) {
  if (running) return phase === 'generating' ? 'generating' : 'thinking';
  if (status?.outcome === 'error') return 'error';
  if (celebrating) return 'success';
  return sleeping ? 'sleeping' : 'idle';
}
export const FEED_QUIET_MS = 120000;
export function lastFedAt(value, now) {
  return Number.isFinite(value) && value > 0 && value <= now ? value : 0;
}
export function canBeg(task, preferences, now) {
  return task === 'idle' && preferences?.beggingEnabled !== false &&
    now - lastFedAt(preferences?.lastFed, now) >= FEED_QUIET_MS;
}
export function visualState(task, dragging, dropping, preview, eating = false, begging = false, reaction = null) {
  return dragging ? 'dragging' : dropping ? 'drop' : preview || (eating ? 'eating' : reaction || (begging && task === 'idle' ? 'begging' : task));
}
export function patReaction(previous, now) {
  const taps=(Array.isArray(previous)?previous:[]).filter(time=>Number.isFinite(time)&&time>=0&&time<=now&&now-time<=2400).slice(-2).concat(now);
  return taps.length===3?{state:'pouting',taps:[]}:{state:'petting',taps};
}
export function greetingFor(date) {
  const hour = date.getHours();
  const period = hour < 5 || hour >= 23 ? 'late' : hour < 11 ? 'morning' : hour < 14 ? 'noon' : hour < 18 ? 'afternoon' : 'evening';
  const day = new Date(date.getTime());
  // Midnight belongs to the same late-night reminder as the previous evening.
  if (hour < 5) day.setDate(day.getDate() - 1);
  const stamp = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`;
  const next = new Date(date.getTime());
  if (hour >= 23) { next.setDate(next.getDate()+1); next.setHours(5,0,0,0); }
  else next.setHours(hour < 5 ? 5 : hour < 11 ? 11 : hour < 14 ? 14 : hour < 18 ? 18 : 23,0,0,0);
  return { period, key: `${stamp}:${period}`, nextAt: next.getTime() };
}
export function greetingDue(plan, preferences, now) {
  if (preferences?.greetingsEnabled === false) return false;
  const seen = preferences?.greetingSeen?.[plan.key];
  return !(Number.isFinite(seen) && seen > 0 && seen <= now);
}
export function rememberGreeting(previous, key, now) {
  const entries = Object.entries(previous && typeof previous === 'object' ? previous : {})
    .filter(([id, value]) => /^\d{4}-\d{2}-\d{2}:(morning|noon|afternoon|evening|late)$/.test(id) && Number.isFinite(value) && value > 0 && value <= now)
    .filter(([id]) => id !== key).sort((a,b) => b[1]-a[1]).slice(0,19);
  return Object.fromEntries([[key,now],...entries]);
}
