import { applyPatch } from '../../patch/applyPatch';
import { ProjectionInternalState } from '../../interfaces';
import { findPatch } from '../findPatch';

export function eventApplier(state: ProjectionInternalState) {
  return function apply(nbEventToApply: number): void {
    const lastSequence = state.patchs[state.patchs.length - 1].sequence;

    for (nbEventToApply; nbEventToApply > 0; nbEventToApply--) {
      const nextSeq = state.sequence + 1;

      if (nextSeq > lastSequence) {
        return;
      }

      const patch = findPatch(state, state.sequence + 1);
      const newState = applyPatch(state, patch);
      state.values = newState.values;
      state.sequence = newState.sequence;
    }
  };
}
