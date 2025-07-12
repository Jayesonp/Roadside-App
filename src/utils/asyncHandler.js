/**
 * Async error handler wrapper
 * Eliminates the need for try-catch blocks in route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};