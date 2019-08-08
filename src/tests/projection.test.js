const createProjection = require('../projection');

describe('createProjection()', () => {
  it('Should create a projection with default empty state', () => {
    const projection = createProjection();
    expect(projection.sequence()).toStrictEqual(0);
    expect(projection.events()).toStrictEqual([]);
    expect(projection.values()).toStrictEqual({});

    expect(projection.addEvent).toBeDefined();
    expect(projection.apply).toBeDefined();
    expect(projection.revert).toBeDefined();
    expect(projection.goTo).toBeDefined();
  });
});

describe('projection.addEvent()', () => {
  it('Should add an event to a projection', () => {
    const projection = createProjection();
    projection.addEvent('update:firstname', { firstname: 'toto' });

    expect(projection.events().length).toStrictEqual(1);
    expect(projection.values()).toStrictEqual({ firstname: 'toto' });
    expect(projection.sequence()).toStrictEqual(1);
  });
});

describe('projection.revert(n)', () => {
  it('Should revert the last event of the projection', () => {
    const projection = createProjection([], {
      sequence: 0,
      values: { firstname: 'John' },
    });

    projection.addEvent('update:firstname', { firstname: 'toto' });

    projection.revert();
    expect(projection.events().length).toStrictEqual(1);
    expect(projection.values()).toStrictEqual({ firstname: 'John' });
    expect(projection.sequence()).toStrictEqual(0);
  });

  it('Should revert the last 2 events of the projection', () => {
    const projection = createProjection([], {
      sequence: 0,
      values: { firstname: 'John' },
    });

    projection.addEvent('update:firstname', { firstname: 'toto' });
    projection.addEvent('update:firstname', { firstname: 'tata' });
    projection.addEvent('update:firstname', { firstname: 'titi' });

    projection.revert(2);

    expect(projection.events().length).toStrictEqual(3);
    expect(projection.values()).toStrictEqual({ firstname: 'toto' });
    expect(projection.sequence()).toStrictEqual(1);
  });

  it('Should revert to sequence 0 if number is out of range', () => {
    const projection = createProjection([], {
      sequence: 0,
      values: { firstname: 'John' },
    });

    projection.addEvent('update:firstname', { firstname: 'toto' });
    projection.addEvent('update:firstname', { firstname: 'tata' });
    projection.addEvent('update:firstname', { firstname: 'titi' });

    projection.revert(99);

    expect(projection.events().length).toStrictEqual(3);
    expect(projection.values()).toStrictEqual({ firstname: 'John' });
    expect(projection.sequence()).toStrictEqual(0);
  });
});

describe('projection.apply(n)', () => {
  it('Should apply the last event of the projection', () => {
    const projection = createProjection([], {
      sequence: 0,
      values: { firstname: 'John' },
    });

    projection.addEvent('update:firstname', { firstname: 'toto' });
    projection.addEvent('update:firstname', { firstname: 'tata' });
    projection.addEvent('update:firstname', { firstname: 'titi' });

    projection.revert(2);
    expect(projection.sequence()).toStrictEqual(1);

    projection.apply(2);
    expect(projection.events().length).toStrictEqual(3);
    expect(projection.values()).toStrictEqual({ firstname: 'titi' });
    expect(projection.sequence()).toStrictEqual(3);
  });

  it('Should apply until the laster event if number is out of range', () => {
    const projection = createProjection([], {
      sequence: 0,
      values: { firstname: 'John' },
    });

    projection.addEvent('update:firstname', { firstname: 'toto' });
    projection.addEvent('update:firstname', { firstname: 'tata' });
    projection.addEvent('update:firstname', { firstname: 'titi' });

    projection.revert(2);
    expect(projection.sequence()).toStrictEqual(1);

    projection.apply(99);
    expect(projection.events().length).toStrictEqual(3);
    expect(projection.values()).toStrictEqual({ firstname: 'titi' });
    expect(projection.sequence()).toStrictEqual(3);
  });
});

describe('projection.goTo(targetSequence)', () => {
  it('Should move the projection to the target sequence', () => {
    const projection = createProjection([], {
      sequence: 0,
      values: { firstname: 'John' },
    });

    projection.addEvent('update:firstname', { firstname: 'toto' });
    projection.addEvent('update:firstname', { firstname: 'tata' });
    projection.addEvent('update:firstname', { firstname: 'titi' });

    expect(projection.sequence()).toStrictEqual(3);

    projection.goTo(2);
    expect(projection.events().length).toStrictEqual(3);
    expect(projection.sequence()).toStrictEqual(2);
    expect(projection.values()).toStrictEqual({ firstname: 'tata' });
  });

  it('Should move the projection to the target sequence', () => {
    const projection = createProjection([], {
      sequence: 0,
      values: { firstname: 'John' },
    });

    projection.addEvent('update:firstname', { firstname: 'toto' });
    projection.addEvent('update:firstname', { firstname: 'tata' });
    projection.addEvent('update:firstname', { firstname: 'titi' });

    expect(projection.sequence()).toStrictEqual(3);

    projection.goTo(2);
    expect(projection.sequence()).toStrictEqual(2);

    projection.goTo(3);
    expect(projection.sequence()).toStrictEqual(3);
  });
});
