export function ok<T>(data: T, message: string | null = null) {
  return { success: true, message, error: null, data }
}
export function fail(error: string, message: string | null = null) {
  return { success: false, message, error, data: null }
}
