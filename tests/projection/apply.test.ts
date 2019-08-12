import { createProjection } from '../../src/projection';
import { Event } from '../../src/interfaces';

describe('projection.apply(n)', () => {
  it('Should apply the last event of the projection', () => {
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

    projection.addEvent('update:firstname', { value: 'toto' });
    projection.addEvent('update:firstname', { value: 'tata' });
    projection.addEvent('update:firstname', { value: 'titi' });

    projection.revert(2);
    expect(projection.sequence()).toStrictEqual(1);

    projection.apply(2);
    expect(projection.events().length).toStrictEqual(3);
    expect(projection.values()).toStrictEqual({ firstname: 'titi' });
    expect(projection.sequence()).toStrictEqual(3);
  });

  it('Should apply until the last event if number is out of range', () => {
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

    projection.addEvent('update:firstname', { value: 'toto' });
    projection.addEvent('update:firstname', { value: 'tata' });
    projection.addEvent('update:firstname', { value: 'titi' });

    projection.revert(2);
    expect(projection.sequence()).toStrictEqual(1);

    projection.apply(99);
    expect(projection.events().length).toStrictEqual(3);
    expect(projection.values()).toStrictEqual({ firstname: 'titi' });
    expect(projection.sequence()).toStrictEqual(3);
  });

  describe('Given Projection based on a snapshot sequence 12 and reverted to 10', () => {
    it('Should apply to sequence 12 if apply number is out of range', () => {
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
      projection.goTo(10);
      projection.apply(99);
      expect(projection.sequence()).toStrictEqual(12);
      expect(projection.events().length).toStrictEqual(2);
      expect(projection.values()).toStrictEqual({
        firstname: 'Toto',
        balance: 15.45,
      });
    });
  });
});
