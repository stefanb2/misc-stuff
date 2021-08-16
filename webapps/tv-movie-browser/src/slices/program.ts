import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {RootState} from '../app/store';
import {parseDate} from '../utils/time';

import telkku from './provider/telkku';

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

type ProviderFetchResult = {
  channels: Channel[]
  selectorId: string
}

type ProviderFetchFn = (day: Day, selectorId?: string) => Promise<ProviderFetchResult>

const providers : { [key: string]:  ProviderFetchFn } = {
  'telkku': telkku,
}
const defaultProviderId = Object.keys(providers)[0];

export const FETCH_PROGRAM = createAsyncThunk(
  'FETCH_PROGRAM',
  async (
    {
      day,
      providerId = defaultProviderId,
      selectorId: selectorIdIn,
    } : {
      day: Day,
      providerId?: string,
      selectorId?: string,
    }) => {
      const providerFn = providers[providerId]
      if (!providerFn)
        throw new Error(`Unkown provider ID '${providerId}'`)

      const {channels, selectorId} = await providerFn(day, selectorIdIn)

      return {
        channels,
        day,
        providerId,
        selectorId,
      }
    }
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
