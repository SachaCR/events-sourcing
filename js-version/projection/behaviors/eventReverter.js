const revertPatch = require('../../patch/revertPatch');

function eventReverter(state) {
  return function revert(number = 1) {
    if (number === 0 || state.sequence === 0) {
      return;
    }

    const patch = state.patchs.find(
      (patch) => patch.sequence === state.sequence,
    );

    const newState = revertPatch(state, patch);
    state.values = newState.values;
    state.sequence = newState.sequence;

    revert(number - 1);
  };
}
module.exports = eventReverter;
