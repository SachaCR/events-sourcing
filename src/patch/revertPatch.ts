import jsonpatch from 'fast-json-patch';

import { BasicState, Patch } from '../interfaces';

export function revertPatch(state: BasicState, patch: Patch): BasicState {
  if (patch.sequence !== state.sequence) {
    const error = new Error('Revert patch is out of sequence');
    // @ts-ignore
    error.code = 'REVERT_PATCH_OUT_OF_SEQUENCE';
    throw error;
  }

  const newStateValues = jsonpatch.deepClone(state.values);
  jsonpatch.applyPatch(newStateValues, patch.operations.revert);

  return {
    sequence: state.sequence - 1,
    values: newStateValues,
  };
}
