const reactnavigation = {
    TabRouter: jest.fn(),
	createNavigator: () => jest.fn(),
	StackNavigator: () => ({
		navigationOptions: () => ({}),
		router: { getStateForAction: jest.fn() }
	}),
	NavigationActions: { init: () => jest.fn() }
};

export const {
    TabRouter,
    createNavigator,
    StackNavigator,
    NavigationActions,
} = reactnavigation;