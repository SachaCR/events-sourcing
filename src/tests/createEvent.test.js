const createEvent = require('../createEvent');

describe('createEvent()', () => {
  it('Should create an event that update firstName without deleting lastName', () => {
    const initialState = {
      sequence: 0,
      values: { user: { firstName: 'toto', lastName: 'titi' } },
    };

    const updates = { user: { firstName: 'tata' } };

    const event = createEvent('user:updated', updates, initialState);

    expect(event).toStrictEqual({
      sequence: 1,
      name: 'user:updated',
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

  it('Should create an event that update firstName with deleting lastName', () => {
    const initialState = {
      sequence: 0,
      values: { user: { firstName: 'toto', lastName: 'titi' } },
    };

    const updates = { user: { firstName: 'tata', lastName: undefined } };

    const event = createEvent('user:updated', updates, initialState);

    expect(event).toStrictEqual({
      sequence: 1,
      name: 'user:updated',
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

  it('Should create an event that update firstName with deleting lastName', () => {
    const initialState = {
      sequence: 0,
      values: { user: { firstName: 'toto', lastName: 'titi' } },
    };

    const updates = { user: { firstName: 'tata', lastName: null } };

    const event = createEvent('user:updated', updates, initialState);

    expect(event).toStrictEqual({
      sequence: 1,
      name: 'user:updated',
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
