import { StyleSheet } from "react-native";

const Style = StyleSheet.create({
  container: {
    flex: 1
    // backgroundColor: '#014382',
  },
  containerInternal: {
    flexDirection: "row",
    marginTop: 33,
    justifyContent: "space-between"
  },
  buttonClose: {
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    color: "#FFF",
    fontSize: 24
  },
  containerTitle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 49
  },
  title: {
    color: "#FEC10E",
    fontSize: 16,
    fontWeight: "bold"
  },
  containerCode: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  containerTicket: {
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center"
  },
  titleTicket: {
    color: "#FFF",
    fontSize: 16,
    margin: 2
  },
  containerDescription: {
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center"
  },
  textDescription: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold"
  },
  image: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 43,
    flexDirection: "row"
  },
  containerImageQrCode: {
    backgroundColor: "#FFF",
    width: 230,
    height: 230,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Style;
