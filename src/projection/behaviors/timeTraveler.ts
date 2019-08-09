import { State } from '../../interfaces';
import { applyPatch } from '../../patch/applyPatch';
import { revertPatch } from '../../patch/revertPatch';

export function timeTraveler(state: State) {
  return function timeTravelTo(targetSequence: number): void {
    if (state.sequence === targetSequence) {
      return;
    }

    const targetIsForward = state.sequence < targetSequence;

    if (targetIsForward) {
      const patch = state.patchs.find(
        (patch) => patch.sequence === state.sequence + 1,
      );

      if (!patch) {
        const error = new Error('Patch not found');
        // @ts-ignore
        error.code = 'PATCH_NOT_FOUND';
        throw error;
      }

      const newState = applyPatch(state, patch);
      state.values = newState.values;
      state.sequence = newState.sequence;

      timeTravelTo(targetSequence);
    } else {
      const patch = state.patchs.find(
        (patch) => patch.sequence === state.sequence,
      );

      if (!patch) {
        const error = new Error('Patch not found');
        // @ts-ignore
        error.code = 'PATCH_NOT_FOUND';
        throw error;
      }

      const newState = revertPatch(state, patch);
      state.values = newState.values;
      state.sequence = newState.sequence;

      timeTravelTo(targetSequence);
    }
  };
}
