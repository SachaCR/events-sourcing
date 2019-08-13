import { revertPatch } from '../../patch/revertPatch';
import { ProjectionInternalState } from '../../interfaces';
import { findPatch } from '../findPatch';

export function eventReverter(state: ProjectionInternalState) {
  return function revert(nbEventToRevert: number): void {
    if (nbEventToRevert <= 0) {
      return;
    }

    const minSequence = state.patchs[0].sequence - 1; // To get the original state sequence
    const targetSequence = Math.max(
      minSequence,
      state.sequence - nbEventToRevert,
    );

    for (nbEventToRevert; nbEventToRevert > 0; nbEventToRevert--) {
      if (state.sequence === targetSequence) {
        return;
      }

      const patch = findPatch(state, state.sequence);
      const newState = revertPatch(state, patch);
      state.values = newState.values;
      state.sequence = newState.sequence;
    }
  };
}
