const applyPatch = require('../../patch/applyPatch');

function eventApplier(state) {
  return function apply(number = 1) {
    if (number === 0 || state.sequence === state.patchs.length) {
      return;
    }

    const patch = state.patchs.find(
      (patch) => patch.sequence === state.sequence + 1,
    );

    const newState = applyPatch(state, patch);
    state.values = newState.values;
    state.sequence = newState.sequence;

    apply(number - 1);
  };
}

module.exports = eventApplier;
