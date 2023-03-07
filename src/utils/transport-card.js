import { colors } from "../styles";
import {
  transportCardTypes,
  walletApplicationId,
  getIssuerType,
  issuerTypes,
  transportCardWalletStatus
} from "../redux/transport-card";
import { calculateTaxClear, calculatePurchaseTax } from "../redux/financial";

// consts

const bomLogoImg = require("../images/transport-cards/bom-sm.png");
const buLogoImg = require("../images/transport-cards/bu-sm.png");
const legalLogoImg = require("../images/transport-cards/legal-sm.png");

// utils

export const getColorForLayoutType = layoutType => {
  if (layoutType && layoutType === transportCardTypes.BU) {
    return colors.CARD_BU;
  }

  if (layoutType && layoutType === transportCardTypes.LEGAL) {
    return colors.CARD_LEGAL_PRIMARY;
  }

  if (
    layoutType &&
    (layoutType === transportCardTypes.BOM_VT ||
      layoutType === transportCardTypes.BOM_VT_EXPRESS)
  ) {
    return colors.CARD_VT;
  }

  if (
    layoutType &&
    (layoutType === transportCardTypes.BOM_ESCOLAR ||
      layoutType === transportCardTypes.BOM_ESCOLAR_GRATUIDADE)
  ) {
    return colors.BRAND_SECONDARY;
  }

  return colors.CARD_C;
};

export const getLogoSmForLayoutType = layoutType => {
  if (layoutType && layoutType === transportCardTypes.BU) {
    return buLogoImg;
  }

  if (layoutType && layoutType === transportCardTypes.LEGAL) {
    return legalLogoImg;
  }

  return bomLogoImg;
};

export const getTransportCardIssuerLabel = issuerType => {
  switch (issuerType) {
    case issuerTypes.BOM:
      return "BOM";
    case issuerTypes.BU:
      return "Bilhete Único";
    case issuerTypes.LEGAL:
      return "Cartão Legal";

    default:
      return "";
  }
};

// Card Status

export const isTransportCardScholarNotRevalidated = cardData => {
  const wallets = cardData && cardData.wallets ? cardData.wallets : [];
  const hasScholarNotRevalidated = wallets.some(
    wallet =>
      wallet.applicationId === walletApplicationId.BOM_ESCOLAR &&
      wallet.validityStatus === transportCardWalletStatus.NOT_REVALIDATED
  );
  const hasScholarGratuityNotRevalidated = wallets.some(
    wallet =>
      wallet.applicationId === walletApplicationId.BOM_ESCOLAR_GRATUIDADE &&
      wallet.validityStatus === transportCardWalletStatus.NOT_REVALIDATED
  );

  return hasScholarNotRevalidated && hasScholarGratuityNotRevalidated;
};

// BOM

export const isBOMEscolar = layoutType =>
  layoutType === transportCardTypes.BOM_ESCOLAR ||
  layoutType == transportCardTypes.BOM_ESCOLAR_GRATUIDADE;

//LEGAL
export const isLegal = layoutType => layoutType === transportCardTypes.LEGAL;

const getBOMEscolarMaxCredit = (cardData, creditValueRange) => {
  const wallets = cardData && cardData.wallets ? cardData.wallets : [];
  const application = wallets.find(
    wallet => wallet.applicationId === walletApplicationId.BOM_ESCOLAR
  );
  const quoteValueAvailable = application.quoteValueAvailable
    ? application.quoteValueAvailable * 100
    : 0;

  return quoteValueAvailable > creditValueRange.maxRechargeValue
    ? creditValueRange.maxRechargeValue
    : quoteValueAvailable;
};

export const getBOMMaxCredit = (cardData, creditValueRange) => {
  const layoutType = cardData ? cardData.layoutType : "";
  return isBOMEscolar(layoutType)
    ? getBOMEscolarMaxCredit(cardData, creditValueRange)
    : creditValueRange.maxRechargeValue;
};

// BU

