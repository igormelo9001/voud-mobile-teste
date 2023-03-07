import { StyleSheet } from 'react-native';
import { getPaddingForNotch } from '../../../utils/is-iphone-with-notch';
import { colors } from '../../../styles';

const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
  contianerDescription: {
    marginTop: 24,
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    color: '#393939',
  },
  containerButton: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  button: {
    height: 48,
  },
  containerSupport: {
    alignItems: 'center',
    marginTop: 15,
    height: 20,
    justifyContent: 'center',
  },
  textSupport: {
    fontSize: 11,
    color: '#6E3E91',
    fontWeight: 'bold',
  },
});

export default Style;
