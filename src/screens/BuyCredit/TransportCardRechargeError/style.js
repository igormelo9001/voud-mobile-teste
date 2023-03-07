import { StyleSheet } from "react-native";
import { colors } from "../../../styles";

const Style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white"
  },
  headerContainer: {
    paddingTop: 62,
    backgroundColor: "#F94949",
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
    color: "white",
    width: 24,
    fontSize: 24,
    position: "absolute",
    top: 40,
    left: 16
  },
  attentionIcon: {
    color: "white",
    width: 72,
    fontSize: 72,
    marginTop: 16,
    marginBottom: 14
  },
  errorTitle: {
    color: "white",
    fontSize: 18,
    lineHeight: 28,
    textAlign: "center",
    // marginBottom: 93,
    fontWeight: "bold"
  },
  errorDetailText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 4
  },
  cardsErrorImageContainer: {
    alignItems: "center"
    // marginTop: 54,
  },
  cardsErrorImage: {
    marginTop: -57
  },
  actionBtnContainer: {
    padding: 16,
    flex: 1,
    justifyContent: "flex-end"
  },
  cancelButton: {
    marginTop: 16
  },
  codesText: {
    marginTop: 16,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    color: colors.GRAY
  }
});

export default Style;
