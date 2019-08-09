import { createProjection } from '../../src/projection';

describe('projection.addReducer(eventType, reducer)', () => {
  it('Should add a reducer to the projection', () => {
    const reducer = (payload: any) => {
      return { firstname: payload.value };
    };

    const projection = createProjection();
    projection.addReducer('update:firstname', reducer);
    expect(projection.reducers().get('update:firstname')).toBeDefined();
  });
});
