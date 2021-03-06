import { createProjection } from '../../src/projection';

describe('projection.goTo(targetSequence)', () => {
  it('Should move the projection to the target sequence', () => {
    const reducersMap = [
      {
        event: 'update:firstname',
        reducer: (payload: any): any => {
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

    expect(projection.sequence()).toStrictEqual(3);
    expect(projection.values()).toStrictEqual({ firstname: 'titi' });

    projection.goTo(2);
    expect(projection.sequence()).toStrictEqual(2);
    expect(projection.values()).toStrictEqual({ firstname: 'tata' });

    projection.goTo(3);
    expect(projection.sequence()).toStrictEqual(3);
    expect(projection.values()).toStrictEqual({ firstname: 'titi' });

    projection.goTo(1);
    expect(projection.sequence()).toStrictEqual(1);
    expect(projection.values()).toStrictEqual({ firstname: 'toto' });

    projection.goTo(0);
    expect(projection.sequence()).toStrictEqual(0);
    expect(projection.values()).toStrictEqual({ firstname: 'John' });
  });

  it('Should stop at the max sequence if target is too high', () => {
    const reducersMap = [
      {
        event: 'update:firstname',
        reducer: (payload: any): any => {
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

    expect(projection.sequence()).toStrictEqual(3);
    expect(projection.values()).toStrictEqual({ firstname: 'titi' });

    projection.goTo(0);
    expect(projection.sequence()).toStrictEqual(0);
    expect(projection.values()).toStrictEqual({ firstname: 'John' });

    projection.goTo(99);
    expect(projection.sequence()).toStrictEqual(3);
    expect(projection.values()).toStrictEqual({ firstname: 'titi' });
  });

  it('Should stop at 0 if target is under 0', () => {
    const reducersMap = [
      {
        event: 'update:firstname',
        reducer: (payload: any): any => {
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

    expect(projection.sequence()).toStrictEqual(3);
    expect(projection.values()).toStrictEqual({ firstname: 'titi' });

    projection.goTo(-1);
    expect(projection.sequence()).toStrictEqual(0);
    expect(projection.values()).toStrictEqual({ firstname: 'John' });
  });
});
