// NPM imports
import React from 'react';
import {
  StyleSheet,
  Animated,
  View
} from 'react-native';
import Moment from 'moment';
import { pipe } from 'ramda';

// VouD imports
import Icon from '../Icon';
import { colors } from '../../styles';
import { formatCurrency } from '../../utils/parsers-formaters';
import SystemText from '../SystemText';
import { walletApplicationId } from '../../redux/transport-card';
import { appendIf } from '../../utils/fp-util';

// Component imports
import SecondaryInfo from './SecondaryInfo';

// Component
const BomEscolarContent = ({ data, collapse, small }) => {

  const cardWallets = data.wallets ? data.wallets : [];
  const application = cardWallets.find(wallet => wallet.applicationId === walletApplicationId.BOM_ESCOLAR);

  const getAnimStyles = (collapse, h, mt, mb) => {
    const opacity = collapse.interpolate({
      inputRange: [0, 0.5],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });

    const height = collapse.interpolate({
      inputRange: [0, 1],
      outputRange: [h, 0]
    });

    const marginTop = collapse.interpolate({
      inputRange: [0, 1],
      outputRange: [mt, 0]
    });

    const marginBottom = collapse.interpolate({
      inputRange: [0, 1],
      outputRange: [mb, 0]
    });

    return {
      opacity,
      height,
      marginTop,
      marginBottom
    };
  };

  const renderSecondaryValue = () => {
    const balanceNextRecharge = data.balanceNextRecharge;
    if (balanceNextRecharge > 0)
      return <SecondaryInfo
        value={balanceNextRecharge}
        collapse={collapse}
        icon="validate-bom-card"
        breakLine
      />
  };

  const renderAvailableForPurchase = () => {
    const quoteValueAvailable = application ? application.quoteValueAvailable : 0;
    if (collapse) {
      const animStyles = getAnimStyles(collapse, 36, 0, 8);

      return (
        <Animated.View style={StyleSheet.flatten([styles.availableForPurchase, animStyles])}>
          <SystemText style={styles.secondaryInfoValue}>R$ {formatCurrency(quoteValueAvailable)}</SystemText>
          <SystemText style={styles.secondaryInfoLabel}>Disponível para compra</SystemText>
        </Animated.View>
      );
    } else {
      return (
        <View style={styles.availableForPurchase}>
          <SystemText style={styles.secondaryInfoValue}>R$ {formatCurrency(quoteValueAvailable)}</SystemText>
          <SystemText style={styles.secondaryInfoLabel}>Disponível para compra</SystemText>
        </View>
      );
    }
  };

  const getQuotaAvailableDate = () => {
    return Moment().endOf('month').format('DD/MM');
  };

  const renderExpirationDate = () => {
    if (collapse) {
      const animStyles = getAnimStyles(collapse, 16, 8, 0);

      return (
        <Animated.View style={StyleSheet.flatten([styles.expirationDate, animStyles])}>
          <Icon name="calendar" style={styles.secondaryValueIcon} />
          <SystemText style={styles.secondaryValueText}>
            Até {getQuotaAvailableDate()}
          </SystemText>
        </Animated.View>
      );
    }
    else {
      return (
        <View style={styles.expirationDate}>
          <Icon name="calendar" style={styles.secondaryValueIcon} />
          <SystemText style={styles.secondaryValueText}>
            Até {getQuotaAvailableDate()}
          </SystemText>
        </View>
      );
    }
  };

  const getContainerStyle = pipe(
    () => [styles.container],
    appendIf(styles.containerSmall, small),
    StyleSheet.flatten
  );

  return (
    <View style={getContainerStyle()}>
      <View style={styles.row}>
        <View style={styles.colMain}>
          <SystemText style={styles.typeText}>Saldo escolar</SystemText>
          <SystemText style={styles.valueText}>
            <SystemText style={styles.currencyText}>R$ </SystemText>{formatCurrency(application ? application.balance : 0)}
          </SystemText>
          {/* {renderSecondaryValue()} */}
        </View>
        <View style={styles.colSecondary}>
          {renderAvailableForPurchase()}
          <SystemText style={styles.secondaryInfoValue}>{application ? application.purchasesQuantityAvailable : 0}</SystemText>
          <SystemText style={styles.secondaryInfoLabel}>
            Cotas disponíveis {small && `até ${getQuotaAvailableDate()}`}
          </SystemText>
          {!small && renderExpirationDate()}
        </View>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center'
  },
  colMain: {
    flex: 1,
    justifyContent: 'center'
  },
  colSecondary: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 8
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
    fontSize: 12
  },
  availableForPurchase: {
    marginBottom: 8
  },
  secondaryInfoLabel: {
    fontSize: 10,
    lineHeight: 16,
    color: colors.GRAY
  },
  secondaryInfoValue: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.GRAY
  },
  expirationDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  secondaryValueIcon: {
    width: 16,
    marginRight: 8,
    fontSize: 16,
    textAlign: 'center',
    color: colors.GRAY
  },
  secondaryValueText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.GRAY
  }
});

export default BomEscolarContent;
