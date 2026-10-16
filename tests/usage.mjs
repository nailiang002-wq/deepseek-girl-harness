import assert from 'node:assert/strict';
import { summarizeUsage } from '../usage.js';
const now = Date.parse('2026-10-16T06:00:00Z'), time = now - 1000;
const usage = (input = 100, output = 20, cacheRead = 50, cacheWrite = 0) => ({ inputTokens: input, outputTokens: output, cacheReadTokens: cacheRead, cacheWriteTokens: cacheWrite, totalTokens: input + output + cacheRead + cacheWrite });
const header = (provider = 'deepseek-account', model = 'deepseek-flash') => ({ type: 'request/header', time, data: { header: { config: { provider, model } } } });
const record = (sample = usage(), at = time, step = 0, type = 'assistant/message') => ({ type, time: at, data: { turn: 0, step, ...(sample === undefined ? {} : { usage: sample }), stream: [] } });
const observation = (id, events, inheritedEventCount = 0) => ({ header: { id }, events, inheritedEventCount });
const sum = observations => summarizeUsage(observations, { now, timezoneOffsetSeconds: 28800 });

const basic = sum([observation('a', [header(), record()])]);
assert.equal(basic.day, '2026-10-16');
assert.deepEqual(basic.tokens, { input: 100, output: 20, cacheRead: 50, cacheWrite: 0, total: 170 });
assert.equal(basic.requests, 1); assert.equal(basic.missingUsage, 0);
assert.equal(basic.estimate.min, (100 + 80 + 1) / 1e6); assert.equal(basic.estimate.max, basic.estimate.min * 2);

// Midnight uses the user's local calendar and usage timestamp rather than session creation.
const midnight = sum([observation('midnight', [header(), record(usage(1, 1, 0), Date.parse('2026-10-15T15:59:59.999Z'), 0), record(usage(2, 2, 0), Date.parse('2026-10-15T16:00:00Z'), 1), record(usage(3, 3, 0), Date.parse('2026-10-16T16:00:00Z'), 2)])]);
assert.equal(midnight.requests, 1); assert.equal(midnight.tokens.input, 2);

// Each native compact stream sample is cumulative; only its final sample counts.
const attempted = { type: 'assistant/attempt', time, data: { turn: 0, step: 0, stream: [
  { type: 'chunk', time: time - 1, chunk: { type: 'usage', usage: usage(4, 1, 0) } },
  { type: 'chunk', time, chunk: { type: 'usage', usage: usage(5, 2, 0) } }
] } };
const retries = sum([observation('retry', [header(), attempted, { type: 'llm/retry-started', time, data: { turn: 0, step: 0 } }, record(usage(6, 3, 0)), record(usage(7, 4, 0))])]);
assert.equal(retries.requests, 2); assert.equal(retries.tokens.input, 12); assert.equal(retries.tokens.output, 6);

// A final message's explicit usage replaces its embedded stream sample.
const final = record(usage(9, 2, 0)); final.data.stream = attempted.data.stream;
assert.equal(sum([observation('final', [header(), final])]).tokens.input, 9);

// Fork inherited history is context only; parent and child owned suffix each count once.
const shared = [header(), record(usage(10, 1, 0))];
const forks = sum([observation('parent', shared), observation('child', [...shared, record(usage(20, 2, 0), time, 1)], shared.length)]);
assert.equal(forks.requests, 2); assert.equal(forks.tokens.input, 30);
assert.equal(sum([observation('parent', shared), observation('parent', [...shared])]).requests, 1);

// Third-party and unrecognized model routes retain tokens but have no invented price.
for (const route of [header('openai-compatible'), header('deepseek-account', 'unknown'), header('third-party', 'deepseek-flash')]) {
  const unknown = sum([observation('unknown', [route, record()])]);
  assert.equal(unknown.tokens.total, 170); assert.equal(unknown.estimate.min, null); assert.equal(unknown.estimate.pricedRequests, 0); assert.equal(unknown.estimate.unpricedRequests, 1);
}
const routeOverride = record(); routeOverride.data.message = { source: { provider: 'third-party', model: 'deepseek-flash' } };
assert.equal(sum([observation('route', [header(), routeOverride])]).estimate.min, null);
const mixed = sum([observation('one', [header(), record()]), observation('two', [header('other'), record()])]);
assert.equal(mixed.tokens.input, 200); assert.equal(mixed.estimate.pricedRequests, 1); assert.equal(mixed.estimate.unpricedRequests, 1);
assert.ok(sum([observation('pro', [header('deepseek-official', 'deepseek-v4-pro'), record()])]).estimate.min > basic.estimate.min);

