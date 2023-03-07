// NPM imports
import { createSelector } from "reselect";
// import { compose } from 'ramda';

// VouD imports
import { calculateDistance } from "../utils/haversine";
import { transactionTypes } from "./transport-card";
import { smartPurchaseStatus } from "./smart-purchase";
import {
  findBUProduct,
  getBOMMaxCredit,
  getBUSupportedPeriodTypes,
  getBUSupportedCreditTypes
} from "../utils/transport-card";
import { isLoggedIn } from "../utils/auth";
import { transportCardTypes } from "./transport-card";
import { DEFAULT_PAYMENT_CARD_MAX_LENGTH } from "../utils/payment-card";
import { hasConfigError } from "./config";
import { extractRequestUI, mergeRequestUI } from "./utils";
import { getCheckLastTermsAcceptedUi } from "../flows/usage-terms/reducer";

// Base selectors
// const initStateSelector = (state) => state.init;
const configStateSelector = state => state.config;
const loginStateSelector = state => state.login;
const registerStateSelector = state => state.register;
const helpStateSelector = state => state.help;
const profileStateSelector = state => state.profile;
const profileEditStateSelector = state => state.profileEdit;
const servicePointStateSelector = state => state.servicePoint;
const transportCardStateSelector = state => state.transportCard;
const transportCardStateSelectorDetails = state => state.transportCard;
const financialStateSelector = state => state.financial;
const paymentMethodStateSelector = state => state.paymentMethod;
const reportStateSelector = state => state.report;
const smartPurchaseSelector = state => state.smartPurchase;
const facebookSelector = state => state.facebook;
const apiStatusSelector = state => state.apiStatus;
const notificationsSelector = state => state.notifications;
const phoneRechargeSelector = state => state.phoneRecharge;
const requestCardPreAuthSelector = state => state.requestCardPreAuth;
const promocodeSelector = state => state.promoCode;
const userEditStateSelector = state => state.editUser;

// Config

/**
 * returns request states for config content
 * @return {Object} isFetching, requested, error
 */
export const getConfigContentUI = createSelector(
  configStateSelector,
  configState => extractRequestUI(configState)
);

/**
 * returns has config error state
 * @return {boolean}
 */
export const getHasConfigError = createSelector(
  [getConfigContentUI, getCheckLastTermsAcceptedUi],
  (configContentUI, checkLastTermsAcceptedUi) =>
    hasConfigError(configContentUI, checkLastTermsAcceptedUi)
);

export const getIsLoadingConfig = createSelector(
  [getConfigContentUI, getCheckLastTermsAcceptedUi],
  (configContentUI, checkLastTermsAcceptedUi) =>
    configContentUI.isFetching || checkLastTermsAcceptedUi.isFetching
);

// Login

/**
 * returns request states for pre auth
 * @return {Object} isFetching, requested, error
 */
export const getPreAuthUI = createSelector(
  loginStateSelector,
  loginState => extractRequestUI(loginState.preAuth)
);

/**
 * returns request states for login
 * @return {Object} isFetching, requested, error
 */
export const getLoginUI = createSelector(
  loginStateSelector,
  loginState => extractRequestUI(loginState.login)
);

/**
 * returns request states for requestPreAuth
 * @return {Object} isFetching, requested, error
 */
export const getRequestCardPreAuthUI = createSelector(
  requestCardPreAuthSelector,
  loginState => extractRequestUI(requestCardPreAuthSelector.requestCardPreAuth)
);

/**
 * returns request states for recover password
 * @return {Object} isFetching, requested, error
 */
export const getRecoverPasswordUI = createSelector(
  loginStateSelector,
  loginState => extractRequestUI(loginState.recoverPassword)
);

/**
 * returns request states for change password
 * @return {Object} isFetching, requested, error
 */
export const getChangePasswordUI = createSelector(
  loginStateSelector,
  loginState => extractRequestUI(loginState.changePassword)
);

/**
 * returns request states for check password
 * @return {Object} isFetching, requested, error
 */
export const getCheckPasswordUI = createSelector(
  loginStateSelector,
  loginState => extractRequestUI(loginState.checkPassword)
);

// Register

/**
 * returns request states for register
 * @return {Object} isFetching, requested, error
 */
export const getRegisterUI = createSelector(
  registerStateSelector,
  registerState => extractRequestUI(registerState.register)
);

/**
 * returns request states for confirm mobile
 * @return {Object} isFetching, requested, error
 */
