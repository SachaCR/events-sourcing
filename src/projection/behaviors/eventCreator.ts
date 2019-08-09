import { State } from '../../interfaces';
import { applyPatch } from '../../patch/applyPatch';
import { createPatch } from '../../patch/createPatch';

export function eventCreator(state: State) {
  return function create(eventType: string, payload: any): void {
    const reducer = state.reducers.get(eventType);

    if (!reducer) {
      const error = new Error('No reducer for this event');
      // @ts-ignore
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