// Negative, fractional, unsafe, inconsistent totals and absent usage are not zeroed.
for (const invalid of [null, { ...usage(), inputTokens: -1 }, { ...usage(), outputTokens: .5 }, { ...usage(), totalTokens: 2 }, { ...usage(), cacheReadTokens: Number.MAX_SAFE_INTEGER + 1 }]) {
  const result = sum([observation('invalid', [header(), record(invalid)])]);
  assert.equal(result.missingUsage, 1); assert.equal(result.tokens.total, null); assert.equal(result.tokens.input, null); assert.equal(result.estimate.min, null);
}
const absent = record(null); delete absent.data.usage;
assert.equal(sum([observation('absent', [header(), absent])]).missingUsage, 1);
const partial = sum([observation('partial', [header(), record({ inputTokens: 10, outputTokens: 3, totalTokens: 20 })])]);
assert.equal(partial.tokens.total, 20); assert.equal(partial.tokens.cacheRead, null); assert.equal(partial.tokens.cacheWrite, null); assert.equal(partial.estimate.min, null);
const write = sum([observation('write', [header(), record(usage(10, 3, 4, 5))])]);
assert.equal(write.tokens.total, 22); assert.equal(write.tokens.cacheWrite, 5); assert.equal(write.estimate.min, null);
const derived = usage(); delete derived.totalTokens;
assert.equal(sum([observation('derived', [header(), record(derived)])]).tokens.total, 170);
// An omitted cache-write bucket is only zero-priced when exact totals prove it.
const inferredWrite = usage(); delete inferredWrite.cacheWriteTokens;
const inferred = sum([observation('inferred-write', [header(), record(inferredWrite)])]);
assert.equal(inferred.tokens.cacheWrite, null); assert.equal(inferred.estimate.min, basic.estimate.min);
const unknownWrite = { ...inferredWrite, totalTokens: 175 };
assert.equal(sum([observation('unknown-write', [header(), record(unknownWrite)])]).estimate.min, null);
// Auxiliary title/search requests have no durable usage: disclose, never guess.
const title = { type: 'session/title-llm-request', time, data: { route: { provider: 'deepseek-account', model: 'deepseek-flash' } } };
const search = { type: 'web/deepseek-search-llm-request', time, data: {} };
const auxiliary = sum([observation('aux-parent', [header(), title, record()]), observation('aux-child', [header(), title, record(), search], 3)]);
assert.equal(auxiliary.requests, 3); assert.equal(auxiliary.missingUsage, 2);
assert.equal(auxiliary.tokens.input, 100); assert.equal(auxiliary.estimate.pricedRequests, 1); assert.equal(auxiliary.estimate.unpricedRequests, 2);
const auxiliaryOnly = sum([observation('aux-only', [title, search])]);
assert.equal(auxiliaryOnly.missingUsage, 2); assert.equal(auxiliaryOnly.tokens.total, null); assert.equal(auxiliaryOnly.estimate.min, null);
const yesterdayTitle = { ...title, time: Date.parse('2026-10-15T15:59:59Z') };
assert.equal(sum([observation('aux-yesterday', [yesterdayTitle])]).requests, 0);
assert.equal(sum([]).estimate.min, 0); assert.equal(sum([]).tokens.total, 0);
assert.equal(sum([{ session: { id: 'raw-query-result' }, inheritedEventCount: 0, events: [header(), record()] }]).requests, 1);
assert.throws(() => summarizeUsage([], { now: -1 }), TypeError);
console.log('Daily usage: local midnight, native compact streams, retry replacement, fork dedup, routes, missing usage, exact cache buckets and estimated tariff coverage passed.');
