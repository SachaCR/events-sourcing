import { applyPatch } from '../../src/patch/applyPatch';
import { Patch } from '../../src/interfaces';

describe('applyPatch()', () => {
  it('Should use patch.operations.apply operations and return the new state', () => {
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
      sequence: 0,
      values: { user: { firstName: 'toto', lastName: 'titi' } },
    };

    const newState = applyPatch(initialState, patch);

    expect(newState.sequence).toStrictEqual(1);
    expect(newState.values).toStrictEqual({
      user: { firstName: 'tata', lastName: 'titi' },
    });

    // Verify original state immutability
    expect(initialState.sequence).toStrictEqual(0);
    expect(initialState.values).toStrictEqual({
      user: { firstName: 'toto', lastName: 'titi' },
    });
  });

  it('Should throw an error if sequence is not correct', () => {
    const patch: Patch = {
      sequence: 2,
      type: 'toto',
      operations: { apply: [], revert: [] },
    };

    const initialState = { sequence: 2, values: {} };

    let error;

    try {
      applyPatch(initialState, patch);
    } catch (err) {
      error = err;
    }

    expect(error.message).toStrictEqual('Apply patch is out of sequence');
    expect(error.code).toStrictEqual('APPLY_PATCH_OUT_OF_SEQUENCE');
  });
});
