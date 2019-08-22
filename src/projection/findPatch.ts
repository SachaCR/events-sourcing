import { Patch, ProjectionInternalState } from '../interfaces';

export function findPatch(
  state: ProjectionInternalState,
  sequence: number,
): Patch {
  const patch = state.patchs[sequence - state.startState.sequence - 1];

  if (!patch) {
    const error = new Error(`Patch not found: sequence: ${sequence - 1}`);
    // @ts-ignore
    error.code = 'PATCH_NOT_FOUND';
    throw error;
  }

  return patch;
}
