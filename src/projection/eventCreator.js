const applyEvent = require('../applyEvent');
const createEvent = require('../createEvent');

function eventCreator(state) {
  return function create(name, patch) {
    const event = createEvent(name, patch, state);
    state.events.push(event);

    const newState = applyEvent(state, event);
    state.values = newState.values;
    state.sequence = newState.sequence;
  };
}

module.exports = eventCreator;
