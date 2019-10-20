// TODO: use `async-iterator-all` package instead after dropping support for
// Node 8/9
export const asyncIteratorAll = async function(iterator) {
  const array = []

  // eslint-disable-next-line fp/no-loops
  for await (const value of iterator) {
    // eslint-disable-next-line fp/no-mutating-methods
    array.push(value)
  }

  return array
}
