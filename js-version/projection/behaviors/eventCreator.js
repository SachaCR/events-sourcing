const applyPatch = require('../../patch/applyPatch');
const createPatch = require('../../patch/createPatch');

function eventCreator(state) {
  return function create(eventType, payload) {
    const reducer = state.reducers[eventType];

    if (!reducer) {
      const error = new Error('No reducer for this event');
      error.code = 'NO_REDUCER_FOUND';
      throw error;
    }

    const nextSequence = state.sequence + 1;
    state.events.push({
      sequence: nextSequence,
      type: eventType,
      payload: payload,
    });

    const update = reducer(payload, state.values);
    const patch = createPatch(nextSequence, eventType, update, state);
    state.patchs.push(patch);

    const newState = applyPatch(state, patch);
    state.values = newState.values;
    state.sequence = newState.sequence;
  };
}

module.exports = eventCreator;
