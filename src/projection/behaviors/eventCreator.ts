import { ProjectionInternalState } from '../../interfaces';
import { applyPatch } from '../../patch/applyPatch';
import { createPatch } from '../../patch/createPatch';
import { timeTraveler } from '../behaviors/timeTraveler';
import jsonpatch from 'fast-json-patch';

export function eventCreator(state: ProjectionInternalState) {
  return function create(eventType: string, payload: any): void {
    const reducer = state.reducers.get(eventType);

    if (!reducer) {
      const error = new Error('No reducer for this event');
      // @ts-ignore
      error.code = 'NO_REDUCER_FOUND';
      throw error;
    }

    const lastSequence =
      state.events.length > 0
        ? state.events[state.events.length - 1].sequence
        : 0;

    const nextSequence = lastSequence + 1;
    state.events.push({
      sequence: nextSequence,
      type: eventType,
      payload: payload,
    });

    const update = reducer(payload, state.values);
    const patch = createPatch(nextSequence, eventType, update, state);
    state.patchs.push(patch);

    if (state.sequence !== lastSequence) {
      timeTraveler(state)(lastSequence);
    }

    const newState = applyPatch(state, patch);
    state.values = newState.values;
    state.sequence = newState.sequence;

    state.endState = {
      values: jsonpatch.deepClone(newState.values),
      sequence: newState.sequence,
    };
  };
}
