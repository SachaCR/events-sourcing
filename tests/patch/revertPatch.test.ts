import { revertPatch } from '../../src/patch/revertPatch';
import { Patch } from '../../src/interfaces';

describe('revertPatch()', () => {
  it('Should use patch.operations.revert and return the new state', () => {
    const patch: Patch = {
      sequence: 1,
      type: 'user:updated',
      operations: {
        apply: [
          {
            op: 'replace',
            path: '/user/firstName',
            value: 'tata',
          },
        ],
        revert: [
          {
            op: 'replace',
            path: '/user/firstName',
            value: 'toto',
          },
        ],
      },
    };

    const initialState = {
      sequence: 1,
      values: { user: { firstName: 'tata', lastName: 'titi' } },
    };

    const newState = revertPatch(initialState, patch);

    expect(newState.sequence).toStrictEqual(0);
    expect(newState.values).toStrictEqual({
      user: { firstName: 'toto', lastName: 'titi' },
    });

    // Verify original state immutability
    expect(initialState.sequence).toStrictEqual(1);
    expect(initialState.values).toStrictEqual({
      user: { firstName: 'tata', lastName: 'titi' },
    });
  });

  it('Should throw an error if sequence is not correct', () => {
    const patch: Patch = {
      sequence: 4,
      type: 'toto',
      operations: { apply: [], revert: [] },
    };

    const initialState = { sequence: 2, values: {} };

    let error;

    try {
      revertPatch(initialState, patch);
    } catch (err) {
      error = err;
    }

    expect(error.message).toStrictEqual('Revert patch is out of sequence');
    expect(error.code).toStrictEqual('REVERT_PATCH_OUT_OF_SEQUENCE');
  });
});
