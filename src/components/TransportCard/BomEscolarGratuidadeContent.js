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
import SystemText from '../SystemText';
import { walletApplicationId } from '../../redux/transport-card';
import { appendIf } from '../../utils/fp-util';

// Component
const BomEscolarGratuidadeContent = ({ data, collapse, small }) => {

  const cardWallets = data.wallets ? data.wallets : [];
  const application = cardWallets.find(wallet => wallet.applicationId === walletApplicationId.BOM_ESCOLAR_GRATUIDADE);

  const _calculateActualQuota = () => {
    let actualQuota = 0;
    if (application) {
      actualQuota = application.gratuityLimit - application.gratuityUsed;
    }
    return actualQuota > 0 ? actualQuota : 0;
  }

  const _getQuotaAvailableDate = () => {
    return Moment().endOf('month').format('DD/MM');
  }

  const _getCardContainerStyle = pipe(
    () => [styles.container],
    appendIf(styles.containerSmall, small),
    StyleSheet.flatten,
  )

  const renderSecondary = () => {
    if (collapse) {
      const opacity = collapse.interpolate({
        inputRange: [0, 0.5],
        outputRange: [1, 0],
        extrapolate: 'clamp'
      });

      const height = collapse.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 0]
      });

      const marginTop = collapse.interpolate({
        inputRange: [0, 1],
        outputRange: [8, 0]
      });

      const animStyles = {
        opacity,
        height,
        marginTop
      };

      return (
        <Animated.View style={StyleSheet.flatten([styles.secondaryValue, animStyles])}>
          <Icon name="calendar" style={styles.secondaryValueIcon} />
          <SystemText style={styles.secondaryValueText}>
            Até {_getQuotaAvailableDate()}
          </SystemText>
        </Animated.View>
      );
    } else {
      return (
        <View style={styles.secondaryValue}>
          <Icon name="calendar" style={styles.secondaryValueIcon} />
          <SystemText style={styles.secondaryValueText}>
            Até {_getQuotaAvailableDate()}
          </SystemText>
        </View>
      );
    }
  };

  return (
    <View style={_getCardContainerStyle()}>
      <View style={styles.row}>
        <View style={StyleSheet.flatten([styles.col, { marginLeft: 0 }])}>
          <SystemText style={styles.typeText}>Cota atual</SystemText>
          <SystemText style={styles.valueText}>
            {_calculateActualQuota()}
          </SystemText>
          {renderSecondary()}
        </View>
        <View style={styles.col}>
          <SystemText style={StyleSheet.flatten([styles.typeText, { color: colors.GRAY }])}>Cota mensal</SystemText>
          <SystemText style={StyleSheet.flatten([styles.valueText, { color: colors.GRAY }])}>
            {application && (application.gratuityLimit ? application.gratuityLimit : 0)}
          </SystemText>
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
    fontSize: 32,
    lineHeight: 40
  },
  currencyText: {
    fontSize: 16
  },
  secondaryValue: {
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
    color: colors.GRAY
  }
});

export default BomEscolarGratuidadeContent;
