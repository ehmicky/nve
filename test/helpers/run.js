import { runVersions } from '../../src/main.js'

// eslint-disable-next-line max-params
export const runFirstVersion = async function(
  versionRange,
  command,
  args,
  opts,
) {
  const iterator = await runVersions([versionRange], command, args, opts)
  const { value } = await iterator.next()
  await iterator.next()
  return value
}
