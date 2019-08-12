import { ProjectionInternalState } from '../../interfaces';
import { applyPatch } from '../../patch/applyPatch';
import { revertPatch } from '../../patch/revertPatch';
import { findPatch } from '../findPatch';

export function timeTraveler(state: ProjectionInternalState) {
  return function timeTravelTo(targetSequence: number): void {
    const lastSequence = state.patchs[state.patchs.length - 1].sequence;

    if (state.sequence === targetSequence) {
      return;
    }

    const targetIsForward = state.sequence < targetSequence;

    if (targetIsForward) {
      if (state.sequence === lastSequence) {
        return;
      }

      const patch = findPatch(state.patchs, state.sequence + 1);
      const newState = applyPatch(state, patch);
      state.values = newState.values;
      state.sequence = newState.sequence;
    } else {
      if (state.sequence === 0) {
        return;
      }

      const patch = findPatch(state.patchs, state.sequence);
      const newState = revertPatch(state, patch);
      state.values = newState.values;
      state.sequence = newState.sequence;
    }

    timeTravelTo(targetSequence);
  };
}
