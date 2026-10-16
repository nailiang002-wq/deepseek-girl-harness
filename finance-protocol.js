// A deliberately small, read-only Remote surface. No credentials or session content cross it.
export function parseFinanceRequest(value) {
  const offset = value?.timezoneOffsetSeconds;
  if (!Number.isInteger(offset) || Math.abs(offset) > 14 * 3600 || offset % 60 !== 0) throw new TypeError('Invalid local timezone offset');
  return {timezoneOffsetSeconds: offset};
}
export const FINANCE_REMOTE = {
  package: '@local/dsh-deepseek-girl-finance',
  descriptors: [{
    id: '@local/dsh-deepseek-girl-finance#deepseekGirlFinance/summary',
    service: 'deepseekGirlFinance', namespace: 'deepseekGirlFinance', method: 'summary',
    invocation: {kind: 'direct'},
    parameters: [{name: 'request', wire: 'request', source: 'json', codec: {
      mode: 'strict', typeSymbol: '@local/dsh-deepseek-girl-finance#FinanceRequest',
      create: () => ({parse: parseFinanceRequest}),
    }}],
    result: {mode: 'src-json'},
  }],
};
