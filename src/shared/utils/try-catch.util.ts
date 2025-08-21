// src/common/utils/try-catch-wrapper.ts

/**
 * 예외를 잡고 다시 throw 하는 유틸 (FacadeService 전용)
 */
export async function tryCatchThrow<T>(
  fn: () => Promise<T>,
  onError?: (e: any) => void,
): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    onError?.(e);
    throw e;
  }
}
