
Event sourcing library. Just a workaround to play with event sourcing and learn more about it.

# Creating events :

```js
const evsc = require('events-sourcing')

// Default state if not provided
const state = {
  sequence: 0,
  values: {},
}

const event = evsc.createEvent('user:created', { firstName: 'John' }, state)

event === {
  sequence: 1,
  name: 'user:updated',
  operations: { // These are json-patch operations
    apply: [
      {
        op: 'replace',
        path: '/firstName',
        value: 'John',
      }
    ],
    revert: [
      {
        op: 'remove',
        path: '/firstName',
      }
    ]
  }
}
```

# Applying events :

```js
const evsc = require('events-sourcing')

const state = {
  sequence: 1,
  values: {
    id: 2345,
    email: 'john@test.com',
  },
}

const event = evsc.createEvent('user:updated', { firstName: 'John' }, state)

const newState = evsc.applyEvent(event, state)
newState.values // => { id: 2345, email: 'john@test.com', firstName: 'John' }
newState.sequence // => 2
```

# Reverting events :

```js
const previousState = evsc.revertEvent(event, state)
```

# Aggregates :

```js
const evsc = require('events-sourcing')

const events = [ event1, event2, event3, event4 ]

const aggregate = evsc.aggregate(events)
aggregate.state.sequence // => 4
aggregate.state.values // => State of the aggregate after event4.
aggregate.events // => [ event1, event2, event3, event4 ]

aggregate.addEvent('user:updated', { firstName: 'John' })
aggregate.sequence // => 5
aggregate.values // => { firstName: 'John', ...rest }
aggregate.events // => [ event1, event2, event3, event4, event5 ]

const aggregateV2 = aggregate.version(2)
aggregate.sequence // => 2
aggregate.values // => State of the aggregate after event sequence 2.
```

# Remove a key :

To remove a key from a state set it to undefined.

```js
aggregate.values // => { firstName: 'John', lastName: 'Snow' }
aggregate.addEvent('user:updated', { firstName: undefined })
aggregate.values // => { lastName: 'Snow' }
```

# Nested objects :

`evsc` support nested objects. It use `deepmerge` for that.

```js
aggregate.values // => { user : { firstName: 'John' } }
aggregate.addEvent('user:updated', { user: { lastName: 'Snow' } })
aggregate.values // => { user: { firstName: 'John', lastName: 'Snow' }  }
```