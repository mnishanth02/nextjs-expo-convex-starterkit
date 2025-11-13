/**
 * Generate a unique ID with optional prefix
 * Uses timestamp and random string for uniqueness
 *
 * @param prefix - Optional prefix for the ID (default: "id")
 * @returns Unique ID string
 *
 * @example
 * ```typescript
 * const taskId = generateUniqueId("task")
 * // => "task-lk3j2k1-9a8b7c"
 *
 * const userId = generateUniqueId("user")
 * // => "user-lk3j2k2-1d2e3f"
 *
 * const id = generateUniqueId()
 * // => "id-lk3j2k3-4g5h6i"
 * ```
 */
export function generateUniqueId(prefix = "id"): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 8)
  return `${prefix}-${timestamp}-${randomPart}`
}
