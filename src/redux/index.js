// NPM imports
import { combineReducers } from "redux";
import { reducer as form } from "redux-form";

// import reducers
import auth from "./auth";
import config from "./config";
import financial from "./financial";
import help from "./help";
import init from "./init";
import login from "./login";
import menu from "./menu";
import mobilityServices from "../flows/mobility-services/reducer";
import nav from "./nav";
import onboarding from "./onboarding";
import paymentMethod from "./payment-method";
import profile from "./profile";
import profileEdit from "./profile-edit";
import register from "./register";
import report from "./report";
import servicePoint from "./service-point";
import smartPurchase from "./smart-purchase";
import toast from "./toast";
import transportCard from "./transport-card";
import facebook from "./facebook";
import apiStatus from "./api-status";
import notifications from "./notifications";
import phoneRecharge from "./phone-recharge";
import scooter from "./scooter";
import usageTerms from "../flows/usage-terms/reducer";
import pointsOfInterest from "../flows/home/reducer";
import searchPointsOfInterest from "../flows/search-points-of-interest/reducer";
import authRide from "../flows/scooter/store/ducks/authRide";
import authStart from "../flows/scooter/store/ducks/startRide";
import authEnd from "../flows/scooter/store/ducks/endRide";
import pointsRide from "../flows/scooter/store/ducks/pointsRide";
import reportProblemRide from "../flows/scooter/store/ducks/reportProblemRide";
import financialRide from "../flows/scooter/store/ducks/financialRide";
import requestCard from "../flows/RequestCard/store/requestCard";
import promoCode from "./promo-code";
import requestCardAddress from "../flows/RequestCard/store/requestCardAddress";
import purchaseHistoricRide from "../flows/scooter/store/ducks/purchaseHistoricRide";
import ticketUnitary from "../flows/TicketUnitary/store/ducks/ticketUnitary";
import verificationCard from "../flows/VerificationCard/store/ducks/verificationCard";
import editUser from "../flows/EditUserData/store";
import ticketUnitaryExtract from "../flows/TicketUnitary/store/ducks/ticketUnitaryExtract";
import ticketUnitaryAvailable from "../flows/TicketUnitary/store/ducks/ticketUnitaryAvailable";

const appReducer = combineReducers({
  auth,
  config,
  financial,
  form,
  help,
  init,
  login,
  menu,
  mobilityServices,
  nav,
  onboarding,
  paymentMethod,
  profile,
  profileEdit,
  register,
  report,
  servicePoint,
  smartPurchase,
  toast,
  transportCard,
  facebook,
  apiStatus,
  notifications,
  phoneRecharge,
  usageTerms,
  pointsOfInterest,
  searchPointsOfInterest,
  scooter,
  authRide,
  authStart,
  authEnd,
  pointsRide,
  reportProblemRide,
  financialRide,
  requestCard,
  promoCode,
  requestCardAddress,
  purchaseHistoricRide,
  ticketUnitary,
  verificationCard,
  editUser,
  ticketUnitaryExtract,
  ticketUnitaryAvailable
});

export default appReducer;
