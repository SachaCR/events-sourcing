const applyEvent = require('../applyEvent');

function eventApplier(state) {
  return function apply(number = 1) {
    if (number === 0 || state.sequence === state.events.length) {
      return;
    }

    const event = state.events.find((ev) => ev.sequence === state.sequence + 1);
    const newState = applyEvent(state, event);
    state.values = newState.values;
    state.sequence = newState.sequence;

    apply(number - 1);
  };
}

module.exports = eventApplier;
