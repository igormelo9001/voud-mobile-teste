import { StyleSheet } from 'react-native';
import { getPaddingForNotch } from '../../../utils/is-iphone-with-notch';

const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  unity: {
    height: 56,
    width: 79,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerUnity: {
    flexDirection: 'row',
    padding: 6,
  },
  text: {
    fontSize: 18,
    color: '#C0C0C0',
    fontWeight: 'bold',
  },
  containerButton: {
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingBottom: getPaddingForNotch(),
  },
  content: {
    flexGrow: 1,
  },
});

export default Style;
