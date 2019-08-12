import { createProjection } from '../../src/projection';

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
});
