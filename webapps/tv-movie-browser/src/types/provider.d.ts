type ProviderProgramFetchFn = (day: Day, selectorId: string) => Promise<Channel[]>

type ProviderSelectorsFetchFn = () => Promise<SelectorMap>

type Provider = {
  name: string
  program: ProviderProgramFetchFn
  selectors: ProviderSelectorsFetchFn
}