export const getConfirmMobileUI = createSelector(
  registerStateSelector,
  registerState => extractRequestUI(registerState.confirmMobile)
);

/**
 * returns request states for resend SMS
 * @return {Object} isFetching, requested, error
 */
export const getResendMobileConfirmationUI = createSelector(
  registerStateSelector,
  registerState => extractRequestUI(registerState.resendMobileConfirmation)
);

/**
 * returns request states for confirm email
 * @return {Object} isFetching, requested, error
 */
export const getConfirmEmailUI = createSelector(
  registerStateSelector,
  registerState => extractRequestUI(registerState.confirmEmail)
);

/**
 * returns request states for resend email confirmation
 * @return {Object} isFetching, requested, error
 */
export const getResendEmailConfirmationUI = createSelector(
  registerStateSelector,
  registerState => extractRequestUI(registerState.resendEmailConfirmation)
);

// Transport card

/**
 * returns request states for card list
 * @return {Object} isFetching, requested, error
 */
export const getCardListUI = createSelector(
  transportCardStateSelector,
  transportCardState => extractRequestUI(transportCardState.cardList)
);

/**
 * returns request states for add card
 * @return {Object} isFetching, requested, error
 */
export const getAddCardUI = createSelector(
  transportCardStateSelector,
  transportCardState => extractRequestUI(transportCardState.add)
);

/**
 * returns request states for remove card
 * @return {Object} isFetching, requested, error
 */
export const getRemoveCardUI = createSelector(
  transportCardStateSelector,
  transportCardState => extractRequestUI(transportCardState.remove)
);

/**
 * returns request states for edit card (update + remove)
 * @return {Object} isFetching, requested, error
 */
export const getEditTransportCardUI = createSelector(
  transportCardStateSelector,
  transportCardState =>
    mergeRequestUI([transportCardState.update, transportCardState.remove])
);

/**
 * @return {Array} cards list ordered according to wallet array
 */
export const getTransportCards = createSelector(
  transportCardStateSelector,
  transportCardState => {
    const cardList = transportCardState.list ? transportCardState.list : [];
    return cardList.map(cardData => {
      const nextRechargeGroup = transportCardState.nextRecharges
        ? transportCardState.nextRecharges
        : [];
      const cardNextRecharge = nextRechargeGroup.find(
        nextRecharge => cardData.uuid === nextRecharge.cardId
      );
      const cardNextRechargeList = cardNextRecharge
        ? cardNextRecharge.list
        : [];
      const cardWallets = cardData.wallets ? cardData.wallets : [];
      return {
        ...cardData,
        wallets: cardWallets,
        balanceNextRecharge:
          cardNextRechargeList && cardNextRechargeList.length > 0
            ? cardNextRechargeList[0].recharge
            : 0,
        nextRecharges: cardNextRecharge || null
      };
    });
  }
);

/**
 * @return {Array} cards list ordered according to wallet array
 */
export const getTransportCardsDetails = createSelector(
  transportCardStateSelectorDetails,
  transportCardState => {
    const cardList = transportCardState.listDetails
      ? transportCardState.listDetails
      : [];
    return cardList.map(cardData => {
      const nextRechargeGroup = transportCardState.nextRecharges
        ? transportCardState.nextRecharges
        : [];
      const cardNextRecharge = nextRechargeGroup.find(
        nextRecharge => cardData.uuid === nextRecharge.cardId
      );
      const cardNextRechargeList = cardNextRecharge
        ? cardNextRecharge.list
        : [];
      const cardWallets = cardData.wallets ? cardData.wallets : [];
      return {
        ...cardData,
        wallets: cardWallets,
        balanceNextRecharge:
          cardNextRechargeList && cardNextRechargeList.length > 0
            ? cardNextRechargeList[0].recharge
            : 0,
        nextRecharges: cardNextRecharge || null
      };
    });
  }
);

/**
 * @return {Object} current transport card data
 */
export const getCurrentTransportCard = createSelector(
  [transportCardStateSelector, getTransportCards],
  (transportCardState, transportCards) =>
    transportCards.find(
      card => card.uuid === transportCardState.currentDetailId
    )
);

/**
 * @return {Object} sum value recharge pending
 */
