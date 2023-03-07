import { StyleSheet } from "react-native";
import { colors } from "../../../../styles";

const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  containerDescription: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 24,
    flexDirection: "row"
  },
  textDescription: {
    color: "#707070",
    fontSize: 14
  },
  containerButtonNext: {
    // paddingHorizontal: 16,
    // paddingVertical: 24,
    // borderTopWidth: 1,
    // borderColor: colors.GRAY_LIGHTER
  },
  errorMessage: {
    marginTop: 8
  }
});

export default Style;
