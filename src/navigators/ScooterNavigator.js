// NPM imports
import { StackNavigator } from "react-navigation";

// VouD imports
import { routeNames } from "../shared/route-names";
import {
  ScooterServices,
  ScooterServicesInfo,
  ScooterServicesQrCode,
  ScooterServicesReportProblem
} from "../screens";

function forHorizontal(props) {
  const { layout, position, scene } = props;
  const { index } = scene;

  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [layout.initWidth, 0, 0]
  });

  const opacity = position.interpolate({
    inputRange: [index - 1, index - 0.99, index, index + 0.99, index + 1],
    outputRange: [0, 1, 1, 0.3, 0]
  });

  return { opacity, transform: [{ translateX }] };
}

const options = {
  headerMode: "float",
  cardStyle: { backgroundColor: "transparent" },
  navigationOptions: {
    gesturesEnabled: false
  },
  transitionConfig: () => ({ screenInterpolator: forHorizontal })
};

const ScooterNav = StackNavigator(
  {
    [routeNames.SCOOTER_SERVICES]: { screen: ScooterServices },
    [routeNames.SCOOTER_INFO]: { screen: ScooterServicesInfo },
    [routeNames.SCOOTER_SERVICES_QRCODE]: { screen: ScooterServicesQrCode }
  },
  options
);

export default ScooterNav;