// consts
const buApplicationIds = {
  COMUM: 691,
  ESCOLAR: 687,
  DIARIO_INTEGRADO: 853,
  DIARIO_TRILHO: 850,
  DIARIO_ONIBUS: 847,
  SEMANAL_INTEGRADO: 854,
  SEMANAL_TRILHO: 851,
  SEMANAL_ONIBUS: 848,
  MENSAL_INTEGRADO: 855,
  MENSAL_TRILHO: 852,
  MENSAL_ONIBUS: 849
};

export const buCreditTypeLabels = {
  COMUM: "Comum",
  ESCOLAR: "Escolar",
  TEMPORAL: "Temporal",
  TEMPORAL_DIARIO: "Diário",
  TEMPORAL_MENSAL: "Mensal"
};

export const buPeriodTypeLabels = {
  DIARIO: "Diário",
  SEMANAL: "Semanal",
  MENSAL: "Mensal"
};

export const buTransportTypeLabels = {
  // ONIBUS: 'Ônibus',
  // TRILHO: 'Trilho',
  // INTEGRADO: 'Integrado',
  INTEGRADO: "Ônibus, Mêtro, CPTM",
  TRILHO: "Mêtro e CPTM",
  ONIBUS: "Ônibus"
};

export const getBUCreditTypeLabel = applicationId => {
  switch (applicationId) {
    case buApplicationIds.COMUM:
      return buCreditTypeLabels.COMUM;

    case buApplicationIds.ESCOLAR:
      return buCreditTypeLabels.ESCOLAR;

    case buApplicationIds.DIARIO_INTEGRADO:
    case buApplicationIds.DIARIO_TRILHO:
    case buApplicationIds.DIARIO_ONIBUS:
      return buCreditTypeLabels.TEMPORAL_DIARIO;

    case buApplicationIds.SEMANAL_INTEGRADO:
    case buApplicationIds.SEMANAL_TRILHO:
    case buApplicationIds.SEMANAL_ONIBUS:
    case buApplicationIds.MENSAL_INTEGRADO:
    case buApplicationIds.MENSAL_TRILHO:
    case buApplicationIds.MENSAL_ONIBUS:
      return buCreditTypeLabels.TEMPORAL_MENSAL;

    // return  buCreditTypeLabels.TEMPORAL_DIARIO;

    default:
      return "";
  }
};

export const getBUPeriodTypeLabel = (applicationId, activeMonth) => {
  switch (applicationId) {
    case buApplicationIds.DIARIO_INTEGRADO:
    case buApplicationIds.DIARIO_TRILHO:
    case buApplicationIds.DIARIO_ONIBUS:
      return buPeriodTypeLabels.DIARIO;

    case buApplicationIds.SEMANAL_INTEGRADO:
    case buApplicationIds.SEMANAL_TRILHO:
    case buApplicationIds.SEMANAL_ONIBUS:
      return buPeriodTypeLabels.SEMANAL;

    case buApplicationIds.MENSAL_INTEGRADO:
    case buApplicationIds.MENSAL_TRILHO:
    case buApplicationIds.MENSAL_ONIBUS:
      return activeMonth && buPeriodTypeLabels.MENSAL;
    // return buPeriodTypeLabels.MENSAL;

    default:
      return "";
  }
};

export const getBUTransportTypeLabel = applicationId => {
  switch (applicationId) {
    case buApplicationIds.DIARIO_ONIBUS:
    case buApplicationIds.SEMANAL_ONIBUS:
    case buApplicationIds.MENSAL_ONIBUS:
      return buTransportTypeLabels.ONIBUS;

    case buApplicationIds.DIARIO_TRILHO:
    case buApplicationIds.SEMANAL_TRILHO:
    case buApplicationIds.MENSAL_TRILHO:
      return buTransportTypeLabels.TRILHO;

    case buApplicationIds.DIARIO_INTEGRADO:
    case buApplicationIds.SEMANAL_INTEGRADO:
    case buApplicationIds.MENSAL_INTEGRADO:
      return buTransportTypeLabels.INTEGRADO;

    default:
      return "";
  }
};

