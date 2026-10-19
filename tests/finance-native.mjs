// Opt-in integration with the real Harness runtime. Uses synthetic records only;
// never boots a profile, opens a network connection, or reads account/session files.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {installFinanceHost} from '../finance-host.js';

const modules = process.env.DSG_HARNESS_NODE_MODULES;
if (!modules) throw new Error('Set DSG_HARNESS_NODE_MODULES to the Harness runtime node_modules directory. This test uses synthetic data only.');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runtime = name => path.join(path.resolve(modules), '@deepseek-ai', name, 'lib');
const load = (name, file = 'index.js') => import(pathToFileURL(path.join(runtime(name), file)).href);
const cordis = await load('cordis');
const {TypertRegistry} = await load('dsh-typert-registry');
const {TypertGatewayService} = await load('dsh-api-gateway');
const gatewayDir = runtime('dsh-api-gateway');
const clientFile = ['client.browser.js', 'client.js'].map(name => path.join(gatewayDir, name)).find(file => fs.existsSync(file));
assert.ok(clientFile, 'Harness browser Client Gateway must exist');

let nativeClient, store, release;
const browserWindow = {
  __ModuleLoader__: {load(definition) {nativeClient = definition.factory(name => {
    assert.equal(name, '@deepseek-ai/cordis'); return cordis;
  });}},
  addEventListener() {}, removeEventListener() {},
};
const document = {hidden: false, addEventListener() {}, removeEventListener() {}};
new Function('window', fs.readFileSync(clientFile, 'utf8'))(browserWindow);
const protocol = fs.readFileSync(path.join(root, 'finance-protocol.js'), 'utf8').replace(/\bexport /g, '');
const clientSource = fs.readFileSync(path.join(root, 'finance-client.js'), 'utf8');
const create = new Function('document', 'window', protocol + '\n' + clientSource + '\nreturn createFinanceClient;')(document, browserWindow);

let lists = 0, reads = 0, summaryCalls = 0, balanceCalls = 0;
class SyntheticQuery extends cordis.Service {
  constructor(ctx) {super(ctx, 'sessionQuery');}
  async listSessions() {lists++; return [{header: {id: 'synthetic-finance-test'}}];}
  async readSession(id) {
    assert.equal(id, 'synthetic-finance-test'); reads++;
    return {session: {id}, inheritedEventCount: 0, events: [{
      type: 'assistant/message', time: Date.now(),
      data: {turn: 1, step: 1, message: {source: {provider: 'deepseek-account', model: 'deepseek-flash'}},
        usage: {inputTokens: 1000, outputTokens: 200, cacheReadTokens: 0, cacheWriteTokens: 0, totalTokens: 1200}},
    }]};
  }
}
const host = new cordis.Context(), client = new cordis.Context();
const peerControl = new AbortController();
const peer = {principal: {kind: 'owner'}, signal: peerControl.signal, interactions: 'none'};
const accountContribution = {package: '@test/synthetic-account', descriptors: [{
  id: '@test/synthetic-account#account/getBalance', service: 'syntheticAccount', namespace: 'account', method: 'getBalance',
  invocation: {kind: 'direct'}, parameters: [{name: 'client', wire: 'client', source: 'json',
    codec: {mode: 'strict', typeSymbol: '@test/synthetic-account#Client', create: () => ({parse: value => value})}}],
  result: {mode: 'src-json'},
}]};
const deadline = async predicate => {
  const until = Date.now() + 5000;
  while (!predicate() && Date.now() < until) await new Promise(resolve => setTimeout(resolve, 10));
  assert.ok(predicate(), 'Production finance store did not become ready: ' + JSON.stringify(store?.getSnapshot()));
};
try {
  await host.plugin(TypertRegistry);
  await host.plugin({name: 'synthetic-owner-access', apply(ctx) {
    ctx.provide('remoteAccess', {decide() {throw new Error('Owner calls must bypass non-owner access decisions');}});
  }});
  await host.plugin(TypertGatewayService);
  await host.plugin(SyntheticQuery);
  const hostMascot = host.plugin({name: 'production-finance-host', apply: installFinanceHost});
  await hostMascot;
  const gateway = host.get('typertGateway');
  await deadline(() => !!host.get('deepseekGirlFinance'));

  await client.plugin(TypertRegistry);
  await client.plugin({name: 'synthetic-locale', apply(ctx) {
    ctx.provide('locale', {getSnapshot() {return {active: 'zh'};}});
  }});
  await client.plugin({name: 'synthetic-memory-carrier', apply(ctx) {
    ctx.provide('connection', {
      interactions: 'none', isLoopback: true,
      rpc: {
        open() {throw new Error('This integration test must not open a stream');},
        async call(prefix, endpoint, payload, signal) {
          assert.equal(prefix, '/api');
          if (endpoint === 'account/getBalance') {
            balanceCalls++; return {ok: true, value: {status: 'ready', value: [{currency: 'CNY', balance: '12.34'}], bonusWallets: []}};
          }
          assert.equal(endpoint, 'deepseekGirlFinance/summary'); summaryCalls++;
          // Test the real Host dispatch, schema boundary and service resolution.
          return gateway.invokeRpc(endpoint, payload, signal, peer);
        },
      },
      generation: {getSnapshot() {return undefined;}},
      registerGenerationSource() {return () => {};}, start() {return {stop() {}};},
    });
  }});
  await client.plugin(nativeClient);
  await client.plugin({name: 'synthetic-account-mount', inject: ['remote', 'typert'], async apply(ctx) {
    await ctx.remote.$mount(accountContribution);
  }});
  // Deliberately no parent inject. The production store owns three sibling
  // optional injection scopes; this catches a missing typert dependency inside
  // its mount scope that a top-level ['remote'] test accidentally masks.
  const clientMascot = client.plugin({name: 'production-finance-client', inject: ['locale'], apply(ctx) {
    store = create(ctx); ctx.effect(() => () => store.dispose());
  }});
  await clientMascot;
  release = store.acquire();
  await deadline(() => store.getSnapshot().summary.status === 'ready' && store.getSnapshot().account.status === 'ready');
  const value = store.getSnapshot();
  assert.equal(value.summary.tokens.total, 1200);
  assert.equal(value.summary.requests, 1);
  assert.equal(value.summary.estimate.min, .0018);
  assert.equal(value.account.wallets[0].balance, '12.34');
  assert.ok(summaryCalls > 0 && balanceCalls > 0 && lists === 1 && reads === 1);
  assert.ok(client.get('remote.deepseekGirlFinance'));
  release(); release = null;
  await clientMascot.dispose();
  assert.equal(client.get('remote.deepseekGirlFinance'), undefined, 'Consumer disposal must unmount its namespace');
  await hostMascot.dispose();
  assert.equal(host.get('deepseekGirlFinance'), undefined);
  assert.equal(host.get('typert').local.get('deepseekGirlFinance/summary'), undefined);
  console.log(JSON.stringify({passed: true,realCordis: true,realHostGateway: true,realClientGateway: true,productionHostAndStore: true,
    syntheticTokens: 1200,syntheticEstimate: .0018,siblingInjectionScopes: true,scopeDisposal: true,profileReads: 0,networkCalls: 0}));
} finally {
  release?.(); store?.dispose(); peerControl.abort();
  await client.fiber.dispose(); await host.fiber.dispose();
}
