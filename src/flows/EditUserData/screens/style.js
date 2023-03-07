import { StyleSheet } from 'react-native';
import { colors } from '../../../styles';
import { getPaddingForNotch } from '../../../utils/is-iphone-with-notch';

// Styles
const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  ghostTransaction: {
    paddingHorizontal: 16,
  },
  ghostTransactionText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: colors.GRAY,
  },
  errorMessage: {
    marginTop: 16,
  },
  headerContainer: {
    paddingTop: getPaddingForNotch() + 28,
    backgroundColor: colors.BRAND_PRIMARY,
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 140,
  },
  title: {
    fontSize: 16,
    color: '#FEC10E',
  },
  image: {
    // marginBottom: 32,
  },
});

export default Style;
