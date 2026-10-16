// Provider-reported local Harness usage, never inferred from message length or balance changes.
const PRICING_URL = 'https://api-docs.deepseek.com/zh-cn/quick_start/pricing/';
const OFFICIAL_PROVIDERS = new Set(['deepseek-account', 'deepseek-official']);
const FLASH_MODELS = new Set(['deepseek-flash', 'deepseek-v4-flash', 'deepseek-v4-flash-vision-exp']);
const AUXILIARY_REQUESTS = new Set(['session/title-llm-request', 'web/deepseek-search-llm-request']);
const isCount = value => Number.isSafeInteger(value) && value >= 0;
const safeSum = values => { const sum = values.reduce((a, b) => a + b, 0); return isCount(sum) ? sum : null; };
const routeFrom = value => value && typeof value.provider === 'string' && typeof value.model === 'string'
  ? { provider: value.provider, model: value.model } : undefined;

function finalStreamUsage(stream) {
  if (!Array.isArray(stream)) return undefined;
  for (let i = stream.length - 1; i >= 0; i--) {
    const record = stream[i];
    if (record?.type === 'chunk' && record.chunk?.type === 'usage') return { usage: record.chunk.usage, time: record.time };
  }
}

function normalizeUsage(value) {
  if (!value || !isCount(value.inputTokens) || !isCount(value.outputTokens)) return null;
  for (const key of ['cacheReadTokens', 'cacheWriteTokens', 'reasoningTokens', 'totalTokens']) {
    if (value[key] !== undefined && !isCount(value[key])) return null;
  }
  if (value.reasoningTokens !== undefined && value.reasoningTokens > value.outputTokens) return null;
  const knownPrompt = safeSum([value.inputTokens, value.cacheReadTokens ?? 0, value.cacheWriteTokens ?? 0]);
  if (knownPrompt === null) return null;
  const completeBuckets = value.cacheReadTokens !== undefined && value.cacheWriteTokens !== undefined;
  let total = value.totalTokens ?? (completeBuckets ? safeSum([knownPrompt, value.outputTokens]) : null);
  if (total !== null) {
    const prompt = total - value.outputTokens;
    if (!isCount(prompt) || prompt < knownPrompt || (completeBuckets && prompt !== knownPrompt)) return null;
  }
  return { input: value.inputTokens, output: value.outputTokens,
    cacheRead: value.cacheReadTokens ?? null, cacheWrite: value.cacheWriteTokens ?? null, total };
}

function estimateAttempt(tokens, route) {
  if (!route || !OFFICIAL_PROVIDERS.has(route.provider)) return null;
  const rates = FLASH_MODELS.has(route.model) ? [.02, 1, 4]
    : route.model === 'deepseek-v4-pro' ? [.15, 4.5, 13.5] : null;
  // A nonzero cache-write bucket has no verified rate in the official tariff.
  // With exact total = uncached input + output + cache read + cache write, an
  // omitted write bucket can be proven zero for pricing when all other terms
  // exhaust total. The public optional cacheWrite field still stays null.
  const zeroWrite = tokens.cacheWrite === 0 || (tokens.cacheWrite === null && tokens.cacheRead !== null
    && tokens.total !== null && tokens.total === tokens.input + tokens.output + tokens.cacheRead);
  if (!rates || tokens.cacheRead === null || !zeroWrite) return null;
  const min = (tokens.cacheRead * rates[0] + tokens.input * rates[1] + tokens.output * rates[2]) / 1e6;
  return Number.isFinite(min) ? { min, max: min * 2 } : null;
}

/**
 * Sum one local calendar day's owned durable model requests across sessions.
 * The four prompt/output buckets follow native TokenUsage: input is uncached.
 * Optional missing buckets stay null. Missing/invalid usage is disclosed through
 * missingUsage; no request text, token estimates, or balance deltas are used.
 * Auxiliary title/search request records expose missing provider usage. Retries
 * add a new attempt at llm/retry-started; final samples replace earlier
 * samples in the same attempt. Inherited fork records provide route context only.
 */
