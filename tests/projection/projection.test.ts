import { createProjection } from '../../src/projection';
import { Event } from '../../src/interfaces';

describe('createProjection()', () => {
  it('Should create a projection with default empty state', () => {
    const projection = createProjection();
    expect(projection.sequence()).toStrictEqual(0);
    expect(projection.events()).toStrictEqual([]);
    expect(projection.values()).toStrictEqual({});

    expect(projection.addEvent).toBeDefined();
    expect(projection.addReducer).toBeDefined();
    expect(projection.apply).toBeDefined();
    expect(projection.revert).toBeDefined();
    expect(projection.goTo).toBeDefined();
  });

  describe('Given a list of events and a snapshot from sequence 10', () => {
    it('Should apply events on top of the snapshots and return a valid projection', () => {
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
      expect(projection.sequence()).toStrictEqual(12);
      expect(projection.events().length).toStrictEqual(2);
      expect(projection.values()).toStrictEqual({
        firstname: 'Toto',
        balance: 15.45,
      });
    });
  });
});
