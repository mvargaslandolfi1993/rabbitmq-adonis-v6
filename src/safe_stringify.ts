import fastSafeStringify from 'fast-safe-stringify'

function replacer(_: any, value: any) {
  if (value === '[Circular]') {
    return
  }

  return value
}

export default function safeStringify(value: any) {
  return fastSafeStringify.default(value, replacer)
}
