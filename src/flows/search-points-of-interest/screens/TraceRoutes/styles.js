import { StyleSheet, Platform, Dimensions } from "react-native";
import { getPixelSize } from "../TraceRoutes/utils";
import { colors } from "../../../../styles";

const { height, width } = Dimensions.get("window");

const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  wrapperHeader: {
    position: "absolute",
    padding: 0,
    top: Platform.select({
      ios: 24,
      android: 24
    }),
    marginLeft: 16,

  },

  backIcon: {
    alignSelf: "center",
    marginRight: 8
  },

  modalContent: {
    backgroundColor: "white",
    // flex: 1,
    // height: height,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    // paddingHorizontal: 40,
    paddingTop: 8,
    paddingBottom: 16,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: {
      height: -2,
      width: 0
    },
    elevation: 3,
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 2
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.GRAY_LIGHT,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 0
  },
  iconVoud: {
    fontSize: 18,
    marginRight: 0,
    color: colors.BRAND_PRIMARY
  },
  handleArea: {
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    padding: 8
  },
  centerPositionIconContainer: {
    backgroundColor: "white",
    borderRadius: 18,
    width: 36,
    height: 36,
    padding: 8,
    elevation: 1,

    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: {
      height: 2,
      width: 0
    },
    alignItems: "center",
    justifyContent: "center"
  },
  centerPositionIcon: {
    color: colors.BRAND_PRIMARY
  },
  wrapperLocation: {
    position: "absolute",
    padding: 0,
    top: 0,
    marginLeft: 24
  },
  handleArea: {
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    padding: 8
  },
  icon:{
    color: colors.GRAY_LIGHT,
  }
});

export default Style;
