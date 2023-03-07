// NPM imports
import Reactotron from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";

// Reactotron config
Reactotron.configure({ host: "192.168.88.101", name: "VouD" }) // controls connection & communication settings
  .use(reactotronRedux())
  .useReactNative()
  .connect(); // add all built-in react native plugins

if (__DEV__) {
  console.tron = Reactotron;
}

export default Reactotron;
