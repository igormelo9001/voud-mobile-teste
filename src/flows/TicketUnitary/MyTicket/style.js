import { StyleSheet } from "react-native";
import { colors } from "../../../styles";

const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  containerButton: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 16,
    marginRight: 16
  },
  button: {
    height: 56,
    borderWidth: 1,
    borderRadius: 5,
    // borderColor: '#A84D97',
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 8
  },
  title: {
    fontSize: 18,
    // color: '#A84D97',
    fontWeight: "bold"
  },
  description: {
    fontSize: 16,
    color: "#FFF",
    height: 19,
    lineHeight: 19
  },
  containerDescription: {
    alignItems: "center",
    justifyContent: "center"
    // marginTop: 24,
  },
  titleExtract: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Raleway",
    lineHeight: 16,
    marginBottom: 8
  },
  containerContent: {
    // flex: 1
    // marginTop: 16
    // marginBottom: 16
  },
  buttonPurchase: {
    marginTop: 16,
    paddingHorizontal: 16,
    marginBottom: 16
  },
  pagerDot: {
    width: 11,
    height: 11,
    borderRadius: 11,
    margin: 5
  },
  containerSwipper: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 4
  },
  pagination: {
    bottom: 10
  },
  containerCard: {
    flex: 1,
    padding: 5
  },
  dot: {
    // backgroundColor: "#FFF",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  },
  stateMessage: {
    flexDirection: "row",
    paddingVertical: 24,
    marginLeft: 8
  },
  stateIcon: {
    height: 40,
    width: 40
  },
  errorStateTextContainer: {
    marginLeft: 16
  },
  errorStateText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 24,
    color: colors.GRAY
  },
  errorStateButton: {
    minHeight: 24,
    alignItems: "flex-start",
    paddingHorizontal: 0,
    paddingVertical: 0
  },
  emptyStateText: {
    margin: 8,
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 24,
    color: colors.GRAY
  },
  loaderContainer: {
    marginTop: 24,
    alignSelf: "stretch"
  },
  loader: {
    alignSelf: "center",
    justifyContent: "center"
  },
  titleLoading: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Raleway",
    lineHeight: 16
  },
  containerLastMove: {
    height: 52,
    backgroundColor: "#EAEAEA",
    // marginTop: 8,
    justifyContent: "center"
  },
  textLastMove: {
    fontSize: 17,
    color: colors.BRAND_PRIMARY,
    fontWeight: "bold",
    marginLeft: 16
  },
  containerResultLastMove: {
    // flex: 1,
    paddingVertical: 8
  },
  containerEmptyQrCode: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    borderWidth: 1.3,
    borderRadius: 5,
    borderStyle: "dashed",
    borderColor: "#dadada",
    height: 71
  },
  containerDot: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    flexDirection: "row"
  }
});

export default Style;
