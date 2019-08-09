import { State, Event, BasicState, Projection, Patch } from '../interfaces';
import { applyPatch } from '../patch/applyPatch';
import { createPatch } from '../patch/createPatch';

import { eventApplier } from './behaviors/eventApplier';
import { eventCreator } from './behaviors/eventCreator';
import { eventReverter } from './behaviors/eventReverter';
import { timeTraveler } from './behaviors/timeTraveler';
import { eventReducer } from './behaviors/eventReducer';

export function createProjection(
  events: Array<Event> = [],
  originalState: BasicState = { sequence: 0, values: {} },
  reducers: Map<string, (paylaod: any, stateValues: any) => any> = new Map([]),
): Projection {
  const patchs: Array<Patch> = [];

  if (originalState.sequence < 0) {
    const error = new Error('State sequence must be >= to 0');
    // @ts-ignore
    error.code = 'STATE_SEQUENCE_LOWER_THAN_ZERO';
  }

  const { sequence, values } = events.reduce(
    (state: BasicState, event: Event): BasicState => {
      const reducer = reducers.get(event.type);

      if (!reducer) {
        const error = new Error('No reducer for this event');
        // @ts-ignore
        error.code = 'NO_REDUCER_FOUND';
        throw error;
      }

      const update = reducer(event.payload, state);
      const patch = createPatch(event.sequence, event.type, update, state);
      patchs.push(patch);
      return applyPatch(state, patch);
    },
    originalState,
  );

  const newState: State = {
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
