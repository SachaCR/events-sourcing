import { createProjection } from '../../src/projection';

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
});
