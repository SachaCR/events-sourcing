import { ProjectionInternalState } from '../../interfaces';
import { applyPatch } from '../../patch/applyPatch';
import { revertPatch } from '../../patch/revertPatch';
import { findPatch } from '../findPatch';

export function timeTraveler(state: ProjectionInternalState) {
  return function timeTravelTo(targetSequence: number): void {
    if (targetSequence < 0 || state.sequence === targetSequence) {
      return;
    }

    const targetIsForward = state.sequence < targetSequence;

    if (targetIsForward) {
      const patch = findPatch(state.patchs, state.sequence + 1);
      const newState = applyPatch(state, patch);
      state.values = newState.values;
      state.sequence = newState.sequence;

      timeTravelTo(targetSequence);
    } else {
      const patch = findPatch(state.patchs, state.sequence);
      const newState = revertPatch(state, patch);
      state.values = newState.values;
      state.sequence = newState.sequence;

      timeTravelTo(targetSequence);
    }
  };
}