export const getBUSupportedCreditTypes = (cardData, ignoreList = []) =>
  Object.values(buCreditTypeLabels).filter(
    label =>
      cardData &&
      cardData.wallets &&
      cardData.wallets.some(
        el =>
          getBUCreditTypeLabel(el.applicationId) === label &&
          !ignoreList.some(el => el === label)
      )
  );

export const getBUSupportedPeriodTypes = cardData =>
  Object.values(buPeriodTypeLabels).filter(
    label =>
      cardData &&
      cardData.wallets &&
      cardData.wallets.some(
        el => getBUPeriodTypeLabel(el.applicationId) === label
      )
  );

export const getTemporalCreditValueLabel = (
  periodType,
  transportType,
  quotaQty
) => {
  const quotaTypeLabel =
    periodType === ""
      ? "Temporal"
      : `${periodType} ${transportType ? transportType.toLowerCase() : ""}`;
  return `${quotaTypeLabel} - ${quotaQty} ${
    quotaQty === 1 ? " cota" : " cotas"
  }`;
};

export const getDefaultCreditValueFieldLabel = (layoutType, buCreditType) =>
  `Valor do crédito${
    buCreditType && layoutType === transportCardTypes.BU
      ? ` ${buCreditType.toLowerCase()}`
      : ""
  }`;

export const getCreditValueFieldLabel = (
  cardData,
  buCreditType,
  buPeriodType,
  buTransportType,
  buQuotaQty
) => {
  const isBU = cardData && cardData.layoutType === transportCardTypes.BU;
  const layoutType = cardData && cardData.layoutType ? cardData.layoutType : "";
  return isBU && buCreditType === buCreditTypeLabels.TEMPORAL
    ? getTemporalCreditValueLabel(buPeriodType, buTransportType, buQuotaQty)
    : getDefaultCreditValueFieldLabel(layoutType, buCreditType);
};

export const findBUTemporalProduct = (
  wallets = [],
  periodType,
  transportType,
  activeMonth
) =>
  wallets.find(
    el =>
      periodType !== "" &&
      getBUPeriodTypeLabel(el.applicationId, activeMonth) === periodType &&
      transportType !== "" &&
      getBUTransportTypeLabel(el.applicationId) === transportType
  );

export const findBUProduct = (
  wallets = [],
  buCreditType,
  periodType = "",
  transportType = "",
  activeMonth = ""
) => {
  const resultWallet = wallets.find(
    el => getBUCreditTypeLabel(el.applicationId) === buCreditType
  );
  const resultBUTemp = findBUTemporalProduct(
    wallets,
    periodType,
    transportType,
    activeMonth
  );
  const buProduct =
    buCreditType === buCreditTypeLabels.TEMPORAL_DIARIO ||
    buCreditType === buCreditTypeLabels.TEMPORAL_MENSAL
      ? resultBUTemp
      : resultWallet;
  return buProduct;
};

export const filterBUTransportTypeOptionsByPeriod = (
  wallets = [],
  periodType,
  activeMonth
) => {
  const productsFilteredByPeriod = wallets.filter(
    el => getBUPeriodTypeLabel(el.applicationId, activeMonth) === periodType
  );
  return Object.values(buTransportTypeLabels).filter(label =>
    productsFilteredByPeriod.some(
      el => getBUTransportTypeLabel(el.applicationId) === label
    )
  );
};

// Calculate Tax

export const calculateTax = (
  dispatch,
  cardData,
  creditValue,
  creditValueRange,
  buCreditType,
  selectedTemporalProduct
) => {
  if (creditValue < creditValueRange.minCreditValue) {
    dispatch(calculateTaxClear());
  } else {
    let buAdditionalData = {};
    if (cardData.layoutType === transportCardTypes.BU) {
      const buProduct = selectedTemporalProduct
        ? selectedTemporalProduct
        : findBUProduct(cardData.wallets, buCreditType);
      buAdditionalData = {
        idTransportCardWallet: buProduct ? buProduct.id : 0
      };
    }

    dispatch(
      calculatePurchaseTax({
        value: creditValue / 100,
        uuid: cardData.uuid,
        issuerType: getIssuerType(cardData.issuer),
        ...buAdditionalData
      })
    );
  }
};