export const rechargePendingValue = createSelector(
  [transportCardStateSelectorDetails, getTransportCardsDetails],
  (transportCardState, transportCardsDetails) => {
    let valueTotal = 0;
    const cardData = transportCardsDetails.find(
      card => card.uuid === transportCardState.currentDetailId
    );
    if (!cardData) return valueTotal;

    if (cardData.nextRecharges) {
      if (
        cardData &&
        cardData.layoutType !== transportCardTypes.BOM_ESCOLAR_GRATUIDADE &&
        cardData.nextRecharges &&
        cardData.nextRecharges.list &&
        cardData.nextRecharges.list.length > 0
      ) {
        if (cardData.nextRecharges.list.length > 1) {
          cardData.nextRecharges.list.map(item => {
            valueTotal += item.recharge;
          });
        } else if (cardData.nextRecharges.list.length === 1) {
          valueTotal = cardData.nextRecharges.list[0].recharge;
        }
      }
    }
    return valueTotal;
  }
);

/**
 * @return {Object} current transport card data details
 */
export const getCurrentTransportCardDetails = createSelector(
  [transportCardStateSelectorDetails, getTransportCardsDetails],
  (transportCardState, transportCardsDetails) =>
    transportCardsDetails.find(
      card => card.uuid === transportCardState.currentDetailId
    )
);

/**
 * @return {string} current transport card nick
 */
export const getCurrentTransportCardNick = createSelector(
  getCurrentTransportCard,
  currentTransportCard =>
    currentTransportCard ? currentTransportCard.nick : ""
);

export const getCurrentCardNextRecharges = createSelector(
  transportCardStateSelector,
  transportCardState =>
    transportCardState.nextRecharges.find(
      nextRecharge => transportCardState.currentDetailId === nextRecharge.cardId
    )
);

// Card details

/**
 * returns request states for card statement
 * @return {Object} isFetching, requested, error
 */
export const getStatementUI = createSelector(
  transportCardStateSelector,
  transportCardState => extractRequestUI(transportCardState.statement)
);

/**
 * @return {Object} current card statement data
 */
const getCurrentCardStatement = createSelector(
  transportCardStateSelector,
  transportCardState => {
    const transportCardStatement = transportCardState.statement.data.find(
      statement => statement.cardId === transportCardState.currentDetailId
    );
    return transportCardStatement ? transportCardStatement.statementList : [];
  }
);

/**
 * @return {Object} filtered statement data
 */
export const filterCurrentCardStatementBySupportedCharacteristics = createSelector(
  getCurrentCardStatement,
  currentCardStatement =>
    currentCardStatement.filter(
      statement =>
        statement.characteristic === transactionTypes.RECARGA ||
        statement.characteristic === transactionTypes.USO ||
        statement.characteristic === transactionTypes.GRATUIDADE
    )
);

// Next Recharges

/**
 * returns request states for next recharges
 * @return {Object} isFetching, requested, error
 */
export const getNextRechargesUI = createSelector(
  transportCardStateSelector,
  transportCardState => extractRequestUI(transportCardState.nextRecharges)
);

// Profile

const getPosition = profileState => profileState.position;

/**
 * returns user authentication state
 * @return {boolean}
 */
export const getIsLoggedIn = createSelector(
  profileStateSelector,
  profileState => isLoggedIn(profileState.data)
);

/**
 * returns user authentication state
 * @return {boolean}
 */
export const getIsLoggedInForceUpdateProfile = createSelector(
  profileStateSelector,
  profileState => isLoggedIn(profileState.dataForceUpdateProfile)
);

export const getLoggedUser = createSelector(
  profileStateSelector,
  profileState => profileState.data
);

export const getUserPhoneRecharge = createSelector(
  profileStateSelector,
  profileState => {
    if (!profileState.data) return null;
    return profileState.data.mobile;
  }
);

export const getUserPhoneValidRecharge = createSelector(
  profileStateSelector,
  profileState => {
    if (!profileState.data) return null;
    return profileState.data.isValidMobile;
  }
);

/**
 * returns security data alert count
 * @return {number}
 */
export const getSecurityDataAlertCount = createSelector(
  profileStateSelector,
  profileState => {
    // if user is not logged, return 0
    if (!profileState.data.authenticationToken) return 0;

    let count = 0;

    if (!profileState.data.isValidEmail) count += 1;

    if (!profileState.data.isValidMobile) count += 1;

    return count;
  }
);

export const getPersonalDataValidation = createSelector(
  profileStateSelector,
  profileState => {
    const {
      data: { lastName, birthDate }
    } = profileState;
    return {
      isValidLastName: lastName && lastName !== "",
      isValidBirthDate: birthDate && birthDate !== ""
    };
  }
);

/**
 * returns personal data alert count
 * @return {number}
 */
