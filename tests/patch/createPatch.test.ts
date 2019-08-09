import { createPatch } from '../../src/patch/createPatch';

describe('createPatch()', () => {
  it('Should create a patch that update firstName without deleting lastName', () => {
    const initialState = {
      sequence: 0,
      values: { user: { firstName: 'toto', lastName: 'titi' } },
    };

    const updates = { user: { firstName: 'tata' } };

    const patch = createPatch(1, 'user:updated', updates, initialState);

    expect(patch).toStrictEqual({
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
    });
  });

  it('Should create an patch that update firstName with deleting lastName', () => {
    const initialState = {
      sequence: 0,
      values: { user: { firstName: 'toto', lastName: 'titi' } },
    };

    const updates = { user: { firstName: 'tata', lastName: undefined } };

    const patch = createPatch(1, 'user:updated', updates, initialState);

    expect(patch).toStrictEqual({
      sequence: 1,
      type: 'user:updated',
      operations: {
        apply: [
          {
            op: 'remove',
            path: '/user/lastName',
          },
          {
            op: 'replace',
            path: '/user/firstName',
            value: 'tata',
          },
        ],
        revert: [
          {
            op: 'replace',
            path: '/user/lastName',
            value: 'titi',
          },
          {
            op: 'replace',
            path: '/user/firstName',
            value: 'toto',
          },
        ],
      },
    });
  });

  it('Should create an patch that update firstName with deleting lastName', () => {
    const initialState = {
      sequence: 0,
      values: { user: { firstName: 'toto', lastName: 'titi' } },
    };

    const updates = { user: { firstName: 'tata', lastName: null } };

    const patch = createPatch(1, 'user:updated', updates, initialState);

    expect(patch).toStrictEqual({
      sequence: 1,
      type: 'user:updated',
      operations: {
        apply: [
          {
            op: 'replace',
            path: '/user/lastName',
            value: null,
          },
          {
            op: 'replace',
            path: '/user/firstName',
            value: 'tata',
          },
        ],
        revert: [
          {
            op: 'replace',
            path: '/user/lastName',
            value: 'titi',
          },
          {
            op: 'replace',
            path: '/user/firstName',
            value: 'toto',
          },
        ],
      },
    });
  });
});
