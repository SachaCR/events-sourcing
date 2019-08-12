import { applyPatch } from '../../patch/applyPatch';
import { ProjectionInternalState } from '../../interfaces';
import { findPatch } from '../findPatch';

export function eventApplier(state: ProjectionInternalState) {
  return function apply(n: number): void {
    if (
      n <= 0 ||
      state.sequence === state.patchs[state.patchs.length - 1].sequence
    ) {
      return;
    }

    const patch = findPatch(state.patchs, state.sequence + 1);

    const newState = applyPatch(state, patch);
    state.values = newState.values;
    state.sequence = newState.sequence;

    apply(n - 1);
  };
}