export const getPersonalDataAlertCount = createSelector(
  [profileStateSelector, getPersonalDataValidation],
  (profileState, personalDataValidation) => {
    // if user is not logged, return 0
    if (!profileState.data.authenticationToken) return 0;

    let count = 0;
    if (!personalDataValidation.isValidLastName) count += 1;

    if (!personalDataValidation.isValidBirthDate) count += 1;

    return count;
  }
);

export const getProfileAlertCount = createSelector(
  [getSecurityDataAlertCount, getPersonalDataAlertCount],
  (securityDataAlertCount, personalDataAlertCount) =>
    securityDataAlertCount + personalDataAlertCount
);

export const getHasProfileAlerts = createSelector(
  getProfileAlertCount,
  alertCount => alertCount > 0
);

// Profile edit

/**
 * returns request states for edit personal data
 * @return {Object} isFetching, requested, error
 */
export const getEditPersonalDataUI = createSelector(
  profileEditStateSelector,
  profileEditState => extractRequestUI(profileEditState.personalData)
);

// User edit

/**
 * returns request states for edit personal data
 * @return {Object} isFetching, requested, error
 */
export const getEditUserDataUI = createSelector(
  userEditStateSelector,
  editUserState => extractRequestUI(editUserState.personalData)
);

/**
 * returns request states for edit password
 * @return {Object} isFetching, requested, error
 */
export const getEditPasswordUI = createSelector(
  profileEditStateSelector,
  profileEditState => extractRequestUI(profileEditState.password)
);

/**
 * returns request states for edit email
 * @return {Object} isFetching, requested, error
 */
export const getEditEmailUI = createSelector(
  profileEditStateSelector,
  profileEditState => extractRequestUI(profileEditState.email)
);

/**
 * returns request states for edit mobile
 * @return {Object} isFetching, requested, error
 */
export const getEditMobileUI = createSelector(
  profileEditStateSelector,
  profileEditState => extractRequestUI(profileEditState.mobile)
);

/**
 * returns request states for edit address
 * @return {Object} isFetching, requested, error
 */
export const getEditAddressUI = createSelector(
  profileEditStateSelector,
  profileEditState => extractRequestUI(profileEditState.address)
);

// Service Points

/**
 * returns the service points list including the distance field
 * @return {Array} service points list
 */
export const getServicePointsList = createSelector(
  [servicePointStateSelector, profileStateSelector],
  (servicePointState, profileState) => {
    const { latitude, longitude } = getPosition(profileState);
    return servicePointState.list.data
      .map(servicePoint => {
        return {
          ...servicePoint,
          distance:
            latitude && longitude
              ? calculateDistance(
                  latitude,
                  longitude,
                  servicePoint.latitude,
                  servicePoint.longitude
                )
              : ""
        };
      })
      .sort((a, b) => a.distance - b.distance);
  }
);

/**
 * returns request states for service points list
 * @return {Object} isFetching, requested, error
 */
export const getServicePointsListUI = createSelector(
  servicePointStateSelector,
  servicePointState => extractRequestUI(servicePointState.list)
);

/**
 * returns service point details data
 * @return {Object} service point details
 */
export const getServicePointDetails = createSelector(
  [servicePointStateSelector, profileStateSelector],
  (servicePointState, profileState) => {
    const currentId = servicePointState.currentDetailId;
    const { latitude, longitude } = getPosition(profileState);
    const servicePoint = servicePointState.list.data.find(
      servicePoint => servicePoint.id === currentId
    );

    return {
      ...servicePoint,
      distance:
        latitude && longitude
          ? calculateDistance(
              latitude,
              longitude,
              servicePoint.latitude,
              servicePoint.longitude
            )
          : null
    };
  }
);

// Help

/**
 * returns faq list
 * @return {Array} faq list
 */
export const getFaqList = createSelector(
  helpStateSelector,
  helpState => helpState.list.data
);

/**
 * returns request states for faq list
 * @return {Object} isFetching, requested, error
 */
export const getFaqListUI = createSelector(
  helpStateSelector,
  helpState => extractRequestUI(helpState.list)
);

/**
 * returns question details data
 * @return {Object} question details
 */
export const getQuestionDetails = createSelector(
  helpStateSelector,
  helpState => {
    const currentId = helpState.currentHelpTopicId;
    return helpState.list.data
      .reduce((list, topic) => {
        const topicItems = topic.items ? topic.items : [];
        return [...list, ...topicItems];
      }, [])
      .find(question => question.id === currentId);
  }
);

/**
 * returns help id list
 * @return {Object} help id list
 */
