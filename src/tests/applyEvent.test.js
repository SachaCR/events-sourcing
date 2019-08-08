const applyEvent = require('../applyEvent');

describe('applyEvent()', () => {
  it('Should use event.operations.apply operations and return the new state', () => {
    const event = {
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
    };

    const initialState = {
      sequence: 0,
      values: { user: { firstName: 'toto', lastName: 'titi' } },
    };

    const newState = applyEvent(initialState, event);

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
    const event = { sequence: 2 };
    const initialState = { sequence: 2 };

    let error;

    try {
      applyEvent(initialState, event);
    } catch (err) {
      error = err;
    }

    expect(error.message).toStrictEqual('Apply event is out of sequence');
    expect(error.code).toStrictEqual('APPLY_EVENT_OUT_OF_SEQUENCE');
  });
});
