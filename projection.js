// Log-derived end-of-turn facts only. Live reasoning/text comes from Chat's assembled nodes.
export const KEY = 'deepseekGirlStatus';
const schema = {
  parse(value) {
    if (!value || !Number.isSafeInteger(value.turn) || value.turn < 0 ||
        !Number.isSafeInteger(value.endSeq) || value.endSeq < -1 ||
        !['idle', 'working', 'completed', 'error', 'stopped'].includes(value.outcome)) {
      throw new TypeError('Invalid DeepSeek girl projection');
    }
    return { turn: value.turn, endSeq: value.endSeq, outcome: value.outcome };
  }
};
export const definition = {
  key: KEY, stateVersion: 1, stateSchema: schema,
  init: () => ({ turn: 0, endSeq: -1, outcome: 'idle' }),
  apply(state, event) {
    if (event.type === 'turn/start') return { ...state, turn: event.data.turn, outcome: 'working' };
    if (event.type !== 'turn/end') return state;
    const reason = event.data?.reason?.kind;
    return { turn: event.data.turn, endSeq: event.seq,
      outcome: reason === 'error' ? 'error' : reason === 'completed' ? 'completed' : 'stopped' };
  },
  wire: { viewSchema: schema, view: state => state }
};
