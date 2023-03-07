import { StyleSheet, Platform } from "react-native";

const Style = StyleSheet.create({

  container: {
    backgroundColor: "#FFF",
    flex: 1,
  },
  containerTitle: {
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 109,
  },
  wrapperHeader: {
    position: 'absolute',
    padding: 0,
    top: Platform.select({
      ios: 60,
      android: 40,
    }),
    marginLeft: 24,

  },
  backIcon: {
    alignSelf: 'center',
    marginRight: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  title: {
    fontSize: 22,
    color: "#4d1e71"
  },
  description: {
    fontSize: 14,
    color: "#4d1e71"
  },
  containerTitle: {
    alignItems: "center",
    marginTop: 20
  },
  containerField: {
    flexDirection: "row",
    flex: 1,
    marginTop: 24,
    justifyContent: "center",
    padding: 50,
  },
  containerMessage: {
    height: 80,
    flex: 1,
    backgroundColor: "#656262",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  containerMessageIcon:{
    backgroundColor: "#fc7888",
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    marginLeft: 20,
    alignItems:"center",
    justifyContent:"center",
  },
  containerMessageText:{
    marginLeft: 20,
  },
  messageText :{
    color: "#FFF",
    fontSize: 14,
  },
  borderNumber: {
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderRightWidth: 2,
  }

});

export default Style;
