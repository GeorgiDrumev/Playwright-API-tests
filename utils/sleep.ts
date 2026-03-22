/**
 * Returns a promise that resolves after the specified number of milliseconds.
 *
 * @param ms - Duration to wait in milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
