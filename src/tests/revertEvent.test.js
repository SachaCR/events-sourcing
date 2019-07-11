
const revertEvent = require('../revertEvent')

describe('revertEvent()', () => {
  it('Should use event.operations.revert and return the new state', () => {

    const event = {
      sequence: 1,
      name: 'user:updated',
      operations: {
        apply: [
          {
            op: 'replace',
            path: '/user/firstName',
            value: 'tata'
          }
        ],
        revert: [
          {
            op: 'replace',
            path: '/user/firstName',
            value: 'toto'
          }
        ]
      }
    }

    const initialState = {
      sequence: 1,
      values: { user: { firstName: 'tata', lastName: 'titi' } }
    }

    const newState = revertEvent(initialState, event)

    expect(newState.sequence).toStrictEqual(0)
    expect(newState.values).toStrictEqual({ user: { firstName: 'toto', lastName: 'titi' } })

    // Verify original state immutability
    expect(initialState.sequence).toStrictEqual(1)
    expect(initialState.values).toStrictEqual({ user: { firstName: 'tata', lastName: 'titi' } })
  })

  it('Should throw an error if sequence is not correct', () => {
    const event = { sequence: 3 }
    const initialState = { sequence: 2 }

    let error

    try {
      revertEvent(initialState, event)
    } catch (err) {
      error = err
    }

    expect(error.message).toStrictEqual('Revert event is out of sequence')
    expect(error.code).toStrictEqual('REVERT_EVENT_OUT_OF_SEQUENCE')
  })

})