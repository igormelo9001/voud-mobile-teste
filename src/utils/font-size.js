// PixelRatio.get() === 1
// mdpi Android devices
// PixelRatio.get() === 1.5
// hdpi Android devices
// PixelRatio.get() === 2
// iPhone 4, 4S
// iPhone 5, 5C, 5S
// iPhone 6, 7, 8
// iPhone XR
// xhdpi Android devices
// PixelRatio.get() === 3
// iPhone 6 Plus, 7 Plus, 8 Plus
// iPhone X, XS, XS Max
// Pixel, Pixel 2
// xxhdpi Android devices
// PixelRatio.get() === 3.5
// Nexus 6
// Pixel XL, Pixel 2 XL
// xxxhdpi Android devices

import { PixelRatio } from 'react-native';

export const GetFontSizeRatio = () => {
	const PIXEL_RATIO = PixelRatio.get();
	const pixelRatioParsed = parseFloat(parseFloat(PIXEL_RATIO).toPrecision(2));

	let FONT_TITLE = 14;
	let FONT_MAX = 12;
	let FONT_AVERAGE = 10;
	let FONT_MIN = 8;

	if (pixelRatioParsed > 1 && pixelRatioParsed < 2 ) {
		FONT_TITLE = 16;
		FONT_MAX = 14;
		FONT_AVERAGE = 12;
		FONT_MIN = 10;
	} else if (pixelRatioParsed >= 2 && pixelRatioParsed < 2.5) {
		FONT_TITLE = 18;
		FONT_MAX = 16;
		FONT_AVERAGE = 14;
		FONT_MIN = 12;
	} else if (pixelRatioParsed >= 2.5 && pixelRatioParsed < 3) {
		FONT_TITLE = 20;
		FONT_MAX = 18;
		FONT_AVERAGE = 16;
		FONT_MIN = 14;
	} else if (pixelRatioParsed >= 3) {
		FONT_TITLE = 22;
		FONT_MAX = 20;
		FONT_AVERAGE = 18;
		FONT_MIN = 16;
	}

	return {
		FONT_TITLE,
		FONT_MAX,
		FONT_AVERAGE,
		FONT_MIN,
		PIXEL_RATIO
	};
};
