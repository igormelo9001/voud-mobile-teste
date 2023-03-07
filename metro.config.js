/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const blacklist = require('metro-config/src/defaults/blacklist')

module.exports = {
  transformer: {
     resolver:  {
        blacklistRE: blacklist([/dist\/.*/]),
      blacklistRE: blacklist([/\/node_modules\/react-native-smisdk-plugin\/node_modules\/.*/])
     },
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
