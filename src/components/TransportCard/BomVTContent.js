// NPM imports
import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { pipe } from 'ramda';

// VouD imports
import SystemText from '../SystemText';
import { formatCurrency } from '../../utils/parsers-formaters';

// Component imports
import SecondaryInfo from './SecondaryInfo';
import { walletApplicationId } from '../../redux/transport-card';
import { appendIf } from '../../utils/fp-util';

// Component
const BomVTContent = ({ data, collapse, small }) => {

  const cardWallets = data.wallets ? data.wallets : [];
  const vtApplication = cardWallets.find(wallet => wallet.applicationId === walletApplicationId.BOM_VT);
  const comumApplication = cardWallets.find(wallet => wallet.applicationId === walletApplicationId.BOM_COMUM);

  const renderSecondary = () => {
    const balanceNextRecharge = data.balanceNextRecharge;
    if (balanceNextRecharge > 0)
      return <SecondaryInfo
        value={balanceNextRecharge}
        collapse={collapse}
        icon="validate-bom-card"
      />
  };

  const _getBalance = (application) => {
    return formatCurrency(application ? application.balance : 0);
  }

  const _getCardContainerStyle = pipe(
    () => [styles.container],
    appendIf(styles.containerSmall, small),
    StyleSheet.flatten,
  )

  return (
    <View style={_getCardContainerStyle()}>
      <View style={styles.row}>
        <View style={StyleSheet.flatten([styles.col, { marginLeft: 0 }])}>
          <SystemText style={styles.typeText}>Saldo vale-transporte</SystemText>
          <SystemText style={styles.valueText}>
            <SystemText style={styles.currencyText}>R$ </SystemText>{_getBalance(vtApplication)}
          </SystemText>
        </View>
        <View style={styles.col}>
          <SystemText style={styles.typeText}>Saldo comum</SystemText>
          <SystemText style={styles.valueText}>
            <SystemText style={styles.currencyText}>R$ </SystemText>{_getBalance(comumApplication)}
          </SystemText>
        </View>
      </View>
      {/* {renderSecondary()} */}
    </View>
  );
};

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16
  },
  containerSmall: {
    padding: 10
  },
  row: {
    flexDirection: 'row'
  },
  col: {
    flex: 1,
    marginLeft: 16
  },
  typeText: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  valueText: {
    fontSize: 24,
    lineHeight: 32
  },
  currencyText: {
    fontSize: 16
  }
});

export default BomVTContent;
