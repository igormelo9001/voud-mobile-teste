import { StyleSheet, PixelRatio } from "react-native";
import { getPaddingForNotch } from "../../../../utils/is-iphone-with-notch";
import { colors } from "../../../../styles";

const Style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white"
  },
  headerContainer: {
    paddingTop: getPaddingForNotch() + 48,
    backgroundColor: colors.BRAND_SUCCESS,
    alignItems: "center",
    paddingHorizontal: 16
  },
  scrollView: {
    flex: 1
  },
  scrollViewContainer: {
    flexGrow: 1
    // padding: 16,
  },
  closeIcon: {
    color: "white",
    width: 24,
    fontSize: 24,
    position: "absolute",
    top: 40,
    left: 16
  },
  successIcon: {
    color: "white",
    width: 72,
    fontSize: 72,
    marginBottom: 16
  },
  purchaseValue: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 32,
    lineHeight: 32,
    marginBottom: 8
  },
  purchaseValueNormal: {
    fontWeight: "normal"
  },
  successTitle: {
    color: "white",
    fontSize: 20,
    lineHeight: 28,
    textAlign: "center",
    padding: 24
  },
  text: {
    color: colors.GRAY,
    fontSize: 16,
    lineHeight: 24
  },
  imageContainer: {
    alignItems: "center"
  },
  image: {
    marginTop: -63
  },
  actionBtnContainer: {
    padding: 16,
    // flex: 1,
    justifyContent: "flex-end"
  },
  containerTitle: {
    marginBottom: 87,
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 4
    // flex: 1
  },
  description: {
    color: "#FFF",
    fontSize: PixelRatio.get() === 2 ? 13.5 : 15
  },
  textStation: {
    fontSize: 16,
    color: "#757575"
  },
  textTitle: {
    fontSize: 18,
    color: "#6E3E91",
    fontWeight: "bold"
  },
  containerStation: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16
  }
});

export default Style;
