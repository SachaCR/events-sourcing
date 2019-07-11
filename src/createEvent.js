const jsonpatch = require('fast-json-patch')
const merge = require('deepmerge')

module.exports = function createEvent(name, state, patch) {

  const sequence = state.sequence + 1

  const newStateValues = merge(state.values, patch)

  const apply = jsonpatch.compare(state.values, newStateValues)
  const revert = jsonpatch.compare(newStateValues, state.values)

  return {
    sequence,
    name,
    operations: {
      apply,
      revert,
    },
  }
}