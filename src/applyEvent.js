const jsonpatch = require('fast-json-patch')

module.exports = function applyEvent(state, event) {

  if (state.sequence + 1 !== event.sequence) {
    const error = new Error('Apply event is out of sequence')
    error.code = 'APPLY_EVENT_OUT_OF_SEQUENCE'
    throw error
  }

  const newStateValues = jsonpatch.deepClone(state.values)

  jsonpatch.applyPatch(newStateValues, event.operations.apply)

  return {
    sequence: event.sequence,
    values: newStateValues,
  }
}