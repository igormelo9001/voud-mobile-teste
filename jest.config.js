// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	clearMocks: true,
	preset: 'react-native',
	coverageDirectory: 'coverage',
	transform: {
		'^.+\\.(js)$': '<rootDir>/node_modules/babel-jest',
		'^.+\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
		'^.+\\.[jt]sx?$': require.resolve('babel-jest')
	},
	testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
	testPathIgnorePatterns: [ '\\.snap$', '<rootDir>/node_modules/', '<rootDir>/lib/', '<rootDir>/src' ],
	cacheDirectory: '.jest/cache',
	transformIgnorePatterns: [ '<rootDir>/node_modules/(?!react-native)' ],
	setupFiles: [ '<rootDir>/setup.js' ],

	moduleNameMapper: {
		'^image![a-zA-Z0-9$_-]+$': 'GlobalImageStub',
		'^[./a-zA-Z0-9$_-]+\\.png$': '<rootDir>/__mocks__/images-stub.js',
	}
};
