const evsc = require('../dist');

const numberOfEvents = 100000;

const reducersMap = [
  {
    event: 'count',
    reducer: (payload, state) => {
      return {
        count: state.count + payload.value,
      };
    },
  },
];

const projection = evsc.createProjection(
  [],
  { sequence: 0, values: { count: 0 } },
  reducersMap,
);

console.log('--------- compute ---------');
const startTime = new Date().getTime();
for (let i = 0; i < numberOfEvents; i++) {
  projection.addEvent('count', { value: 1 });
}
const endTime = new Date().getTime();
console.log('sequence:', projection.sequence());
console.log('values:', projection.values());
console.log('events:', projection.events().length);
console.log('elapsed:', endTime - startTime);

console.log('--------- reset ---------');
const startTime2 = new Date().getTime();
projection.goTo(0);
const endTime2 = new Date().getTime();
console.log('sequence:', projection.sequence());
console.log('values:', projection.values());
console.log('events:', projection.events().length);
console.log('elapsed:', endTime2 - startTime2);

console.log('--------- restore ---------');
const startTime3 = new Date().getTime();
projection.goTo(numberOfEvents);
const endTime3 = new Date().getTime();
console.log('sequence:', projection.sequence());
console.log('values:', projection.values());
console.log('events:', projection.events().length);
console.log('elapsed:', endTime3 - startTime3);

console.log('--------- Goto 1 ---------');
const startTime4 = new Date().getTime();
projection.goTo(1);
const endTime4 = new Date().getTime();
console.log('sequence:', projection.sequence());
console.log('values:', projection.values());
console.log('events:', projection.events().length);
console.log('elapsed:', endTime4 - startTime4);

console.log('--------- Goto last -1 ---------');
const startTime5 = new Date().getTime();
projection.goTo(numberOfEvents - 1);
const endTime5 = new Date().getTime();
console.log('sequence:', projection.sequence());
console.log('values:', projection.values());
console.log('events:', projection.events().length);
console.log('elapsed:', endTime5 - startTime5);

console.log('--------- Goto last / 2 ---------');
const startTime6 = new Date().getTime();
projection.goTo(numberOfEvents / 2);
const endTime6 = new Date().getTime();
console.log('sequence:', projection.sequence());
console.log('values:', projection.values());
console.log('events:', projection.events().length);
console.log('elapsed:', endTime6 - startTime6);
