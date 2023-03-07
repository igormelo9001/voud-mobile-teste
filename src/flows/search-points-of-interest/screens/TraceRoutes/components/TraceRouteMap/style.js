import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../../../../../styles";

const { height } = Dimensions.get("window");

const Style = StyleSheet.create({
  container: {
    flex: 1
  },
  containerMap: {
    flex: 1
    // height: height / 2
  },
  centerPositionIconContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    width: 40,
    height: 40,
    padding: 8,
    elevation: 5,

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
  modalContent: {
    flex: 1,
    justifyContent: "center",
    margin: "5%"
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)"
  }
});

export default Style;
