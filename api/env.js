export default (key, fallback, crashFree = false) => {
  const value = process.env[key]
  if (value !== undefined)
    return value
  if (fallback === undefined && !crashFree)
    throw new Error(`${key} must be set`)
  return fallback
}
