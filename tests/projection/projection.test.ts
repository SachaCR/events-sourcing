import { createProjection } from '../../src/projection';

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
});
