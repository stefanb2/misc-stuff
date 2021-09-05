import {get} from '../../utils/apiRequest'

const apiPath = 'https://www.telkku.com/api'

const program = async (day: Day, selectorId: string) => {
  return []
}

type ChannelGroup = {
  name: string
  slug: string
}

type ChannelGroupsAPIResponse = {
  response: ChannelGroup[]
}

const selectors = async () => {
  const {response: groups} = await get(`${apiPath}/channel-groups`) as ChannelGroupsAPIResponse

  return groups.reduce<SelectorMap>(
    (a, {name: id, slug}) => {
      a[slug] = {id, slug}
      return a
    },
    {}
  )
}

const provider: Provider = {
  name: 'telkku',
  program,
  selectors,
}

export default provider
