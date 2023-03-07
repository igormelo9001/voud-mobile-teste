// NPM imports
import React, { Component } from 'react';
import { StyleSheet, Image, View, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// VouD imports
import BrandText from '../../components/BrandText';
import BrandContainer from '../../components/BrandContainer';
import Button from '../../components/Button';
import { routeNames } from '../../shared/route-names';
import { navigateToRoute } from '../../redux/nav';
import { initCheckDebitCardPaymentStatus } from '../../utils/debit-card';
import { showBuySessionExitAlert } from '../../shared/buy-session-timer';
import { backToHome } from '../../redux/nav';

// TODO - unused image
// const bankImage = require('../../images/bank.png');

class DebitCardRedirectAlertView extends Component {

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  _backHandler = () => true;

  _openAuthenticationURL = () => {
    const { dispatch, navigation: { state: { params } } } = this.props;
    const paymentStatusTimer = initCheckDebitCardPaymentStatus(dispatch, params);

    const closeAction = () => {
      showBuySessionExitAlert(dispatch, false, () => {
        clearInterval(paymentStatusTimer);
        dispatch(backToHome());
      });
    };
    
    dispatch(navigateToRoute([NavigationActions.back(), routeNames.BROWSER], { source: params.authenticationUrl, closeAction }));
  }
  
  render() {
    return (
      <BrandContainer>
        <View style={styles.alertView}>
          <Image
            source={bankImage}
          />
          <BrandText style={styles.alertTitle}>
            Você será direcionado para a área segura de seu banco.
          </BrandText>
          <BrandText style={styles.alertText}>
            A aprovação de seu pagamento estará sujeita à análise e validação de seu banco.
          </BrandText>

          <Button
            style={styles.alertButton}
            buttonStyle={styles.alertButtonStyle}
            outline
            onPress={this._openAuthenticationURL}
          >
            Avançar
          </Button>
        </View>
      </BrandContainer>
    )
  }
}

// Styles
const styles = StyleSheet.create({
  alertView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
    paddingHorizontal: 24,
  },
  alertTitle: {
    textAlign: 'center',
    fontSize: 24,
    color: 'white',
    marginTop: 40,
    marginBottom: 16,
  },
  alertText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'white'
  },
  alertButton: {
    position: 'absolute',
    bottom: 24,
    width: '100%'
  },
  alertButtonStyle: {
    borderColor: 'white'
  }
});

export const DebitCardRedirectAlert = connect()(DebitCardRedirectAlertView);