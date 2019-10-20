// We don't print child process stdout|stderr when there is none.
// We ensure a single newline at the end by using Execa
// `stripFinalNewline: true` then appending a newline.
export const writeProcessOutput = function(output, stream) {
  if (output.trim() === '') {
    return
  }

  stream.write(`${output}\n`)
}
