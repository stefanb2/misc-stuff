const program = async (day: Day, selectorId?: string) => {
  return {
    channels: [] as Channel[],
    selectorId: '',
  }
}

const selectors = async () => {
  return {}
}

const provider = {
  name: 'telkku',
  program,
  selectors,
}

export default provider
