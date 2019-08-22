import { ProjectionInternalState } from '../../interfaces';
import { applyPatch } from '../../patch/applyPatch';
import { revertPatch } from '../../patch/revertPatch';
import { findPatch } from '../findPatch';

export function timeTraveler(state: ProjectionInternalState) {
  return function timeTravelTo(targetSequence: number): void {
    const lastSequence = state.patchs[state.patchs.length - 1].sequence;
    const startSequence = state.startState.sequence;

    const isShorterToStartFromTheFirstState =
      Math.abs(targetSequence - state.startState.sequence) <
      Math.abs(targetSequence - state.sequence);

    const isShorterToStartFromTheLastState =
      Math.abs(targetSequence - state.endState.sequence) <
      Math.abs(targetSequence - state.sequence);

    if (isShorterToStartFromTheFirstState) {
      state.values = state.startState.values;
      state.sequence = state.startState.sequence;
    } else if (isShorterToStartFromTheLastState) {
      state.values = state.endState.values;
      state.sequence = state.endState.sequence;
    }

    const targetIsForward = state.sequence < targetSequence;

    if (targetIsForward) {
      let nbEventToApply =
        Math.min(lastSequence, targetSequence) - state.sequence;

      for (nbEventToApply; nbEventToApply > 0; nbEventToApply--) {
        const patch = findPatch(state, state.sequence + 1);
        const newState = applyPatch(state, patch);
        state.values = newState.values;
        state.sequence = newState.sequence;
      }

      return;
    } else {
      let nbEventToRevert = state.sequence - Math.max(0, targetSequence);

      for (nbEventToRevert; nbEventToRevert > 0; nbEventToRevert--) {
        const patch = findPatch(state, state.sequence);
        const newState = revertPatch(state, patch);
        state.values = newState.values;
        state.sequence = newState.sequence;
      }

      return;
    }
  };
}
