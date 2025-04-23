import { createReducer, on } from '@ngrx/store';
import { addRemainder, updateStore } from './actions';

export const intilaState: any[] = [];

export const reducer = createReducer(
  intilaState,
  on(addRemainder, (state: any, action: any) => [...state, ...action.value]),
  on(updateStore, (state, action) => [...action.value])
);
