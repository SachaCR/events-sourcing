const jsonpatch = require('fast-json-patch');

function revertPatch(state, patch) {
  if (patch.sequence !== state.sequence) {
    const error = new Error('Revert patch is out of sequence');
    error.code = 'REVERT_PATCH_OUT_OF_SEQUENCE';
    throw error;
  }

  const newStateValues = jsonpatch.deepClone(state.values);
  jsonpatch.applyPatch(newStateValues, patch.operations.revert);

  return {
    sequence: state.sequence - 1,
    values: newStateValues,
  };
}

module.exports = revertPatch;
