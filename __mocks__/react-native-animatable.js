const reactnativeanimatable = {
    View: jest.fn(),
	initializeRegistryWithDefinitions: jest.fn(),
	registerAnimation: jest.fn(),
	createAnimation: jest.fn()
};

export const {
    View,
    initializeRegistryWithDefinitions,
    registerAnimation,
    createAnimation
} = reactnativeanimatable;