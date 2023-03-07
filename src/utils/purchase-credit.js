import { configErrorHandler } from "../shared/config-error-handler";
import { cardHasSufficientQuota, getBomEscolarQuoteValueAvailable, insufficientQuotaErrorHandler } from "../shared/insufficient-quota";
import { checkIssuerEnabled } from "./issuer-config";
import { GATrackEvent, GAEventParams } from "../shared/analytics";
import { FBLogEvent, FBEventsConstants } from "../shared/facebook";
import { routeNames } from "../shared/route-names";
import { setPurchaseTransportCard } from "../redux/financial";
import { navigateToRoute } from "../redux/nav";

export const goToPurchaseCredit = (dispatch, cardData, minRechargeValue, issuerConfig, hasConfigError, configUi) => {
  if (!cardData) return;
  
  if (hasConfigError || configUi.isFetching) {
    configErrorHandler();
  } else if (!cardHasSufficientQuota(cardData, minRechargeValue / 100)) {
    const quotaValue = getBomEscolarQuoteValueAvailable(cardData);
    insufficientQuotaErrorHandler(quotaValue, minRechargeValue / 100);
  } else {
    if (checkIssuerEnabled(cardData.issuerType, issuerConfig)) {
      const { categories: { BUTTON }, actions: { CLICK }, labels: { BUY } } = GAEventParams;

      GATrackEvent(BUTTON, CLICK, BUY);
      FBLogEvent(FBEventsConstants.INITIATED_CHECKOUT);
      
      dispatch(setPurchaseTransportCard(cardData.uuid));
      dispatch(navigateToRoute(routeNames.BUY_CREDIT));
    }
  }
};