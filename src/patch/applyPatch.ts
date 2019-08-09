import jsonpatch from 'fast-json-patch';

import { BasicState, Patch } from '../interfaces';

export function applyPatch(state: BasicState, patch: Patch): BasicState {
  if (state.sequence + 1 !== patch.sequence) {
    const error = new Error('Apply patch is out of sequence');
    // @ts-ignore
    error.code = 'APPLY_PATCH_OUT_OF_SEQUENCE';
    throw error;
  }

  const newStateValues = jsonpatch.deepClone(state.values);

  jsonpatch.applyPatch(newStateValues, patch.operations.apply);

  return {
    sequence: patch.sequence,
    values: newStateValues,
  };
}
