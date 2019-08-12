const applyPatch = require('../../patch/applyPatch');
const revertPatch = require('../../patch/revertPatch');

function timeTraveler(state) {
  return function timeTravelTo(targetSequence) {
    if (state.sequence === targetSequence) {
      return;
    }

    const targetIsForward = state.sequence < targetSequence;

    if (targetIsForward) {
      const patch = state.patchs.find(
        (patch) => patch.sequence === state.sequence + 1,
      );

      const newState = applyPatch(state, patch);
      state.values = newState.values;
      state.sequence = newState.sequence;

      timeTravelTo(targetSequence);
    } else {
      const patch = state.patchs.find(
        (patch) => patch.sequence === state.sequence,
      );

      const newState = revertPatch(state, patch);
      state.values = newState.values;
      state.sequence = newState.sequence;

      timeTravelTo(targetSequence);
    }
  };
}

module.exports = timeTraveler;
