import { StyleSheet } from "react-native";

const Style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2
  },
  containerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1
  },
  containerNumberLine: {
    marginLeft: 28.5,
    marginRight: 5
  },
  circleLine: {
    height: 16,
    width: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  number: {
    fontSize: 10,
    color: "#FFF",
    fontWeight: "bold"
  },
  containerStation: {
    alignItems: "flex-start",
    justifyContent: "center"
  },
  station: {
    height: 16,
    color: "#6E3E91",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16
  },
  line: {
    height: 16,
    color: "#6E3E91",
    fontSize: 10,
    lineHeight: 12,
    fontStyle: "italic"
  },
  containerType: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    marginRight: 32
  },
  type: {
    height: 16,
    color: "#6E3E91",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16
  },
  containerBar: {
    backgroundColor: "#EAEAEA",
    height: 1,
    flex: 1,
    marginLeft: 32,
    marginRight: 32,
    marginTop: 6
  }
});

export default Style;
