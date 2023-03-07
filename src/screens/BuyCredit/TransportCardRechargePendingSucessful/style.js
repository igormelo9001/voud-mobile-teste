import { StyleSheet, PixelRatio } from "react-native";
import { colors } from "../../../styles";
import { getPaddingForNotch } from "../../../utils/is-iphone-with-notch";
import { normalize } from "../../../utils/string-util";

const Style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white"
  },
  headerContainer: {
    paddingTop: getPaddingForNotch() + 48,
    // backgroundColor: colors.BRAND_SUCCESS,
    backgroundColor: "#FFCF2F",
    alignItems: "center",
    paddingHorizontal: 16
  },
  scrollView: {
    flex: 1
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 16
  },
  closeIcon: {
    color: "#6E3E91",
    width: 24,
    fontSize: 24,
    position: "absolute",
    top: 40,
    left: 16
  },
  successIcon: {
    color: "#6E3E91",
    width: 72,
    fontSize: 72,
    marginBottom: 8
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
    color: "#6E3E91",
    fontSize: 18,
    lineHeight: 30,
    textAlign: "center",
    fontWeight: "bold"
    // marginBottom: 121
  },
  successTitleSmartPurchase: {
    color: "#6E3E91",
    fontSize: 20,
    lineHeight: 28,
    textAlign: "center"
    // marginBottom: 80
  },
  purchaseValidationText: {
    color: "#6E3E91",
    fontSize: 15,
    lineHeight: 20
  },
  fontBold: {
    fontWeight: "bold"
  },
  purchaseImageContainer: {
    alignItems: "center"
  },
  validatorImage: {
    marginTop: -63,
    width: 114,
    height: 126
  },
  smartPurchaseCalendarImage: {
    marginTop: -56,
    width: 112,
    height: 112
  },
  actionBtnContainer: {
    padding: 16
  },
  servicePointsText: {
    fontWeight: "bold",
    color: colors.BRAND_PRIMARY
  },
  textTitle: {
    alignItems: "center",
    marginBottom: 97,
    marginTop: 4
  },
  description: {
    fontSize: PixelRatio.get() === 2 ? 13 : 15,
    lineHeight: 24,
    color: "#1D1D1D"
  },
  containerDescription: {
    height: 96,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Style;
