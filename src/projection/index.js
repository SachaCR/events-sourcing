const applyEvent = require('../applyEvent');

const eventApplier = require('./eventApplier');
const eventCreator = require('./eventCreator');
const eventReverter = require('./eventReverter');
const timeTraveler = require('./timeTraveler');

function createProjection(
  events = [],
  originalState = { sequence: 0, values: {} },
) {
  if (originalState.sequence < 0) {
    const error = new Error('State sequence must be >= to 0');
    error.code = 'STATE_SEQUENCE_LOWER_THAN_ZERO';
  }

  const { sequence, values } = events.reduce((state, ev) => {
    return applyEvent(state, ev);
  }, originalState);

  const newState = {
    sequence,
    values,
    events,
  };

  return {
    sequence: () => newState.sequence,
    values: () => newState.values,
    events: () => newState.events,
    addEvent: eventCreator(newState),
    revert: eventReverter(newState),
    apply: eventApplier(newState),
    goTo: timeTraveler(newState),
  };
}

module.exports = createProjection;
