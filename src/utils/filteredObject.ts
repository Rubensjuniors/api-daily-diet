/* eslint-disable @typescript-eslint/no-unused-vars */
export function filteredObeject(obj: object) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => value !== undefined),
  )
}
