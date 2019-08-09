import { Operation } from 'fast-json-patch';

export type Event = {
  sequence: number;
  type: string;
  payload: any;
};

export type State = {
  sequence: number;
  values: any;
  events: Array<Event>;
  reducers: Map<string, (paylaod: any, stateValues: any) => any>;
  patchs: Array<Patch>;
};

export type BasicState = {
  sequence: number;
  values: any;
};

export type Patch = {
  sequence: number;
  type: string;
  operations: {
    apply: Array<Operation>;
    revert: Array<Operation>;
  };
};

export type Projection = {
  sequence: () => number;
  values: () => any;
  events: () => Array<Event>;
  reducers: () => Map<string, (payload: any, stateValues: any) => any>;
  addReducer: (
    eventType: string,
    reducer: (payload: any, stateValues: any) => any,
  ) => any;
  addEvent: (eventType: string, payload: any) => void;
  revert: (n: number) => void;
  apply: (n: number) => void;
  goTo: (targetSequence: number) => void;
};
