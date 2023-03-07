
import 'react-native';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';

import React from 'react';

const { JSDOM } = require('jsdom');

import 'react-native/Libraries/Animated/src/bezier';

// Mock Reactotron
console.tron = { log: jest.fn() };

// Enzyme configuration
Enzyme.configure({ adapter: new Adapter() });

// uuidv4
jest.mock('./src/utils/uuid-util.js', () => ({
	uuidv4: () => {
		return 'test-uid';
	}
}));

jest.mock('react-native-linear-gradient', () => {
	jest.fn();
});

jest.mock('react-native-splash-screen', () => {
	jest.fn();
});

