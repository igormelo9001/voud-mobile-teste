// NPM imports
import React from "react";
import { StyleSheet, View } from "react-native";
import { pipe } from "ramda";

// VouD imports
import SystemText from "../SystemText";
import { formatCurrency } from "../../utils/parsers-formaters";
import { appendIf } from "../../utils/fp-util";

// Component imports
import SecondaryInfo from "./SecondaryInfo";
import { walletApplicationId } from "../../redux/transport-card";

// Component
const BomComumContent = ({ data, collapse, small }) => {
  const cardWallets = data.wallets ? data.wallets : [];
  const application = cardWallets.find(
    wallet => wallet.applicationId === walletApplicationId.BOM_COMUM
  );

  const renderSecondary = () => {
    const balanceNextRecharge = data.balanceNextRecharge;
    if (balanceNextRecharge > 0)
      return (
        <SecondaryInfo
          value={balanceNextRecharge}
          collapse={collapse}
          icon="validate-bom-card"
        />
      );
  };

  const _getCardContainerStyle = pipe(
    () => [styles.container],
    appendIf(styles.containerSmall, small),
    StyleSheet.flatten
  );

  return (
    <View style={_getCardContainerStyle()}>
      <SystemText style={styles.typeText}>Saldo comum</SystemText>
      <SystemText style={styles.valueText}>
        <SystemText style={styles.currencyText}>R$ </SystemText>
        {formatCurrency(application ? application.balance : 0)}
      </SystemText>
      {/* {renderSecondary()} */}
    </View>
  );
};

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16
  },
  containerSmall: {
    padding: 10
  },
  typeText: {
    fontSize: 10,
    fontWeight: "bold"
  },
  valueText: {
    fontSize: 32,
    lineHeight: 40
  },
  currencyText: {
    fontSize: 16
  }
});

export default BomComumContent;