export function summarizeUsage(observations, { now = Date.now(), timezoneOffsetSeconds } = {}) {
  if (!isCount(now)) throw new TypeError('now must be an epoch millisecond timestamp');
  const offset = timezoneOffsetSeconds ?? -new Date(now).getTimezoneOffset() * 60;
  if (!Number.isFinite(offset) || Math.abs(offset) > 86400) throw new TypeError('Invalid timezone offset');
  const shifted = new Date(now + offset * 1000);
  const day = shifted.toISOString().slice(0, 10);
  const start = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - offset * 1000;
  const end = start + 86400000;
  const sessions = new Map();
  for (const observation of observations ?? []) {
    if (!observation || !Array.isArray(observation.events)) continue;
    const id = observation.header?.id ?? observation.session?.id;
    if (typeof id !== 'string' || !id) continue;
    const previous = sessions.get(id);
    if (!previous || previous.events.length < observation.events.length) sessions.set(id, observation);
  }
  const samples = [];
  for (const observation of sessions.values()) {
    const header = observation.header ?? observation.session;
    const cut = observation.inheritedEventCount ?? (header?.isSeeded ? NaN : 0);
    if (!isCount(cut) || cut > observation.events.length) continue;
    let route;
    const generations = new Map(), attempts = new Map();
    for (let index = 0; index < observation.events.length; index++) {
      const event = observation.events[index], data = event?.data ?? {};
      if (event?.type === 'request/header') route = routeFrom(data.header?.config);
      else if (event?.type === 'request/context') route = routeFrom(data) ?? route;
      const coordinates = `${data.turn}:${data.step}`;
      if (event?.type === 'llm/retry-started') generations.set(coordinates, (generations.get(coordinates) ?? 0) + 1);
      // These native request records prove an auxiliary model request occurred,
      // but Harness does not persist its returned usage. Disclose the gap.
      if (index >= cut && AUXILIARY_REQUESTS.has(event?.type)) {
        if (isCount(event.time) && event.time >= start && event.time < end) samples.push({ time: event.time });
        continue;
      }
      if (index < cut || !['assistant/message', 'assistant/attempt'].includes(event?.type)) continue;
      const key = `${coordinates}:${generations.get(coordinates) ?? 0}`;
      const embedded = finalStreamUsage(data.stream);
      const usage = data.usage !== undefined ? data.usage : embedded?.usage;
      const previous = attempts.get(key);
      const time = isCount(embedded?.time) ? embedded.time : event.time;
      attempts.set(key, { usage: usage === undefined ? previous?.usage : usage,
        time: usage === undefined && previous ? previous.time : time,
        route: routeFrom(data.message?.source) ?? route ?? previous?.route });
    }
    for (const attempt of attempts.values()) if (isCount(attempt.time) && attempt.time >= start && attempt.time < end) samples.push(attempt);
  }
  const valid = [], prices = [];
  let missingUsage = 0;
  for (const sample of samples) {
    const tokens = normalizeUsage(sample.usage);
    if (!tokens) { missingUsage++; continue; }
    valid.push(tokens);
    const price = estimateAttempt(tokens, sample.route);
    if (price) prices.push(price);
  }
  const tokens = {};
  for (const key of ['input', 'output', 'cacheRead', 'cacheWrite', 'total']) {
    tokens[key] = samples.length > 0 && valid.length === 0 ? null
      : valid.some(sample => sample[key] === null) ? null : safeSum(valid.map(sample => sample[key]));
  }
  return { status: 'ready', day, scope: 'harness-local', tokens, requests: samples.length, missingUsage,
    estimate: { currency: 'CNY', min: samples.length > 0 && prices.length === 0 ? null : prices.reduce((sum, p) => sum + p.min, 0),
      max: samples.length > 0 && prices.length === 0 ? null : prices.reduce((sum, p) => sum + p.max, 0),
      pricedRequests: prices.length, unpricedRequests: samples.length - prices.length,
      sourceUrl: PRICING_URL, asOf: '2026-10-16' }, updatedAt: now };
}
