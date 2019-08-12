import { ProjectionInternalState } from '../../interfaces';

export function eventReducer(state: ProjectionInternalState) {
  return function addReducer(
    eventType: string,
    reducer: (payload: any, stateValues: any) => void,
  ) {
    state.reducers.set(eventType, reducer);
  };
}
