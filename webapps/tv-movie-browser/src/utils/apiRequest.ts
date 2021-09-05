export const get = async (url: string, fetchOptions?: object) => {
  const response = await fetch(url, {
    cache: 'no-cache',
    method: 'GET',
    ...fetchOptions,
  })

  if (!response.ok)
    throw new Error(response.statusText)

  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json'))
    throw new TypeError('expected JSON response')

  return response.json()
}
