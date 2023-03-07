import firebase from "react-native-firebase";

// Set user id

export const GASetUser = id => {
  firebase.analytics().setUserId(id);
};

// Track screen
export const GATrackScreen = nextScreen => {
  firebase.analytics().setAnalyticsCollectionEnabled(true);
  firebase.analytics().logEvent(nextScreen, {});
  firebase.analytics().setCurrentScreen(nextScreen, nextScreen);
};

// Track event

export const GATrackEvent = (
  category = "",
  action = "",
  label = "",
  value = null
) => {
  firebase.analytics().setAnalyticsCollectionEnabled(true);
  firebase.analytics().logEvent(category, { label, value, action });
};

// Track purchase event

export const GATrackPurchaseEvent = (
  product = {},
  transaction = {},
  eventCategory = "",
  eventAction = ""
) => {
  firebase.analytics().logEvent(product.name, {
    product,
    transaction,
    eventCategory,
    eventAction
  });
};

// GA event params

export const GAEventParams = {
  categories: {
    BUTTON: "button",
    FORM: "form",
    ERROR: "erro"
  },
  actions: {
    CLICK: "click",
    SUBMIT: "submit"
  },
  labels: {
    LOGIN: "Cadastrar",
    REPORT: "Denunciar",
    SUBMIT_PRE_AUTH: "CPF",
    SUBMIT_REGISTER: "Cadastro",
    SUBMIT_LOGIN: "Login",
    FORGET_PASSWORD: "EsqueciSenha",
    SUBMIT_RECOVER_PW: "Redefinir",
    SUBMIT_MOBILE_VALIDATION_CODE: "CodValidacao",
    REGISTER_EDIT_MOBILE: "CadastroEditarCelular",
    REGISTER_EDIT_EMAIL: "CadastroEditarEmail",
    FINISH_REGISTER: "Validacao",
    ADD_CARD: "AddCard",
    MENU_TRANSPORT_CARDS: "CartoesMenu",
    MENU_TRANSPORT_CARD_DETAILS: "DetalheCartaoMenu",
    MENU_ADD_CARD: "AddCardMenu",
    MENU_SMART_PURCHASE: "CompraProgramadaMenu",
    MENU_PURCHASE_HISTORY: "HistoricoMenu",

    MENU_VOUD_CAR: "MenuVoudCarro",
    MENU_MOBILITY_SERVICES: "TaxiMobilidadeSubMenu",
    MENU_MOBILITY_RENTCAR: "CarroAluguelMobilidadeSubMenu",

    MENU_SCOOTER_SERVICES: "ScooPatineteMobilidadeMenu",
    MENU_REPORT: "DenunciaMenu",
    MENU_HELP: "AjudaMenu",
    MENU_MY_PROFILE: "PerfilMenu",
    MENU_PAYMENT_METHODS: "FormasPagamentoMenu",
    MENU_LOGOUT: "SairMenu",
    MENU_HOME: "InicioMenu",
    MENU_LOGIN: "CadastrarMenu",
    MENU_PHONE_RECHARGE: "RecargaCelularMenu",
    MENU_SUPPORT: "Suporte",
    MENU_DISCOUNT_PAGE: "DescontosMenu",
    UNLOGGED_MENU_DISCOUNT_PAGE: "DescontosMenuDeslogado",
    UNLOGGED_MENU_SMART_PURCHASE: "CompraProgramadaMenuDeslogado",
    UNLOGGED_MENU_MOBILITY_SERVICES: "TaxiMobilidadeMenuDeslogado",
    UNLOGGED_MENU_REPORT: "DenunciaMenuDeslogado",
    UNLOGGED_MENU_HELP: "AjudaMenuDeslogado",
    UNLOGGED_MENU_SUPORT: "SuporteDeslogado",
    MENU_TEMBICI: "MenuTembici",
    TRANSPORT_CARD_DETAILS: "Cartao",
    BUY: "ComprarCreditos",
    SUBMIT_DEBIT_CARD_PAYMENT: "EnvioCompraDebito",
    SUBMIT_DEBIT_CARD_PAYMENT_ERROR: "ErroEnvioCompraDebito",
    SUBMIT_CREDIT_CARD_PAYMENT: "EnvioCompraCredito",
    SUBMIT_CREDIT_CARD_PAYMENT_ERROR: "ErroEnvioCompraCredito",

    SUBMIT_REQUEST_CARD_PAYMENT: "EnvioSolicitacaoPrimeiraVia",
    SUBMIT_REQUEST_CARD_PAYMENT_ERROR: "ErroEnvioSolicitacao",

    // Reports
    REPORT_START: "Denuncia",
    CHANGE_REPORT_CATEGORY: "AlterouDenuncia", // + report category
    REPORT_LOCATION_TYPE: "LocalAssedio", // + report location type
    SUBMIT_REPORT: "DenunciaFeita",
    SUBMIT_REPORT_FINISH: "DenunciaFinalizada",
    CALL_EMERGENCY: "ChamadaEmergencia",
    REPORT_IS_HAPPENING: "DenunciaOcorrendoAgora",
    // Payment Method
    SUBMIT_SAVE_PAYMENT_METHOD: "SaveCard",
    // MGM
    SHARE_MGM_DEEP_LINK: "CompartilhouDeepLinkMGM",
    // VAH
    VAH_OPEN_PLAYER_DEEP_LINK: "AbriuPlayerDeepLinkVAH",
    // Phone Recharge
    SELECT_PHONE_CARRIER: "SelecionouOperadoraCelular",
    // Search Route
    OPEN_GOOGLE_MAPS_ROUTE: "AbriuRotaGoogleMaps",

    // Trace Route
    OPEN_GOOGLE_MAPS_TRACE_ROUTE: "AbriuRotaGoogleMaps",

    // Discount Page
    OPEN_DISCOUNT_PAGE: "AbriuPaginaDescontos",

    // Scoo
    SCOO_PRE_PAYMENT: "PrePagamentoScoo",
    SCOO_START_RIDE: "InicioCorridaScoo",
    SCOO_END_RIDE: "FimCorridaScoo",
    // Request Card

    SUBMIT_REQUEST_CARD_PRE_AUTH: "CPF",
    SUBMIT_CREDIT_QRCODE_PAYMENT: "EnvioCompraCreditoQRCode"
  }
};
