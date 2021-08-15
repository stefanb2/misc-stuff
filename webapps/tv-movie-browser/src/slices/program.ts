import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {RootState} from '../app/store';
import {parseDate} from '../utils/time';

type ProgramState = {
  channels: Channel[]
  day: Day
  providerId: string
  selectorId: string
}

const initialState: ProgramState = {
  channels: [],
  day: parseDate(),
  providerId: '',
  selectorId: '',
}

export const FETCH_PROGRAM = createAsyncThunk(
  'FETCH_PROGRAM',
  async (
    {day, providerId = '', selectorId = ''} : {
      day: Day,
      providerId?: string,
      selectorId?: string
    }) => ({
      day,
      providerId,
      selectorId,
      channels: [] as Channel[],
    })
)

export const programSlice = createSlice({
  name: 'program',
  initialState,
  reducers: {
    // no synchronous reducers at the moment
  },
  extraReducers: builder => {
    builder
      .addCase(FETCH_PROGRAM.fulfilled, (state, {payload}) => ({
        ...payload,
      }))
      // make request errors fatal
      .addCase(FETCH_PROGRAM.rejected, (state, {error}) => {
        throw error
      })
  },
})

export const programSelector = (state: RootState) => state[programSlice.name]
