// VouD imports

import scooterServiceRouteNames from '../flows/scooter/route-names';
import mobilityServiceRouteNames from '../flows/mobility-services/route-names';

export const routeNames = {
	ONBOARDING: 'Onboarding',
	HOME: 'Home',
	HOME_NOT_LOGGED_IN: 'HomeNotLoggedIn',
	TRANSPORT_SEARCH_RESULT: 'TransportSearchResult',
	ABOUT: 'About',
	HELP: 'Help',
	HELP_NOT_LOGGED_IN: 'HelpNotLoggedIn',
	HELP_DETAILS: 'HelpDetails',
	// Navigator
	MODAL_NAVIGATOR: 'ModalNavigator',
	DRAWER_NAVIGATOR: 'DrawerNavigator',
	MAIN_NAVIGATOR: 'MainNavigator',
	MENU_NAVIGATOR: 'MenuNavigator',
	LOGGED_MENU: 'LoggedMenu',
	// Auth
	AUTH: 'Auth',
	PRE_AUTH: 'PreAuth',
	LOGIN: 'Login',
	REGISTER: 'Register',
	REGISTER_FACEBOOK: 'RegisterFacebook',
	CONFIRM_MOBILE: 'ConfirmMobile',
	REGISTER_EDIT_MOBILE: 'RegisterEditMobile',
	CONFIRM_EMAIL: 'ConfirmEmail',
	REGISTER_EDIT_EMAIL: 'RegisterEditEmail',
	SKIP_REGISTRATION_PROMPT: 'SkipRegistrationPrompt',
	REGISTER_SUCCESS: 'RegisterSuccess',
	RECOVER_PASSWORD: 'RecoverPassword',
	CHANGE_PASSWORD: 'ChangePassword',
	PENDING_REGISTRATION_MODAL: 'PendingRegistrationModal',
	// Card
	CARD_DETAILS: 'CardDetails',
	ADD_CARD: 'AddCard',
	ADD_CARD_HELPER_DIALOG: 'AddCardHelperDialog',
	EDIT_CARD: 'EditCard',
	NEXT_RECHARGES: 'NextRecharges',
	SCHOOL_CARD_DETAILS: 'SchoolCardDetails',
	ADD_CARD_TICKET_UNITARY: 'AddCardTicketUnitary',
	PURCHASE_TICKET: 'PurchaseTicket',
	// Profile
	MY_PROFILE: 'MyProfile',
	EDIT_PERSONAL_DATA: 'EditPersonalData',
	EDIT_PASSWORD: 'EditPassword',
	EDIT_EMAIL: 'EditEmail',
	EDIT_EMAIL_CHECKED: 'EditEmailChecked',
	EDIT_EMAIL_CONFIRMATION: 'EditEmailConfirmation',
	EDIT_MOBILE: 'EditMobile',
	EDIT_MOBILE_CHECKED: 'EditMobileChecked',
	EDIT_MOBILE_CONFIRMATION: 'EditMobileConfirmation',
	EDIT_ADDRESS: 'EditAddress',
	SELECT_STATE_DIALOG: 'SelectStateDialog',
	SELECT_STATE_DELIVERY_DIALOG: 'SelectStateDeliveryDialog',
	// Purchase
	BUY_CREDIT: 'BuyCredit',
	SELECT_PAYMENT_METHOD: 'SelectPaymentMethod',
	PURCHASE_HISTORY: 'PurchaseHistory',
	PURCHASE_HISTORY_DETAIL: 'PurchaseHistoryDetail',
	PAYMENT_SUCCESSFUL: 'PaymentSuccessful',
	PAYMENT_ERROR: 'PaymentError',
	PAYMENT_SMART_PURCHASE_DIALOG: 'PaymentSmartPurchaseDialog',
	DEBIT_CARD_REDIRECT_ALERT: 'DebitCardRedirectAlert',
	DEBIT_CARD_SUPPORTED_BANKS_HELPER_DIALOG: 'DebitCardSupportedBanksHelperDialog',
	PURCHASE_CONFIRMATION_DIALOG: 'PurchaseConfirmationDialog',
	CARD_SELECT: 'CardListSelect',
	// Payment Methods
	PAYMENT_METHODS: 'PaymentMethods',
	ADD_PAYMENT_METHOD: 'AddPaymentMethod',
	// Report
	REPORTS: 'Reports',
	REPORTS_NOT_LOGGED_IN: 'ReportsNotLoggedIn',
	REPORT_IS_HAPPENING_QUESTION: 'ReportIsHappeningQuestion',
	FINISH_REPORT_REQUEST: 'FinishReportRequest',
	ADD_REPORT: 'AddReport',
	SELECT_REPORT_TYPE_DIALOG: 'SelectReportTypeDialog',
	SELECT_REPORT_MODAL_TYPE_DIALOG: 'SelectReportModalTypeDialog',
	SELECT_REPORT_DETAILS_DIALOG: 'SelectReportDetailsDialog',
	SEND_REPORT_SUCCESSFUL: 'SendReportSuccessful',
	// Smart Purchase
	SMART_PURCHASE: 'SmartPurchase',
	EDIT_SMART_PURCHASE: 'EditSmartPurchase',
	// Facebook
	FB_PRE_AUTH: 'FacebookPreAuth',
	FB_REGISTER: 'FacebookRegister',
	FB_CONNECT: 'FacebookConnect',
	// Browser (WebView)
	BROWSER: 'Browser',
	// UnsupportedVersionDialog
	UNSUPPORTED_VERSION_DIALOG: 'UnsupportedVersionDialog',
	// UnsupportedDeviceDialog
	UNSUPPORTED_DEVICE_DIALOG: 'UnsupportedDeviceDialog',
	// Service Unavailable
	SERVICE_UNAVAILABLE: 'ServiceUnavailable',
	// Notification Center
	NOTIFICATION_CENTER: 'NotificationCenter',
	NOTIFICATION_DETAIL: 'NotificationDetail',
	// Cellphone Recharge
	PHONE_RECHARGE: 'PhoneRecharge',
	CONFIRM_PHONE_DIALOG: 'ConfirmPhoneDialog',
	PHONE_CARRIERS_LIST_DIALOG: 'PhoneCarriersDialog',
	PHONE_RECHARGE_SUCCESSFUL: 'PhoneRechargeSuccessful',
	// Mobility Services
	...mobilityServiceRouteNames,
	// Usage Terms,
	ACCEPT_USAGE_TERMS: 'AcceptUsageTerms',
	// Search Points of Interest
	SEARCH_POINTS_OF_INTEREST: 'SearchPointsOfInterest',
	// Search Routes
	SEARCH_ROUTES: 'SearchRoutes',
	...scooterServiceRouteNames,
	// Trace Routes
	TRACE_ROUTES: 'TraceRoutes',

	// Request Card PreAuth
	REQUEST_CARD_PREAUTH: 'RequestCardPreAuth',

	// Request Card
	REQUEST_CARD: 'RequestCard',

	// Request Card Payment
	REQUEST_CARD_PAYMENT: 'RequestCardPayment',

	// Request Card Seccessus
	REQUEST_CARD_PAYMENT_SUCCESSFUL: 'RequestCardSuccessful',

	// Tembici
	TEMBICI: 'Tembici',

	// REQUEST TRANSPORT CARD RECHARGE PENDING SUCCESSFUL
	TRANSPORT_CARD_RECHARGE_PENDING_SUCCESSFUL: 'TransportCardRechargePendingSuccessful',

	// REQUEST TRANSPORT CARD RECHARGE PENDEING ERROR
	TRANSPORT_CARD_RECHARGE_ERROR: 'TransportCardRechargeError',

	// Promocode
	PROMOCODE_MODAL: 'Promocode',

	// Trace Routes
	TRACE_ROUTES: 'TraceRoutes',

	// zascar
	ZAZCAR: 'Zazcar',

	// My Ticket Unitary
	MY_TICKET_UNITARY: 'MyTicketUnitary',

	// SCAN CODE
	SCAN_CODE: 'ScanCode',

	// PurchaseTicketPaymentSucess
	PURCHASE_TICKET_PAYMENT_SUCESSFUL: 'PurchaseTicketPaymentSuccessful',

	// USER EDIT DATA
	USER_EDIT_DATA: 'UserEditData',

	// USER_BLOCKED
	USER_BLOCKED: 'UserBlocked',

	// VERIFICATION_CARD
	VERIFICATION_CARD: 'VerificationCard',

	// VERIFICATION_CARD_CONFIRMATION
	VERIFICATION_CARD_CONFIRMATION: 'VerificationCardConfirmation',

	// VERIFICATION_CARD_CONFIRMATION_FEEDBACK
	VERIFICATION_CARD_CONFIRMATION_FEEDBACK: 'VerificationCardConfirmationFeedback',

	// TICKET INFO
	TICKET_INFO: 'TicketInfo'
};
