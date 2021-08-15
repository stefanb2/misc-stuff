import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import {createLogger} from 'redux-logger';

import {programSlice} from '../slices/program';

const logger = createLogger({
  collapsed: true,
});

export const store = configureStore({
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(
    logger,
  ),
  reducer: {
    [programSlice.name]: programSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
