import { definition } from './projection.js';
export const inject = ['sessionProjections'];
export function apply(ctx) {
  ctx.sessionProjections.register(definition);
}
