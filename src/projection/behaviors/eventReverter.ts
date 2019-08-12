import { revertPatch } from '../../patch/revertPatch';
import { ProjectionInternalState } from '../../interfaces';

export function eventReverter(state: ProjectionInternalState) {
  return function revert(n: number = 1): void {
    if (
      n === 0 ||
      state.sequence === 0 ||
      state.sequence === state.events[0].sequence - 1
    ) {
      return;
    }

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

    revert(n - 1);
  };
}
