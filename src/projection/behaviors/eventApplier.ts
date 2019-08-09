import { applyPatch } from '../../patch/applyPatch';
import { State } from '../../interfaces';

export function eventApplier(state: State) {
  return function apply(n: number = 1): void {
    if (n === 0 || state.sequence === state.patchs.length) {
      return;
    }

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

    apply(n - 1);
  };
}
