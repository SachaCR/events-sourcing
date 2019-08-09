import jsonpatch from 'fast-json-patch';
import merge from 'deepmerge';

import { Patch, BasicState } from '../interfaces';

export function createPatch(
  sequence: number,
  type: string,
  update: any,
  state: BasicState,
): Patch {
  const newStateValues: any = merge(state.values, update);
  const apply = jsonpatch.compare(state.values, newStateValues);
  const revert = jsonpatch.compare(newStateValues, state.values);

  const patch: Patch = {
    sequence: sequence,
    type: type,
    operations: {
      apply,
      revert,
    },
  };

  return patch;
}
