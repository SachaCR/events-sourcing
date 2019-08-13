const evsc = require('../dist');

const numberOfEvents = 10000; // Max call stack reach at 6596 events

const reducersMap = [
  {
    event: 'count',
    reducer: (payload, state) => {
      return { count: state.count + payload.value };
    },
  },
];

const projection = evsc.createProjection(
  [],
  { sequence: 0, values: { count: 0 } },
  reducersMap,
);

console.log('---------compute---------');
const startTime = new Date().getTime();
for (let i = 0; i < numberOfEvents; i++) {
  projection.addEvent('count', { value: 1 });
}
const endTime = new Date().getTime();
console.log('sequence:', projection.sequence());
console.log('values:', projection.values());
console.log('events:', projection.events().length);
console.log('elapsed:', endTime - startTime);

console.log('---------reset---------');
const startTime2 = new Date().getTime();
projection.goTo(0);
const endTime2 = new Date().getTime();
console.log('sequence:', projection.sequence());
console.log('values:', projection.values());
console.log('events:', projection.events().length);
console.log('elapsed:', endTime2 - startTime2);

console.log('---------restore---------');
const startTime3 = new Date().getTime();
projection.goTo(numberOfEvents);
const endTime3 = new Date().getTime();
console.log('sequence:', projection.sequence());
console.log('values:', projection.values());
console.log('events:', projection.events().length);
console.log('elapsed:', endTime3 - startTime3);
