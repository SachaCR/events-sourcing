const applyPatch = require('../patch/applyPatch');
const createPatch = require('../patch/createPatch');

const eventApplier = require('../projection/behaviors/eventApplier');
const eventCreator = require('../projection/behaviors/eventCreator');
const eventReverter = require('../projection/behaviors/eventReverter');
const timeTraveler = require('../projection/behaviors/timeTraveler');
const eventReducer = require('../projection/behaviors/eventReducer');

function createProjection(
  events = [],
  originalState = { sequence: 0, values: {} },
  reducers = {},
) {
  const patchs = [];

  if (originalState.sequence < 0) {
    const error = new Error('State sequence must be >= to 0');
    error.code = 'STATE_SEQUENCE_LOWER_THAN_ZERO';
  }

  const { sequence, values } = events.reduce((state, ev) => {
    const reducer = reducers[ev.type];
    const update = reducer(ev.payload, state);
    const patch = createPatch(ev.sequence, ev.type, update, state);
    patchs.push(patch);
    return applyPatch(state, patch);
  }, originalState);

  const newState = {
    reducers,
    sequence,
    values,
    events,
    patchs,
  };

  return {
    sequence: () => newState.sequence,
    values: () => newState.values,
    events: () => newState.events,
    reducers: () => newState.reducers,
    addReducer: eventReducer(newState),
    addEvent: eventCreator(newState),
    revert: eventReverter(newState),
    apply: eventApplier(newState),
    goTo: timeTraveler(newState),
  };
}

module.exports = createProjection;
