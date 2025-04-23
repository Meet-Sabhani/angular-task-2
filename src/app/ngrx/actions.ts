import { createAction, props } from '@ngrx/store';

export const addRemainder = createAction('ADD_TASk', props<{ value: any[] }>());

export const updateStore = createAction(
  'UPDATE_STORE',
  props<{ value: any[] }>()
);
