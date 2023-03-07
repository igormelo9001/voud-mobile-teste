/**
 * returns request status for any state
 * @return {Object} isFetching, requested, error, errorStatusCode
 */
export const extractRequestUI = obj => ({
  isFetching: obj.isFetching,
  requested: obj.requested || null,
  error: obj.error,
  errorStatusCode: obj.errorStatusCode || null,
  countAttempt: obj.countAttempt,
});

/**
 * returns merged request status for any state
 * @return {Object} isFetching, requested, error, errorStatusCode
 */
export const mergeRequestUI = objs =>
  objs
    .map(obj => extractRequestUI(obj))
    .reduce(
      (acc, cur) => ({
        isFetching: acc.isFetching ? true : cur.isFetching,
        requested: acc.requested ? acc.requested : cur.requested,
        error: cur.error ? cur.error : acc.error,
        errorStatusCode: cur.errorStatusCode ? cur.errorStatusCode : acc.errorStatusCode,
      }),
      {
        isFetching: false,
        requested: null,
        error: '',
        errorStatusCode: null,
      }
    );