const getHelpIdList = createSelector(
  configStateSelector,
  configState => {
    const configContent =
      configState && configState.content ? configState.content : [];
    const helpIdList = configContent.find(
      config => config.type === "HELP_ID_LIST"
    );
    return helpIdList || {};
  }
);

/**
 * returns card help id
 * @return {Object} card help id
 */
export const getCardHelpId = createSelector(
  getHelpIdList,
  helpIdList => {
    return helpIdList.items ? Number(helpIdList.items.CARD_HELP) : undefined;
  }
);

/**
 * returns school card details help id
 * @return {Object} card help id
 */
export const getSchoolCardDetailsHelpId = createSelector(
  getHelpIdList,
  helpIdList => {
    return helpIdList.items
      ? Number(helpIdList.items.SCHOOL_CARD_DETAILS_HELP)
      : undefined;
  }
);

/**
 * returns next recharges help id
 * @return {Object} next recharges help id
 */
export const getNextRechargesHelpId = createSelector(
  getHelpIdList,
  helpIdList => {
    return helpIdList.items
      ? Number(helpIdList.items.NEXT_RECHARGES_HELP)
      : undefined;
  }
);

/**
 * returns smart purchase help id
 * @return {Object} smart purchase help id
 */
export const getSmartPurchaseHelpId = createSelector(
  getHelpIdList,
  helpIdList => {
    return helpIdList.items
      ? Number(helpIdList.items.SMART_PURCHASE_HELP)
      : undefined;
  }
);

// Financial

/**
 * returns request states for service tax
 * @return {Object} isFetching, requested, error
 */
export const getServiceTaxUI = createSelector(
  financialStateSelector,
  financialState => extractRequestUI(financialState.purchaseTax)
);

/**
 * returns request states for payment transaction
 * @return {Object} isFetching, requested, error
 */
export const getPaymentTransactionUI = createSelector(
  financialStateSelector,
  financialState => extractRequestUI(financialState.paymentTransaction)
);

/**
 * returns encryption configuration
 * @return {Object} encryption configuration
 */
export const getEncryptionConfig = createSelector(
  configStateSelector,
  configState => {
    const configContent = configState.content ? configState.content : [];
    const encryptionConfig = configContent.find(
      config => config.type === "ENCRYPTION_CONFIG"
    );

    return encryptionConfig
      ? {
          adyenPK: encryptionConfig.items
            ? encryptionConfig.items.ADYEN_PK
            : undefined,
          cieloPK: encryptionConfig.items
            ? encryptionConfig.items.CIELO_PK
            : undefined
        }
      : {};
  }
);

/**
 * @return {Object} purchase transport card data
 */
export const getPurchaseTransportCard = createSelector(
  [financialStateSelector, transportCardStateSelector],
  (financialState, transportCardState) => {
    let list =
      transportCardState.listDetails.length > 0
        ? transportCardState.listDetails
        : transportCardState.list;

    const cardData = list.find(
      card => card.uuid === financialState.purchaseTransportCardId
    );

    return cardData || {};
  }
);

/**
 * @return {Object} purchase transport card data
 */
export const getPurchaseTransportScheduledCard = createSelector(
  [financialStateSelector, transportCardStateSelector],
  (financialState, transportCardState) => {
    let cardData;
    let transportCard =
      transportCardState.listDetails.length === 0
        ? transportCardState.list
        : transportCardState.listDetails;

    cardData = transportCard.find(
      card => card.uuid === financialState.purchaseTransportCardId
    );
    return cardData || {};
  }
);

/**
 * returns request states for purchase list
 * @return {Object} isFetching, requested, error
 */
export const getPurchaseListUI = createSelector(
  financialStateSelector,
  financialState => extractRequestUI(financialState.purchaseList)
);

/**
 * returns purchase history detail
 * @return {Object} purchase history detail
 */
export const getPurchaseHistoryDetail = createSelector(
  financialStateSelector,
  financialState => {
    return financialState.purchaseList.data.find(
      purchase => purchase.id === financialState.purchaseDetailId
    );
  }
);

/**
 * @return {Object} purchase history transport card data
 */
export const getPurchaseHistoryTransportCard = createSelector(
  [getPurchaseHistoryDetail, transportCardStateSelector],
  (purchaseDetail, transportCardState) =>
    transportCardState.list.find(card => {
      const detailTransportCard = purchaseDetail
        ? purchaseDetail.transportCard
        : null;
      return (
        detailTransportCard &&
        detailTransportCard.cardNumber === card.cardNumber
      );
    })
);

