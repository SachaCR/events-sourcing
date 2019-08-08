const jsonpatch = require('fast-json-patch');

module.exports = function revertEvent(state, event) {
  if (event.sequence !== state.sequence) {
    const error = new Error('Revert event is out of sequence');
    error.code = 'REVERT_EVENT_OUT_OF_SEQUENCE';
    throw error;
  }

  const newStateValues = jsonpatch.deepClone(state.values);
  jsonpatch.applyPatch(newStateValues, event.operations.revert);

  return {
    sequence: state.sequence - 1,
    values: newStateValues,
  };
};
