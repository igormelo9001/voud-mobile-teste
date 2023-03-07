export const mockFetch = (ok, data, status) => {
  return jest.fn(() =>
    Promise.resolve({
      ok,
      status,
      json: () => data,
      headers: {
        get: jest.fn()
      },
    })
  );
}