// Payment method

/**
 * returns request states for saved payments list
 * @return {Object} isFetching, requested, error
 */
export const getSavedPaymentMethodsUI = createSelector(
  paymentMethodStateSelector,
  paymentMethodState => extractRequestUI(paymentMethodState.saved)
);

/**
 * returns request states for save payment method
 * @return {Object} isFetching, requested, error
 */
export const getSavePaymentMethodUI = createSelector(
  paymentMethodStateSelector,
  paymentMethodState => extractRequestUI(paymentMethodState.save)
);

/**
 * returns request states for remove payment method
 * @return {Object} isFetching, requested, error
 */
export const getRemovePaymentMethodUI = createSelector(
  paymentMethodStateSelector,
  paymentMethodState => extractRequestUI(paymentMethodState.remove)
);

/**
 * @return {boolean} if it has a saved payment method selected
 */
export const getHasSavedPaymentSelected = createSelector(
  paymentMethodStateSelector,
  paymentMethodState => paymentMethodState.saved.selected
);

/**
 * @return {Object} selected saved payment
 */
export const getSelectedPaymentMethod = createSelector(
  paymentMethodStateSelector,
  ({ selectedTemporaryCard, saved }) =>
    selectedTemporaryCard ||
    saved.data.find(paymentMethod => paymentMethod.id === saved.selected)
);

/**
 * @return {boolean} if it has a saved payment method
 */
export const getHasSavedPayment = createSelector(
  paymentMethodStateSelector,
  paymentMethodState => paymentMethodState.saved.data.length > 0
);

// Active Discounts
/**
 * returns request states for active discounts list
 * @return {Object} isFetching, requested, error
 */
export const getActiveDiscountsUi = createSelector(
  paymentMethodStateSelector,
  paymentMethodState => extractRequestUI(paymentMethodState.activeDiscounts)
);

/**
 * returns active discounts list
 * @return {Object} active discounts
 */
export const getActiveDiscounts = createSelector(
  paymentMethodStateSelector,
  paymentMethodState => {
    const discounts = paymentMethodState.activeDiscounts.data;
    // Note - the current business rule limit to one active discount
    return discounts && discounts.length > 0 ? [discounts[0]] : [];
  }
);

// Report

/**
 * returns request states for add report
 * @return {Object} isFetching, requested, error
 */
export const getAddReportUI = createSelector(
  reportStateSelector,
  reportState => extractRequestUI(reportState.add)
);

/**
 * returns request states for finish report
 * @return {Object} isFetching, requested, error
 */
export const getFinishReportUI = createSelector(
  reportStateSelector,
  reportState => extractRequestUI(reportState.finish)
);

// Smart Purchase

/**
 * returns request states for smart purchase list
 * @return {Object} isFetching, requested, error
 */
export const getSmartPurchaseListUI = createSelector(
  smartPurchaseSelector,
  smartPurchaseState => extractRequestUI(smartPurchaseState.list)
);

/**
 * returns request states for save smart purchase
 * @return {Object} isFetching, requested, error
 */
export const getSaveSmartPurchaseUI = createSelector(
  smartPurchaseSelector,
  smartPurchaseState => extractRequestUI(smartPurchaseState.save)
);

/**
 * returns request states for remove smart purchase
 * @return {Object} isFetching, requested, error
 */
export const getRemoveSmartPurchaseUI = createSelector(
  smartPurchaseSelector,
  smartPurchaseState => extractRequestUI(smartPurchaseState.remove)
);

/**
 * @return {Object} smart purchase list
 */
export const getSmartPurchaseList = createSelector(
  [transportCardStateSelector, smartPurchaseSelector],
  (transportCardState, smartPurchaseState) => {
    const cardList = transportCardState.list ? transportCardState.list : [];
    const smartPurchaseList = smartPurchaseState.list.data
      ? smartPurchaseState.list.data
      : [];

    return cardList.map(card => {
      const smartPurchase = smartPurchaseList.find(
        smartPurchase => card.uuid === smartPurchase.transportCard.uuid
      );
      const hasSetSmartPurchase = !!smartPurchase;
      const hasError =
        hasSetSmartPurchase &&
        smartPurchase.lastStatus === smartPurchaseStatus.ERROR;
      return {
        hasSetSmartPurchase,
        id: hasSetSmartPurchase ? smartPurchase.id : null,
        isActive:
          hasSetSmartPurchase && !hasError ? smartPurchase.active : false,
        rechargeValue: hasSetSmartPurchase ? smartPurchase.rechargeValue : 0,
        transactionValue: hasSetSmartPurchase
          ? smartPurchase.transactionValue
          : 0,
        scheduledDay: hasSetSmartPurchase ? smartPurchase.scheduledDay : 0,
        paymentMethod: hasSetSmartPurchase ? smartPurchase.paymentMethod : {},
        idTransportCardWallet: hasSetSmartPurchase
          ? smartPurchase.idTransportCardWallet
          : null,
        productQuantity: hasSetSmartPurchase
          ? smartPurchase.productQuantity
          : 0,
        hasError,
        lastError: hasError ? smartPurchase.lastError : null,
        processLocation: hasSetSmartPurchase
          ? smartPurchase.processLocation
          : null,
        cardData: {
          ...card
        }
      };
    });
  }
);

