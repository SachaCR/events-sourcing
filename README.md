Event sourcing library.

This library allow you to create projection object that result from a list of events. To compute your events you need to attach reducer for each event types. Your reducer must be pure and return an object that reflect the update that you want to apply to your projection.

# Projection(events, state, reducers) :

- events: `optional` array of events. Default value: [].
- state: `optional` object. Default value: { sequence: 0, values:{} }
- reducers: `optional` array. Default value: []

```js
const evsc = require('events-sourcing');

const events = [
  {
    // Event1
    sequence: 1
    type: 'add:money',
    payload: { amount: 10 },
  },
];

const reducers = [{
  event: 'add:money',
  reducer: (payload, state) => {
    return { balance: state.balance + payload.amount };
  },
}];

const state = { sequence: 0, balance: 0 };

const projection = evsc.projection(events, state, reducers);
projection.sequence(); // => 1
projection.values(); // => { balance: 10 }
projection.events(); // => [ Event1 ]
```

This will return a projection objcet which is the results of all events that compose an entity. A projection will expose these functions :

- `addReducer(eventType, reducer)`: Will attach a reducer function to an event type.
- `addEvent(eventType, payload)`: Will add a new event to the projection and refresh his state. Throw an error if no reducer is found.
- `goTo(n)`: Go to the entity at the time of the event `n`.
- `revert(n)`: Revert `n` events on the projection.
- `apply(n)`: Apply `n` next events on the projection.
- `sequence()`: Return the current sequence number of the projection. You can see that as a version number of the entity.
- `values()`: Return the entity values.
- `events()`: Return the events list of the projection.
- `reducers()`: Return the reducers object map.

# Projection.addReducer(eventType, reducer) :

This method will attach a reducer function to an event type.

- EventType is a string
- Reducer must be a pure function

You can replace a reducer by a new version but in this case you will need to replay all events to get the state computed with your new reducer implementation

```js
const evsc = require('events-sourcing');

const projection = evsc.projection([], { balance: 0 });

projection.addReducer('add:money', (payload, state) => {
  return {
    balance: state.balance + payload.amount,
  };
});

projection.addEvent('add:money', { amount: 10 });
projection.values(); // { balance: 10 }
projection.sequence(); // 1
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

# Events sequences

- The default state has the sequence 0.
- All events must have a consecutive sequence number. If not an error will be thrown : with `error.code === 'APPLY_EVENT_OUT_OF_SEQUENCE'`

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

- Rewrite in typescript [DONE]

- Validate inputs
- Complete tests on projections
- Publish on NPM
- Enforce sequence boundaries to avoid weird behaviors
- Determine the behavior if we add an event on a projection that is currently not in his last sequence state.
- Determine the fastest path in goTo method
- Replay events on reducers updates
