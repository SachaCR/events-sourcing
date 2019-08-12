import { createProjection } from '../../src/projection';
import { Event } from '../../src/interfaces';

describe('projection.revert(n)', () => {
  it('Should revert the last 2 events of the projection', () => {
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

    projection.revert(2);
    expect(projection.events().length).toStrictEqual(3);
    expect(projection.values()).toStrictEqual({ firstname: 'toto' });
    expect(projection.sequence()).toStrictEqual(1);
  });

  it('Should revert to sequence 0 if number is out of range', () => {
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

    projection.revert(99);
    expect(projection.events().length).toStrictEqual(3);
    expect(projection.values()).toStrictEqual({ firstname: 'John' });
    expect(projection.sequence()).toStrictEqual(0);
  });

  describe('Given Projection based on a snapshot sequence 10', () => {
    it('Should revert to sequence 10 if revert is out of range', () => {
      const state = {
        sequence: 10,
        values: {
          firstname: 'Sacha',
          balance: 12.45,
        },
      };

      const reducers = [
        {
          event: 'user:update:firstname',
          reducer: (payload: any) => {
            return { firstname: payload.value };
          },
        },
        {
          event: 'user:balance:add',
          reducer: (payload: any, stateValues: any) => {
            return { balance: stateValues.balance + payload.amount };
          },
        },
      ];

      const events: Array<Event> = [
        {
          type: 'user:update:firstname',
          payload: { value: 'Toto' },
          sequence: 11,
        },
        {
          type: 'user:balance:add',
          payload: { amount: 3 },
          sequence: 12,
        },
      ];

      const projection = createProjection(events, state, reducers);
      projection.revert(99);
      expect(projection.sequence()).toStrictEqual(10);
      expect(projection.events().length).toStrictEqual(2);
      expect(projection.values()).toStrictEqual({
        firstname: 'Sacha',
        balance: 12.45,
      });
    });
  });
});
