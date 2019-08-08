const applyEvent = require('../applyEvent');
const revertEvent = require('../revertEvent');

function timeTraveler(state) {
  return function timeTravelTo(targetSequence) {
    if (state.sequence === targetSequence) {
      return;
    }

    const targetIsForward = state.sequence < targetSequence;

    if (targetIsForward) {
      const event = state.events.find(
        (ev) => ev.sequence === state.sequence + 1,
      );

      const newState = applyEvent(state, event);
      state.values = newState.values;
      state.sequence = newState.sequence;

      timeTravelTo(targetSequence);
    } else {
      const event = state.events.find((ev) => ev.sequence === state.sequence);

      const newState = revertEvent(state, event);
      state.values = newState.values;
      state.sequence = newState.sequence;

      timeTravelTo(targetSequence);
    }
  };
}

module.exports = timeTraveler;
