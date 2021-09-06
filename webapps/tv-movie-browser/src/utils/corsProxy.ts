import {get as origGet} from './apiRequest'

import {corsProxy} from '../config.json'

const {
  hostname = document.location.hostname,
  port,
  protocol = '',
} = corsProxy as {
  hostname?: string
  port: number
  protocol?: string
}

const proxyURL = `${protocol}//${hostname}:${port}`

type FetchOptions = {
  headers?: object
}

export const get = async (url: string, fetchOptions?: FetchOptions) =>
  origGet(proxyURL, {
    ...fetchOptions,
    headers: {
      ...fetchOptions?.headers,
      'X-Forward-To': url,
    }
  })
