import fetch from 'cross-fetch'

// Make a HTTP GET request
export const fetchUrl = async function(url) {
  const response = await performFetch(url)

  if (!response.ok) {
    throw new Error(`Could not fetch ${url} (status ${response.status})`)
  }

  return response
}

const performFetch = async function(url) {
  try {
    return await fetch(url)
  } catch (error) {
    throw new Error(`Could not fetch ${url}\n\n${error.stack}`)
  }
}
