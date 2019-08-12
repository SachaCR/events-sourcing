function eventReducer(state) {
  return function applyReducer(eventType, reducer) {
    state.reducers[eventType] = reducer;
  };
}

module.exports = eventReducer;
