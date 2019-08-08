const revertEvent = require('../revertEvent');

function eventReverter(state) {
  return function revert(number = 1) {
    if (number === 0 || state.sequence === 0) {
      return;
    }

    const event = state.events.find((ev) => ev.sequence === state.sequence);
    const newState = revertEvent(state, event);
    state.values = newState.values;
    state.sequence = newState.sequence;

    revert(number - 1);
  };
}
module.exports = eventReverter;
