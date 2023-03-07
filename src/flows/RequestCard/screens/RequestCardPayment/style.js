import { StyleSheet, Platform } from 'react-native';

const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  containerPrice: {
    marginTop: 32,
    marginHorizontal: 16,
  },
  textDelivery: {
    lineHeight: 16,
    fontSize: 12,
    color: '#A84D97',
  },
  price: {
    marginTop: 4,
    color: '#1D1D1D',
    lineHeight: 40,
    fontSize: 32,
  },
  containerAddress: {
    backgroundColor: '#EAEAEA',
    height: 48,
    flexDirection: 'row',
    marginTop: 33,
    alignItems: 'center',
  },
  textAddress: {
    color: '#6D3E91',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  address: {
    height: 70,
    width: 328,
    color: '#1D1D1D',
    fontSize: 16,
    lineHeight: 24,
    marginHorizontal: 16,
    marginTop: 16,
  },
  containerPaymentMethod: {
    marginTop: 90,
    height: 77,
    // alignItems:"center",
    // justifyContent:"center",
  },
  continerPriceDelivery: {
    flex: 1,
    backgroundColor: '#A84D97',
  },
  containerDescriptionPriceDelivery: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 15,
  },
  textPriceDelivery: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 16,
  },
  textPrice: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  line: {
    height: 1,
    backgroundColor: '#FDC300',
    marginLeft: 16,
    marginRight: 20,
    marginTop: 18,
  },
  containerPriceTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
  },
  descriptionPriceTotal: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 16,
    fontWeight: 'bold',
  },
  priceTotal: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  containerButton: {
    marginTop: 18,
    padding: 16,
    marginBottom: 22,
    // marginHorizontal: 16,
    // ...Platform.select({
    //   ios: {
    //     marginBottom: 50,
    //   },
    //   android: {
    //     marginBottom: 16,
    //   },
    // })
  },
});

export default Style;
