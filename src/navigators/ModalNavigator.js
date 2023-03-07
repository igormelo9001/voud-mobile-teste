// NPM imports
import { StackNavigator } from "react-navigation";

// VouD imports
import { routeNames } from "../shared/route-names";

import {
  Onboarding,
  HelpDetails,
  AddCard,
  EditCard,
  NextRecharges,
  SchoolCardDetails,
  EditPassword,
  EditEmail,
  EditMobile,
  SkipRegistrationPrompt,
  EditAddress,
  PurchaseHistoryDetail,
  PaymentError,
  AddPaymentMethod,
  EditPersonalData,
  ServiceUnavailable,
  NotificationDetail,
  MobilityServicesEstimates,
  FinishReportRequest,
  AcceptUsageTerms,
  SearchPointsOfInterest,
  TransportSearchResult,
  SmartPurchase,
  Help,
  Reports,
  AddReport,
  ReportIsHappeningQuestion,
  MobilityServices,
  CardDetails,
  BuyCredit,
  SelectPaymentMethod,
  EditSmartPurchase,
  PhoneRecharge,
  MobilityServicesSearchAddress,
  PurchaseHistory,
  MyProfile,
  PaymentMethods,
  ScooterServicesInfo,
  ScooterServicesReportProblem,
  ScooterServicesQrCode,
  ScooterServicesReceipt,
  CardListSelect,
  SearchRoutes,
  TraceRoutes,
  Home,
  Auth,
  RequestCardPreAuth,
  RequestCard,
  RequestCardPayment,
  TransportCardRechargeError,
  AddCardTicket,
  PurchaseTicket,
  MyTicket,
  ScanCode,
  TicketInfo,
  ScooterServices
} from "../screens";

import { About } from "../flows/about";
import Zazcar from "../flows/zazcar/screens";
// import MenuNavigator from './MenuNavigator';
// import ScooterNavigator from './ScooterNavigator';
// import MenuNavigator from './MenuNavigator';
import Tembici from "../flows/tembici/screens/index";
import PromocodeModalValidation from "../screens/BuyCredit/PurchaseForm/PromocodeModalValidation";

import MenuNavigator from "./MenuNavigator";

// create custom transitioner without the opacity animation, ie. for iOS
function forVertical(props) {
  const { layout, position, scene } = props;

  const index = scene.index;
  const height = layout.initHeight;

  const translateX = 0;
  const translateY = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [height, 0, 0]
  });

  return {
    transform: [{ translateX }, { translateY }]
  };
}

