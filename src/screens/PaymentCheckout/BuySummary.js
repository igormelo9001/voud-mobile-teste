// NPM imports
import React, { Component } from 'react';
import { pipe } from 'ramda';
import { StyleSheet, View } from 'react-native';

// VouD imports
import SystemText from '../../components/SystemText';
import BrandText from '../../components/BrandText';
import Spinner from '../../components/Spinner';
import Icon from '../../components/Icon';
import MessageBox from '../../components/MessageBox';
import { colors } from '../../styles';

import { formatCurrencyFromCents, formatCurrency } from '../../utils/parsers-formaters';
import TouchableText from '../../components/TouchableText';
import { productTypes } from '../../redux/financial';
import { appendIf } from '../../utils/fp-util';
import Button from '../../components/Button';

// component
class BuySummary extends Component {
  _isDisabled = () => {
    const { valid } = this.props;
    return !valid;
  };

  _getFooterStyles = () => {
    const { style } = this.props;
    return pipe(
      () => [style, styles.footer],
      appendIf(styles.footerDisabled, this._isDisabled()),
      StyleSheet.flatten
    )();
  };

  _getHrStyles = () => {
    return pipe(
      () => [styles.hr],
      appendIf(styles.hrDisabled, this._isDisabled()),
      StyleSheet.flatten
    )();
  };

  _getTextStyles = base => {
    return pipe(
      () => [base],
      appendIf(styles.textDisabled, this._isDisabled()),
      StyleSheet.flatten
    )();
  };

  _getTotalValue = () => {
    const { rechargeValue, discountValue, isTicketUnitary } = this.props;
    const discount = discountValue || 0;
    const value = isTicketUnitary ? rechargeValue * 100 : rechargeValue;

    return Number(value - discount * 100);
  };

  render() {
    const {
      rechargeValue,
      discountValue,
      discountLabel,
      finishPurchaseError,
      creditValueLabel,
      showSubmitButton,
      submit,
      smartPurchaseFlow,
      valid,
    } = this.props;

    return (
      <View style={this._getFooterStyles()}>
        <View style={styles.row}>
          <BrandText style={this._getTextStyles(styles.description)}>{creditValueLabel}</BrandText>
          <SystemText style={this._getTextStyles(styles.value)}>
            R$ {formatCurrencyFromCents(rechargeValue)}
          </SystemText>
        </View>
        {discountValue && (
          <View style={styles.row}>
            <BrandText style={this._getTextStyles(styles.description)}>{discountLabel}</BrandText>
            <SystemText style={this._getTextStyles(styles.value)}>
              R$ {formatCurrency(discountValue)}
            </SystemText>
          </View>
        )}

        <View style={this._getHrStyles()} />
        <View style={StyleSheet.flatten([styles.row, styles.mb0])}>
          <BrandText
            style={this._getTextStyles(StyleSheet.flatten([styles.description, styles.boldFont]))}
          >
            Valor total
          </BrandText>
          <SystemText
            style={this._getTextStyles(StyleSheet.flatten([styles.value, styles.boldFont]))}
          >
            R$ {formatCurrencyFromCents(this._getTotalValue())}
          </SystemText>
        </View>
        {finishPurchaseError && finishPurchaseError !== '' ? (
          <MessageBox message={finishPurchaseError} style={styles.errorMessage} />
        ) : null}
        {showSubmitButton && (
          <Button style={styles.submitButton} disabled={!valid} onPress={submit}>
            {smartPurchaseFlow ? 'Programar compra' : 'Comprar'}
          </Button>
        )}
      </View>
    );
  }
}

// styles
const styles = StyleSheet.create({
  footer: {
    padding: 16,
    backgroundColor: colors.BRAND_PRIMARY_LIGHTER,
  },
  footerDisabled: {
    backgroundColor: colors.GRAY_LIGHT,
  },
  disabledFooter: {
    opacity: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
  },
  errorIcon: {
    marginRight: 8,
    fontSize: 16,
    color: 'white',
  },
  errorText: {
    fontSize: 12,
    color: 'white',
  },
  description: {
    flex: 1,
    fontSize: 14,
    color: 'white',
  },
  descriptionWithSpinnerWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionWithSpinner: {
    fontSize: 14,
    color: 'white',
    marginRight: 8,
  },
  value: {
    fontSize: 16,
    color: 'white',
  },
  boldFont: {
    fontWeight: 'bold',
  },
  hr: {
    height: 1,
    marginBottom: 16,
    backgroundColor: colors.BRAND_SECONDARY,
  },
  hrDisabled: {
    backgroundColor: colors.GRAY,
  },
  errorMessage: {
    marginBottom: 16,
  },
  touchableText: {
    textAlign: 'left',
  },
  taxExemption: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 16,
  },
  taxExemptionText: {
    fontSize: 16,
    color: colors.BRAND_PRIMARY_LIGHTER,
  },
  textDisabled: {
    color: colors.GRAY,
  },
  submitButton: {
    marginTop: 16,
  },
  mb0: {
    marginBottom: 0,
  },
});

export default BuySummary;
