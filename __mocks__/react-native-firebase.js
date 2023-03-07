const reactnativefirebase = {
  notifications: jest.fn(() => ({
    setBadge: jest.fn()
  })),
  analytics: jest.fn(() => ({
    logEvent: jest.fn()
  })),
  config: jest.fn(() => ({
    enableDeveloperMode: jest.fn()
  }))
};

export const { notifications, analytics, config } = reactnativefirebase;
