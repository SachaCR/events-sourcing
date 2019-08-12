const jsonpatch = require('fast-json-patch');

function applyPatch(state, patch) {
  if (state.sequence + 1 !== patch.sequence) {
    const error = new Error('Apply patch is out of sequence');
    error.code = 'APPLY_PATCH_OUT_OF_SEQUENCE';
    throw error;
  }

  const newStateValues = jsonpatch.deepClone(state.values);

  jsonpatch.applyPatch(newStateValues, patch.operations.apply);

  return {
    sequence: patch.sequence,
    values: newStateValues,
  };
}

module.exports = applyPatch;
