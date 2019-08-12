import { createProjection } from '../../src/projection';

describe('projection.addEvent(eventType, payload)', () => {
  it('Should add a reducer to the projection', () => {
    const reducersMap = [
      {
        event: 'update:firstname',
        reducer: (payload: any) => {
          return { firstname: payload.value };
        },
      },
    ];

    const projection = createProjection(
      [],
      { sequence: 0, values: { firstname: 'toto' } },
      reducersMap,
    );

    projection.addEvent('update:firstname', { value: 'Sacha' });

    expect(projection.values()).toStrictEqual({ firstname: 'Sacha' });
    expect(projection.sequence()).toStrictEqual(1);
    expect(projection.events().length).toStrictEqual(1);
    expect(projection.events()[0]).toStrictEqual({
      sequence: 1,
      type: 'update:firstname',
      payload: { value: 'Sacha' },
    });
  });

  it('Should throw if there is no reducer for these type of event', () => {
    const projection = createProjection();

    try {
      projection.addEvent('update:firstname', { value: 'Sacha' });
    } catch (err) {
      expect(err.message).toStrictEqual('No reducer for this event');
      expect(err.code).toStrictEqual('NO_REDUCER_FOUND');
    }
  });

  describe('Given adding an event seq=4 on a projection with 3 events but in seq=2', () => {
    it('Should not play the event but verifies that the reducer exists', () => {
      const reducersMap = [
        {
          event: 'update:firstname',
          reducer: (payload: any) => {
            return { firstname: payload.value };
          },
        },
      ];

      const projection = createProjection(
        [],
        { sequence: 0, values: { firstname: 'John' } },
        reducersMap,
      );

      projection.addEvent('update:firstname', { value: 'toto' });
      projection.addEvent('update:firstname', { value: 'tata' });
      projection.addEvent('update:firstname', { value: 'titi' });

      projection.revert(1);
      expect(projection.sequence()).toStrictEqual(2);

      projection.addEvent('update:firstname', { value: 'Carlos' });

      expect(projection.sequence()).toStrictEqual(4);
      expect(projection.values()).toStrictEqual({ firstname: 'Carlos' });
    });
  });
});
