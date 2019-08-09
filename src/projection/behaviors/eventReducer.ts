import { State } from '../../interfaces';

export function eventReducer(state: State) {
  return function addReducer(
    eventType: string,
    reducer: (payload: any, stateValues: any) => void,
  ) {
    state.reducers.set(eventType, reducer);
  };
}