/**
 * @return {Object} current smart purchase detail
 */
export const getCurrentSmartPurchaseDetail = createSelector(
  [getSmartPurchaseList, financialStateSelector],
  (smartPurchaseList, financialState) => {
    const currentSmartPurchaseDetail = smartPurchaseList.find(
      smartPurchase =>
        smartPurchase.cardData.uuid === financialState.purchaseTransportCardId
    );
    // Note: function returns an empty cardData object to prevent the field access of an undefined object
    return currentSmartPurchaseDetail || { cardData: {} };
  }
);

/**
 * @return {boolean} check if current purchase transport card has a smart purchase
 */
export const getHasCurrentTransportCardActiveSmartPurchase = createSelector(
  [getSmartPurchaseList, financialStateSelector],
  (smartPurchaseList, financialState) =>
    smartPurchaseList.some(
      smartPurchase =>
        smartPurchase.hasSetSmartPurchase &&
        smartPurchase.cardData.uuid ===
          financialState.purchaseTransportCardId &&
        smartPurchase.isActive
    )
);

/**
 * @return {object} saved payment list
 */
export const getSavedPaymentList = createSelector(
  [getSmartPurchaseList, paymentMethodStateSelector],
  (smartPurchaseList, paymentMethodState) =>
    paymentMethodState.saved.data.map(el => {
      const paymentMethodSmartPurchases = smartPurchaseList.filter(
        smartPurchase =>
          smartPurchase.paymentMethod &&
          el.id === smartPurchase.paymentMethod.id
      );
      return {
        ...el,
        smartPurchaseList: paymentMethodSmartPurchases
          ? [...paymentMethodSmartPurchases]
          : []
      };
    })
);

// Facebook

/**
 * returns request states for facebook login
 * @return {Object} isFetching, requested, error
 */
export const getFBLoginUI = createSelector(
  facebookSelector,
  facebookState => extractRequestUI(facebookState.login)
);

// BU

/**
 * returns request states for bu supported credit types
 * @return {Object} isFetching, requested, error
 */
export const getBUSupportedCreditTypesSelector = createSelector(
  getPurchaseTransportCard,
  cardData => getBUSupportedCreditTypes(cardData)
);

/**
 * returns request states for bu supported period types
 * @return {Object} isFetching, requested, error
 */
export const getBUSupportedPeriodTypesSelector = createSelector(
  getPurchaseTransportCard,
  cardData => getBUSupportedPeriodTypes(cardData)
);

/**
 * returns BOM credit value range configuration
 * @return {Object} credit value range configuration
 */
export const getBOMCreditValueRange = state =>
  createSelector(
    getCurrentTransportCardDetails,
    cardData => {
      if (cardData === undefined) return {};
      const { minRechargeValue, maxRechargeValue } = cardData;
      return {
        minRechargeValue,
        maxRechargeValue
      };
    }
  )(state);

/**
 * returns credit value range
 * @return {Object} credit value range
 */
export const getCreditValueRange = (state, buCreditType) =>
  createSelector(
    [getPurchaseTransportCard, getBOMCreditValueRange],
    (cardData, bomCreditValueRange) => {
      if (cardData.layoutType === transportCardTypes.BU) {
        const buProduct = findBUProduct(cardData.wallets, buCreditType);
        return {
          minCreditValue: buProduct
            ? buProduct.productMinimalQuantity * 100
            : 0,
          maxCreditValue: buProduct ? buProduct.productMaximalQuantity * 100 : 0
        };
      } else if (cardData.layoutType === transportCardTypes.LEGAL) {
        return {
          minCreditValue: 4.75 * 100,
          maxCreditValue: getBOMMaxCredit(cardData, bomCreditValueRange) * 100
        };
      }

      return {
        minCreditValue: bomCreditValueRange.minRechargeValue * 100,
        maxCreditValue: getBOMMaxCredit(cardData, bomCreditValueRange) * 100
      };
    }
  )(state);

