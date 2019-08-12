import { Patch } from '../interfaces';

export function findPatch(patchs: Array<Patch>, sequence: number): Patch {
  const patch = patchs.find((patch) => patch.sequence === sequence);

  if (!patch) {
    const error = new Error('Patch not found');
    // @ts-ignore
    error.code = 'PATCH_NOT_FOUND';
    throw error;
  }

  return patch;
}
