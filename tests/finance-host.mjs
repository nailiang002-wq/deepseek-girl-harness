import assert from 'node:assert/strict';
import {createUsageReader, installFinanceHost} from '../finance-host.js';
const request = {timezoneOffsetSeconds: 28800};
let now = Date.UTC(2026, 9, 15, 15, 59, 59), lists = 0, reads = 0;
const query = {
  async listSessions() {lists++; return [{header: {id: 'first'}}, {header: {id: 'second'}}];},
  async readSession(id) {reads++; return {session: {id}, inheritedEventCount: 0, events: []};},
};
const reader = createUsageReader(query, {clock: () => now});
const results = await Promise.all([reader.summary(request), reader.summary(request)]);
assert.equal(results[0].status, 'ready'); assert.equal(results[0].day, '2026-10-15');
assert.deepEqual(results[0], results[1]); assert.equal(lists, 1); assert.equal(reads, 2);
await reader.summary(request); assert.equal(lists, 1);
now += 2000; const tomorrow = await reader.summary(request); assert.equal(tomorrow.day, '2026-10-16'); assert.equal(lists, 2);
now += 16000; await reader.summary(request); assert.equal(lists, 3);
for (const offset of [NaN, Infinity, 50401, 1, '28800', null]) await assert.rejects(reader.summary({timezoneOffsetSeconds: offset}), /timezone/);
reader.dispose(); assert.deepEqual(await reader.summary(request), {status: 'unavailable'});
assert.deepEqual(await createUsageReader(null).summary(request), {status: 'unavailable'});
const failed = createUsageReader({...query, readSession: async () => {throw new Error('private internal text must not escape');}});
assert.deepEqual(await failed.summary(request), {status: 'failed'});
const corrupted = createUsageReader({...query, readSession: async () => ({session: {id: 'a'}, inheritedEventCount: 3, events: []})});
assert.deepEqual(await corrupted.summary(request), {status: 'failed'});
const duplicate = createUsageReader({...query, listSessions: async () => [{header:{id:'a'}},{header:{id:'a'}}]});
assert.deepEqual(await duplicate.summary(request), {status: 'failed'});
let provided, contribution; const cleanups = [];
const scope = {
  sessionQuery: query,
  inject(keys, callback) {assert.deepEqual(keys, ['sessionQuery']); callback(this);},
  provide(key, service) {assert.equal(key, 'deepseekGirlFinance'); provided = service;},
  typert: {register(value) {contribution = value;}},
  effect(callback) {cleanups.push(callback());},
};
installFinanceHost({inject(keys, callback) {assert.deepEqual(keys, ['typert']); callback(scope);}});
assert.equal(provided.typertRemote.service, provided); assert.equal(provided.typertRemote.namespace, 'deepseekGirlFinance');
assert.equal(contribution.face, 'host'); assert.equal(contribution.invocations.length, 1);
assert.equal(contribution.invocations[0].method, 'summary');
assert.equal((await provided.summary(request)).status, 'ready');
for (const cleanup of cleanups.reverse()) if (typeof cleanup === 'function') cleanup();
assert.equal((await provided.summary(request)).status, 'unavailable');
installFinanceHost({});
console.log(JSON.stringify({passed:true,parallelDedup:true,boundedCache:true,midnightRollover:true,timezoneValidation:true,corruptReadNeverZero:true,sanitizedFailures:true,readOnlyRemote:true,cleanup:true}));
