import { FINANCE_REMOTE } from './finance-protocol.js';
import { summarizeUsage } from './usage.js';

const TTL_MS = 15000;
function offsetOf(request) {
  const offset = request?.timezoneOffsetSeconds;
  if (!Number.isInteger(offset) || Math.abs(offset) > 14 * 3600 || offset % 60 !== 0) throw new TypeError('Invalid local timezone offset');
  return offset;
}
export function createUsageReader(query, {clock = Date.now} = {}) {
  const cache = new Map(), pending = new Map(); let closed = false;
  async function read(offset, now) {
    if (closed || !query?.listSessions || !query?.readSession) return {status: 'unavailable'};
    try {
      const listed = await query.listSessions();
      if (!Array.isArray(listed)) return {status: 'failed'};
      const ids = [...new Set(listed.map(row => row.header?.id ?? row.session?.id).filter(id => typeof id === 'string' && id.length))];
      if (ids.length !== listed.length) return {status: 'failed'};
      const observations = []; let next = 0, failed = false;
      async function worker() {
        while (!closed && next < ids.length) {
          const id = ids[next++];
          try {
            const value = await query.readSession(id);
            if (!value || !Array.isArray(value.events) || !Number.isSafeInteger(value.inheritedEventCount) || value.inheritedEventCount < 0 || value.inheritedEventCount > value.events.length) {failed = true; continue;}
            observations.push({header: value.header ?? value.session, inheritedEventCount: value.inheritedEventCount, events: value.events});
          } catch { failed = true; }
        }
      }
      await Promise.all([worker(), worker()]);
      if (closed) return {status: 'unavailable'};
      // Never present an incomplete scan as a precise zero or complete daily total.
      if (failed) return {status: 'failed'};
      return summarizeUsage(observations, {now, timezoneOffsetSeconds: offset});
    } catch { return {status: 'failed'}; }
  }
  return {
    async summary(request) {
      const offset = offsetOf(request), now = clock();
      const day = new Date(now + offset * 1000).toISOString().slice(0, 10), key = day + ':' + offset;
      if (closed) return {status: 'unavailable'};
      const saved = cache.get(key);
      if (saved && now - saved.at >= 0 && now - saved.at < TTL_MS) return saved.value;
      if (pending.has(key)) return pending.get(key);
      if (pending.size >= 4) return {status: 'failed'};
      const promise = read(offset, now).then(value => {
        if (!closed && value.status === 'ready') {
          cache.delete(key); cache.set(key, {at: now, value});
          while (cache.size > 4) cache.delete(cache.keys().next().value);
        }
        return value;
      }).finally(() => pending.delete(key));
      pending.set(key, promise); return promise;
    },
    dispose() {closed = true; cache.clear();},
  };
}
export function installFinanceHost(ctx) {
  if (typeof ctx.inject !== 'function') return;
  ctx.inject(['typert'], scope => {
    // ctx.provide and explicit Typert contributions are public Cordis/registry APIs.
    // A plain service avoids requiring private app paths or shipping another Cordis copy.
    let reader = createUsageReader(null);
    scope.inject(['sessionQuery'], source => {
      const current = createUsageReader(source.sessionQuery); reader = current;
      source.effect(() => () => {current.dispose(); if (reader === current) reader = createUsageReader(null);});
    });
    const service = {ctx: scope, summary(request) {return reader.summary(request);}};
    service.typertRemote = Object.freeze({service, serviceKey: 'deepseekGirlFinance', namespace: 'deepseekGirlFinance'});
    scope.provide('deepseekGirlFinance', service);
    scope.typert.register({package: FINANCE_REMOTE.package, invocations: FINANCE_REMOTE.descriptors, face: 'host', schemas: [], model: {services: [], events: [], objects: []}});
    scope.effect(() => () => reader.dispose());
  });
}
