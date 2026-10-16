import { definition } from './projection.js';
import { installFinanceHost } from './finance-host.js';
export const inject = ['sessionProjections'];
export function apply(ctx) {
  ctx.sessionProjections.register(definition);
  installFinanceHost(ctx);
}
