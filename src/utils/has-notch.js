import DeviceInfo from 'react-native-device-info';

const iphonesWithNotch = [
  'iPhone X',
  'iPhone XS',
  'iPhone XS Max',
  'iPhone XR',
];

export const hasNotch = () => iphonesWithNotch.some(
  iphone => iphone === DeviceInfo.getModel()
);