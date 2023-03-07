const reactnative = {
	AsyncStorage:{
		getItem: jest.fn(),
		setItem: jest.fn()

	},
	BackHandler: {
		addEventListener: jest.fn()
	},
	StyleSheet: {
		create: (params) => {
			return params;
		},
		flatten: () => ({})
	},
	TouchableOpacity: {
		displayName: jest.fn(),
		name: jest.fn()
	},
	TouchableNativeFeedback: {
		SelectableBackground: jest.fn()
	},
	PanResponder: {
		getLayout: () => ({}),
		create: (params) => {
			return params;
		}
	},
	DeviceEventEmitter: {
		addListener: jest.fn()
	},
	Animated: {
		event: () => ({}),

		ValueXY: () => ({
			getLayout: () => jest.fn(),
			setValue: (params) => {
				return params;
			},
		}),
		Value: () => ({
			interpolate: () => jest.fn()
		}),
		timing: () => ({
			start: () => ({})
		}),
		loop: () => ({
			start: () => ({})
		}),
		Text: () => ({})
	},
	Dimensions: {
		get: () => jest.fn()
	},
	Platform: {
		OS: 'iOS',
		select: () => jest.fn()
	},
	View: {
		propTypes: {}
	},
	Text: {
		propTypes: {}
	},
	NativeModules: {
		RNAdyenCse: () => {
			return 120931039210392109
		}
	},
	StatusBar: {
		currentHeight: 100
	},
	Easing: {
		linear: jest.fn(),
		out: () => jest.fn({})
	},
	Modal: () => jest.fn(),
	Image: () => jest.fn(),
	Keyboard: () => jest.fn(),
	ScrollView: () => jest.fn()
};

export const {
	StyleSheet,
	Animated,
	Platform,
	TouchableOpacity,
	TouchableNativeFeedback,
	Dimensions,
	View,
	StatusBar,
	Easing,
	Modal,
	Image,
	Keyboard,
	ScrollView,
	PanResponder,
	BackHandler,
	DeviceEventEmitter,
	NativeModules,
	AsyncStorage
} = reactnative;
