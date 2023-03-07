import { StyleSheet } from "react-native";
import { getPaddingForNotch } from "../../../../utils/is-iphone-with-notch";
import { colors } from "../../../../styles";

const Style = StyleSheet.create({
  headerContainer: {
    paddingTop: getPaddingForNotch() + 48,
    backgroundColor: colors.BRAND_SUCCESS,
    alignItems: "center",
    paddingHorizontal: 16,
    height: 265
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
  successTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "normal",
    lineHeight: 28,
    textAlign: "center"
  },
  continerImage: {
    height: 120,
    alignItems: "center",
    padding: 10,
    elevation: 0,
    position: "absolute",
    left: 0,
    right: 0,
    top: 205,
    bottom: 0
  },
  containerDescriptionPrimary: {
    marginTop: 60,
    marginHorizontal: 18,
    justifyContent: "flex-start"
  },
  text: {
    color: "#757575",
    fontSize: 16
  },
  containerDescriptionSecondary: {
    marginTop: 23,
    marginHorizontal: 18,
    alignItems: "flex-start",
    justifyContent: "flex-start"
  }
});

export default Style;
