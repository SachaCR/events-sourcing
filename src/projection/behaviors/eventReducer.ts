import { ProjectionInternalState } from '../../interfaces';

export function eventReducer(state: ProjectionInternalState) {
  return function addReducer(
    eventType: string,
    reducer: (payload: any, stateValues: any) => void,
  ): any {
    state.reducers.set(eventType, reducer);
  };
}
