import { revertPatch } from '../../patch/revertPatch';
import { ProjectionInternalState } from '../../interfaces';
import { findPatch } from '../findPatch';

export function eventReverter(state: ProjectionInternalState) {
  return function revert(n: number): void {
    if (
      n <= 0 ||
      state.sequence === 0 ||
      state.sequence === state.events[0].sequence - 1
    ) {
      return;
    }

    const patch = findPatch(state.patchs, state.sequence);

    const newState = revertPatch(state, patch);
    state.values = newState.values;
    state.sequence = newState.sequence;

    revert(n - 1);
  };
}
