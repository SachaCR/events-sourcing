Event sourcing library. Just a workaround to play with event sourcing and learn more about it.

# Events sequences

- The default state has the sequence 0.
- All events must have a consecutive sequence number. If not an error will be thrown : with `error.code === 'APPLY_EVENT_OUT_OF_SEQUENCE'`

# Projections :

A projection is the results of all events that compose an entity. it expose utilities function to :

- `addEvent()`: Will add a new event to the projection and refresh his state.
- `goTo(n)`: Go to the entity at the time of the event `n`.
- `revert(n)`: Revert `n` events on the projection.
- `apply(n)`: Apply `n` next events on the projection.
- `sequence()`: Return the current sequence number of the projection. You can see that as a version number of the entity.
- `values()`: Return the entity values.
- `events()`: Return the events list of the projection.

```js
const evsc = require('events-sourcing');

const events = [event1, event2, event3, event4];

const projection = evsc.projection(events, state); // state is optional
projection.sequence(); // => 4
projection.values(); // => State of the projection after event4.
projection.events(); // => [ event1, event2, event3, event4 ]

projection.goTo(2);
projection.sequence(); // => 2
projection.values(); // => State of the projection after event sequence 2.
```

# Projection.addEvent() :

This method will create an event push it in the projection events array and apply it to the projection

```js
const evsc = require('events-sourcing');

const events = [event1, event2, event3, event4];

const projection = evsc.projection(events, state); // state is optional
projection.sequence(); // => 4
projection.values(); // => State of the projection after event4.
projection.events(); // => [ event1, event2, event3, event4 ]

projection.addEvent('user:updated', { firstName: 'John' });
projection.sequence(); // => 5
projection.values(); // => { firstName: 'John', ...rest }
projection.events(); // => [ event1, event2, event3, event4, event5 ]
```

# Projection.goTo(targetSequence) :

This method will revert or apply events until matching the targetSequence

```js
const evsc = require('events-sourcing');

const events = [event1, event2, event3, event4];
const projection = evsc.projection(events, state);

projection.goTo(2);
projection.sequence(); // => 2
projection.values(); // => State of the projection after event sequence 2.
```

# Projection.apply(n) :

This method will apply `n` events from the projection

```js
const evsc = require('events-sourcing');

const events = [event1, event2, event3, event4];
const projection = evsc.projection(events, state);

projection.goTo(2);
projection.sequence(); // 2

projection.apply(2); // Will reapply the event 3 and 4
projection.sequence(); // => 4
```

# Projection.revert(n) :

This method will revert `n` events from the projection

```js
const evsc = require('events-sourcing');

const events = [event1, event2, event3, event4];
const projection = evsc.projection(events, state);

projection.revert(2); // Will revert event 3 and 4
projection.sequence(); // => 2
projection.values(); // => State of the projection after event sequence 2.
```

# Creating events :

```js
const evsc = require('events-sourcing');

// Default state if not provided
const state = {
  sequence: 0,
  values: {},
};

const event = evsc.createEvent('user:created', { firstName: 'John' }, state);

// event
{
  sequence: 1,
  name: 'user:updated',
  operations: {
    // These are json-patch operations
    apply: [
      {
        op: 'replace',
        path: '/firstName',
        value: 'John',
      },
    ],
    revert: [
      {
        op: 'remove',
        path: '/firstName',
      },
    ],
  },
};
```

# Applying events :

```js
const evsc = require('events-sourcing');

const state = {
  sequence: 1,
  values: {
    id: 2345,
    email: 'john@test.com',
  },
};

const event = evsc.createEvent('user:updated', { firstName: 'John' }, state);

const newState = evsc.applyEvent(event, state);
newState.values; // => { id: 2345, email: 'john@test.com', firstName: 'John' }
newState.sequence; // => 2
```

# Reverting events :

```js
const previousState = evsc.revertEvent(event, state);
```

# Remove a key :

To remove a key from a state set it to undefined.

```js
projection.values; // => { firstName: 'John', lastName: 'Snow' }
projection.addEvent('user:updated', { firstName: undefined });
projection.values; // => { lastName: 'Snow' }
```

# Nested objects :

`evsc` support nested objects. It use `deepmerge` for that.

```js
projection.values; // => { user : { firstName: 'John' } }
projection.addEvent('user:updated', { user: { lastName: 'Snow' } });
projection.values; // => { user: { firstName: 'John', lastName: 'Snow' }  }
```

# TODOS :

- Validate inputs
- Complete tests on projections
- Rewrite in typescript
- Publish on NPM
- Enforce sequence boundaries to avoid weird behaviors
- Determine the behavior if we add an event on a projection that is currently not in his last sequence state.
