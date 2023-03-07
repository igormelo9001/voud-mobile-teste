import { GATrackPurchaseEvent } from "../shared/analytics";
import { FBLogPurchase } from "../shared/facebook";
import { productTypes } from "../redux/financial";

const getProductId = productType => {
  const typesMap = {
    [productTypes.BOM]: "1",
    [productTypes.BU]: "2",
    [productTypes.PHONE_RECHARGE]: "3",
    [productTypes.QRCODE]: "4"
  };
  return typesMap[productType];
};

export const trackPurchaseEvent = (
  transactionId,
  revenue,
  serviceTax,
  productType
) => {
  const revenueAsNumber = Number(revenue);
  const serviceTaxAsNumber = Number(serviceTax);
  const totalAmount = revenueAsNumber + serviceTaxAsNumber;

  GATrackPurchaseEvent(
    {
      id: getProductId(productType),
      name: productType
    },
    {
      id: `${transactionId}`,
      revenue: revenueAsNumber,
      tax: serviceTaxAsNumber
    },
    "Ecommerce",
    "transaction"
  );

  FBLogPurchase(totalAmount);
};
