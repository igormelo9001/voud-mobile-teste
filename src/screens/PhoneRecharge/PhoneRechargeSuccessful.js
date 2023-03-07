// NPM imports
import React, { Component } from 'react';
import { ScrollView, StyleSheet, Image, View, BackHandler } from 'react-native';
import { connect } from 'react-redux';

// VouD imports
import BrandText from '../../components/BrandText';
import SystemText from '../../components/SystemText';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import { backToHome } from '../../redux/nav';
import { colors } from '../../styles';
import { formatCurrencyFromCents } from '../../utils/parsers-formaters';
import { getPaddingForNotch } from '../../utils/is-iphone-with-notch';

const cellPhone = require('../../images/cellphone-green.png');

// Screen component
class PhoneRechargeSuccessfulView extends Component {

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentDidMount() {
    RatingTracker.handlePositiveEvent();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  _backHandler = () => {
    this._finish();
    return true;
  };

  _finish = () => {
    this.props.dispatch(backToHome());
  };

  render() {
    const { navigation: { state: { params: { paymentData } } } } = this.props;
    const rechargeValue = paymentData && paymentData.rechargeValue ? paymentData.rechargeValue : 0;
    
    return (
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Icon
            style={styles.closeIcon}
            name="close"
            onPress={this._finish}
          />
          <Icon
            style={styles.successIcon}
            name="checkmark-circle-outline"
          />
          <SystemText style={styles.purchaseValue}>
            {`R$ ${formatCurrencyFromCents(rechargeValue)}`}
          </SystemText>
          <BrandText style={styles.successTitle}>
            {'Recarga realizada com sucesso!'}
          </BrandText>
        </View>
        <View style={styles.cellphoneImageContainer}>
          <Image style={styles.cellPhoneImage} source={cellPhone} />
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContainer}>
          <SystemText style={styles.phoneRechargeText}>
            {`Esta transação pode ser visualizada no histórico de compras.`}
          </SystemText>
        </ScrollView>
        <View style={styles.actionBtnContainer}>
          <Button
            onPress={this._finish}>
            Voltar para a home
          </Button>
        </View>
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    paddingTop: getPaddingForNotch() + 48,
    backgroundColor: colors.BRAND_SUCCESS,
    alignItems: 'center',
    paddingHorizontal: 16
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 16,
  },
  closeIcon: {
    color: 'white',
    width: 24,
    fontSize: 24,
    position: 'absolute',
    top: 40,
    left: 16,
  },
  successIcon: {
    color: 'white',
    width: 72,
    fontSize: 72,
    marginBottom: 16,
  },
  purchaseValue: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 32,
    lineHeight: 32,
    marginBottom: 8
  },
  purchaseValueNormal: {
    fontWeight: 'normal'
  },
  successTitle: {
    color: 'white',
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 87,
  },
  phoneRechargeText: {
    color: colors.GRAY,
    fontSize: 16,
    lineHeight: 24,
  },
  cellphoneImageContainer: {
    alignItems: 'center',
  },
  cellPhoneImage: {
    marginTop: -63,
    width: 114,
    height: 125,
  },
  actionBtnContainer: {
    padding: 16
  },
});

export const PhoneRechargeSuccessful = connect()(PhoneRechargeSuccessfulView);