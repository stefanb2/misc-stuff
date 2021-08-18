import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {RootState} from '../app/store';
import {parseDate} from '../utils/time';

import telkku from './provider/telkku';

type ProgramState = {
  channels: Channel[]
  day: Day
  providerId: string
  selectors: SelectorMap
  selectorId: string
}

const initialState: ProgramState = {
  channels: [],
  day: parseDate(),
  providerId: '',
  selectors: {},
  selectorId: '',
}

type ProviderProgramFetchResponse = {
  channels: Channel[]
  selectorId: string
}
type ProviderProgramFetchFn = (day: Day, selectorId?: string) => Promise<ProviderProgramFetchResponse>
type ProviderSelectorsFetchFn = () => Promise<SelectorMap>
type Provider = {
  name: string
  program: ProviderProgramFetchFn
  selectors: ProviderSelectorsFetchFn
}

const providers : { [key: string]:  Provider } = {
  [telkku.name]: telkku,
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
      const provider = providers[providerId]
      if (!provider)
        throw new Error(`Unkown provider ID '${providerId}'`)

      const {channels, selectorId} = await provider.program(day, selectorIdIn)

      return {
        channels,
        day,
        providerId,
        selectorId,
      }
    }
)

export const FETCH_SELECTORS = createAsyncThunk(
  'FETCH_SELECTORS',
  async (providerId: string = defaultProviderId) => {
      const provider = providers[providerId]
      if (!provider)
        throw new Error(`Unkown provider ID '${providerId}'`)

      const selectors = await provider.selectors()

      return {
        providerId,
        selectors,
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
        ...state,
        ...payload,
      }))
      .addCase(FETCH_SELECTORS.fulfilled, (state, {payload}) => ({
        ...state,
        ...payload,
      }))
      // make request errors fatal
      .addCase(FETCH_PROGRAM.rejected, (state, {error}) => {
        throw error
      })
      .addCase(FETCH_SELECTORS.rejected, (state, {error}) => {
        throw error
      })
  },
})

export const programSelector = (state: RootState) => state[programSlice.name]
