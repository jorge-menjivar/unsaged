import { useMemo, useReducer } from 'react';

// Extracts property names from initial state of reducer to allow typesafe dispatch objects
export type FieldNames<T> = {
  [K in keyof T]: T[K] extends string ? K : K;
}[keyof T];

// Define the Action type with type annotations
export type ActionType<T> =
  | { type: 'reset' }
  | { type: 'change'; field: FieldNames<T>; value: any };

// Returns a typed dispatch and state
export const useCreateReducer = <T>({ initialState }: { initialState: T }) => {
  const reducer = (state: T, action: ActionType<T>) => {
    if (action.type === 'change') {
      return { ...state, [action.field]: action.value };
    }

    if (action.type === 'reset') {
      return initialState;
    }

    throw new Error('Unsupported action type');
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return useMemo(() => ({ state, dispatch }), [state, dispatch]);
};