const ModalNavigator = StackNavigator(
  {
    [routeNames.MENU_NAVIGATOR]: { screen: MenuNavigator },
    [routeNames.HOME]: { screen: Home },
    [routeNames.ONBOARDING]: { screen: Onboarding },
    [routeNames.ADD_CARD]: { screen: AddCard },
    [routeNames.EDIT_CARD]: { screen: EditCard },
    [routeNames.NEXT_RECHARGES]: { screen: NextRecharges },
    [routeNames.SCHOOL_CARD_DETAILS]: { screen: SchoolCardDetails },
    [routeNames.HELP_DETAILS]: { screen: HelpDetails },
    [routeNames.EDIT_PERSONAL_DATA]: { screen: EditPersonalData },
    [routeNames.EDIT_PASSWORD]: { screen: EditPassword },
    [routeNames.EDIT_EMAIL]: { screen: EditEmail },
    [routeNames.EDIT_MOBILE]: { screen: EditMobile },
    [routeNames.SKIP_REGISTRATION_PROMPT]: { screen: SkipRegistrationPrompt },
    [routeNames.EDIT_ADDRESS]: { screen: EditAddress },
    [routeNames.ABOUT]: { screen: About },
    [routeNames.PURCHASE_HISTORY_DETAIL]: { screen: PurchaseHistoryDetail },
    [routeNames.PAYMENT_ERROR]: { screen: PaymentError },
    [routeNames.ADD_PAYMENT_METHOD]: { screen: AddPaymentMethod },
    [routeNames.SERVICE_UNAVAILABLE]: { screen: ServiceUnavailable },
    [routeNames.NOTIFICATION_DETAIL]: { screen: NotificationDetail },
    [routeNames.MOBILITY_SERVICES_ESTIMATES]: {
      screen: MobilityServicesEstimates
    },
    [routeNames.FINISH_REPORT_REQUEST]: { screen: FinishReportRequest },
    [routeNames.ACCEPT_USAGE_TERMS]: AcceptUsageTerms,
    [routeNames.SEARCH_ROUTES]: { screen: SearchRoutes },
    [routeNames.SEARCH_POINTS_OF_INTEREST]: { screen: SearchPointsOfInterest },
    [routeNames.TRANSPORT_SEARCH_RESULT]: { screen: TransportSearchResult },
    [routeNames.SMART_PURCHASE]: { screen: SmartPurchase },
    [routeNames.HELP]: { screen: Help },
    [routeNames.REPORTS]: { screen: Reports },
    [routeNames.ADD_REPORT]: { screen: AddReport },
    [routeNames.REPORT_IS_HAPPENING_QUESTION]: {
      screen: ReportIsHappeningQuestion
    },
    [routeNames.MOBILITY_SERVICES]: { screen: MobilityServices },
    [routeNames.CARD_DETAILS]: { screen: CardDetails },
    [routeNames.BUY_CREDIT]: { screen: BuyCredit },
    [routeNames.SELECT_PAYMENT_METHOD]: { screen: SelectPaymentMethod },
    [routeNames.EDIT_SMART_PURCHASE]: { screen: EditSmartPurchase },
    [routeNames.PHONE_RECHARGE]: { screen: PhoneRecharge },
    [routeNames.MOBILITY_SERVICES_SEARCH_ADDRESS]: {
      screen: MobilityServicesSearchAddress
    },
    [routeNames.PURCHASE_HISTORY]: { screen: PurchaseHistory },
    [routeNames.MY_PROFILE]: { screen: MyProfile },
    [routeNames.PAYMENT_METHODS]: { screen: PaymentMethods },
    [routeNames.SCOOTER_INFO]: { screen: ScooterServicesInfo },
    [routeNames.SCOOTER_REPORT]: { screen: ScooterServicesReportProblem },
    [routeNames.SCOOTER_SERVICES_QRCODE]: { screen: ScooterServicesQrCode },
    [routeNames.SCOOTER_RECEIPT]: { screen: ScooterServicesReceipt },
    [routeNames.CARD_SELECT]: { screen: CardListSelect },
    [routeNames.AUTH]: { screen: Auth },
    [routeNames.REQUEST_CARD_PREAUTH]: { screen: RequestCardPreAuth },
    [routeNames.REQUEST_CARD]: { screen: RequestCard },
    [routeNames.REQUEST_CARD_PAYMENT]: { screen: RequestCardPayment },
    [routeNames.TRACE_ROUTES]: { screen: TraceRoutes },
    [routeNames.TEMBICI]: { screen: Tembici },
    [routeNames.TRANSPORT_CARD_RECHARGE_ERROR]: {
      screen: TransportCardRechargeError
    },
    [routeNames.PROMOCODE_MODAL]: { screen: PromocodeModalValidation },
    [routeNames.ZAZCAR]: { screen: Zazcar },
    [routeNames.ADD_CARD_TICKET_UNITARY]: { screen: AddCardTicket },
    [routeNames.PURCHASE_TICKET]: { screen: PurchaseTicket },
    [routeNames.MY_TICKET_UNITARY]: { screen: MyTicket },
    [routeNames.SCAN_CODE]: { screen: ScanCode },
    [routeNames.TICKET_INFO]: { screen: TicketInfo },
    [routeNames.SCOOTER_SERVICES]: { screen: ScooterServices }
  },
  {
    mode: "modal",
    navigationOptions: {
      gesturesEnabled: false,
      header: null
    },
    cardStyle: { backgroundColor: "transparent" },
    transitionConfig: () => ({ screenInterpolator: forVertical }),
    initialRouteName: routeNames.HOME
  }
);

export default ModalNavigator;