// API Status
/**
 * returns request states for api status
 * @return {Object} isFetching, requested, error
 */
export const getApiStatusUI = createSelector(
  apiStatusSelector,
  apiStatusState => extractRequestUI(apiStatusState)
);

// Payment Card

/**
 * returns payment card brand pattern
 * @return {Object} payment card brand pattern
 */
export const getPaymentCardBrandPattern = createSelector(
  configStateSelector,
  configState => {
    const configContent =
      configState && configState.content ? configState.content : [];
    const paymentCardBrandPattern = configContent.find(
      config => config.type === "PAYMENT_CARD_BRAND_PATTERNS"
    );
    const paymentCardMaxLenghts = configContent.find(
      config => config.type === "PAYMENT_CARD_NUMBER_MAX_LENGTHS"
    );

    return paymentCardBrandPattern &&
      paymentCardBrandPattern.items &&
      paymentCardMaxLenghts &&
      paymentCardMaxLenghts.items
      ? Object.keys(paymentCardBrandPattern.items).reduce((acc, cur) => {
          const cardBrandPattern = paymentCardBrandPattern.items[cur]
            ? paymentCardBrandPattern.items[cur]
            : "";
          const cardMaxLength = paymentCardMaxLenghts.items[cur]
            ? Number(paymentCardMaxLenghts.items[cur])
            : DEFAULT_PAYMENT_CARD_MAX_LENGTH;
          return {
            ...acc,
            [cur]: {
              maxLength: cardMaxLength,
              regex: new RegExp(cardBrandPattern)
            }
          };
        }, {})
      : {};
  }
);

/**
 * returns unread notification count
 * @return {Number} unread notification count
 */
export const getUnreadNotificationCount = createSelector(
  notificationsSelector,
  notificationState => {
    const notificationList = notificationState.notificationList.data;
    return notificationList
      ? notificationList.reduce(
          (prevVal, currVal) => (!currVal.read ? prevVal + 1 : prevVal),
          0
        )
      : 0;
  }
);

export const getHasNotificationAlerts = createSelector(
  getUnreadNotificationCount,
  alertCount => alertCount > 0
);

/**
 * returns request states for notification list request
 * @return {Object} isFetching, requested, error
 */
export const getNotificationsUI = createSelector(
  notificationsSelector,
  notificationState => extractRequestUI(notificationState.notificationList)
);

/**
 * returns request states for mark as read request
 * @return {Object} isFetching, requested, error
 */
export const getMarkNotificationAsReadUI = createSelector(
  notificationsSelector,
  notificationState => extractRequestUI(notificationState.markAsRead)
);

/**
 * returns request states for remove request
 * @return {Object} isFetching, requested, error
 */
export const getRemoveNotificationUI = createSelector(
  notificationsSelector,
  notificationState => extractRequestUI(notificationState.remove)
);

// Phone Recharge

/**
 * returns request states for carriers list
 * @return {Object} isFetching, requested, error
 */
export const getCarrierListUi = createSelector(
  phoneRechargeSelector,
  phoneRechargeState => extractRequestUI(phoneRechargeState.carriers)
);

/**
 * returns request states for carriers list
 * @return {Object} isFetching, requested, error
 */
export const getCarrierValuesUi = createSelector(
  phoneRechargeSelector,
  phoneRechargeState => extractRequestUI(phoneRechargeState.carrierValues)
);

export const getPromocodeResponse = createSelector(
  promocodeSelector,
  promocodeState => {
    return promocodeState.promoCode;
  }
);

// Issuer enabled

/**
 * returns issuer enabled configuration
 * @return {Object} issuer enabled configuration
 */
export const getIssuerConfig = createSelector(
  configStateSelector,
  configState => {
    const configContent = configState.content ? configState.content : [];
    const issuerEnabled = configContent.find(
      config => config.type === "ISSUER_ENABLE"
    );
    return issuerEnabled
      ? {
          BOM: {
            isEnabled: issuerEnabled.items.BOM,
            message: issuerEnabled.items.BOM_MSG
          },
          BU: {
            isEnabled: issuerEnabled.items.BU,
            message: issuerEnabled.items.BU_MSG
          }
        }
      : {};
  }
);
