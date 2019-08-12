const jsonpatch = require('fast-json-patch');
const merge = require('deepmerge');

function createPatch(sequence, type, update, state) {
  const newStateValues = merge(state.values, update);
  const apply = jsonpatch.compare(state.values, newStateValues);
  const revert = jsonpatch.compare(newStateValues, state.values);

  const patch = {
    sequence: sequence,
    type: type,
    operations: {
      apply,
      revert,
    },
  };

  return patch;
}

module.exports = createPatch;
