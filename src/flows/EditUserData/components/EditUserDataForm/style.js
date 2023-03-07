import { StyleSheet } from 'react-native';
import { colors } from '../../../../styles';
import { getPaddingForNotch } from '../../../../utils/is-iphone-with-notch';

// styles
const Style = StyleSheet.create({
  text: {
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
    color: colors.GRAY,
  },
  errorMessage: {
    marginTop: 16,
  },
  button: {
    marginTop: 24,
  },
  headerContainer: {
    paddingTop: getPaddingForNotch() + 48,
    backgroundColor: colors.BRAND_PRIMARY,
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 265,
  },
  title: {
    fontSize: 16,
    color: '#FEC10E',
  },
  image: {
    marginTop: 32,
  },
});

export default Style;
