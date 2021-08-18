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

type ProviderProgramFetchFn = (day: Day, selectorId: string) => Promise<Channel[]>
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

type FetchProgramResponse = {
  channels: Channel[]
  day: Day
  providerId: string
  selectorId: string
}
export const FETCH_PROGRAM = createAsyncThunk<
  FetchProgramResponse,
  {
    day: Day,
    providerId?: string,
    selectorId?: string,
  },
  {state: RootState}
>(
  'FETCH_PROGRAM',
  async (
    {
      day,
      providerId = defaultProviderId,
      selectorId = '',
    },
    {getState}
  ) => {
    const provider = providers[providerId]
    if (!provider)
      throw new Error(`Unkown provider ID '${providerId}'`)

    const {program: {selectors}} = getState()
    const selector = selectorId ? selectors[selectorId] : Object.values(selectors)[0]
    if (!selector)
      throw new Error(`Unknown selector ID '${selectorId}'`)

    const {id, slug} = selector
    const channels = await provider.program(day, id)

    return {
      channels,
      day,
      providerId,
      selectorId: slug,
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
