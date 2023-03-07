// NPM Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  BackHandler,
  ScrollView,
  AppState,
  Alert,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

// VouD Imports
import Header, { headerActionTypes } from '../../components/Header';
import RechargeForm from './RechargeForm';
import { navigateToRoute } from '../../redux/nav';
import { routeNames } from '../../shared/route-names';
import { fetchSavedPaymentMethods, selectFirstPaymentMethod, unselectPaymentMethod } from '../../redux/payment-method';
import { fetchSmartPurchases } from '../../redux/smart-purchase';
import { showBuySessionExitAlert } from '../../shared/buy-session-timer';
import { productTypes, paymentCardTypes } from '../../redux/financial';
import { getStateCurrentRouteName } from '../../utils/nav-util';
import KeyboardDismissView from '../../components/KeyboardDismissView';
import RequestFeedback from '../../components/RequestFeedback';
import { getSavedPaymentMethodsUI, getSmartPurchaseListUI, getSelectedPaymentMethod } from '../../redux/selectors';

// Component
const propTypes = {
  dispatch: PropTypes.func.isRequired,
}

class PhoneRechargeView extends Component {

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentDidMount() {
    this._fetchRequests();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);

    this.props.dispatch(unselectPaymentMethod());
  }

  _backHandler = () => {
    const { nav } = this.props;
    const currentRouteName = getStateCurrentRouteName(nav);

    if (currentRouteName === routeNames.PHONE_RECHARGE) {
      this._back();
      return true;
    }
    return false;
  }

  _back = () => {
    showBuySessionExitAlert(this.props.dispatch, false);
  }

  _close = () => {
    this.props.dispatch(NavigationActions.back());
  }

  _fetchRequests = () => {
    const { dispatch, selectedPaymentMethod } = this.props;
    dispatch(fetchSavedPaymentMethods()).then(() => {
      if (!selectedPaymentMethod) dispatch(selectFirstPaymentMethod());
    });
    dispatch(fetchSmartPurchases());
  }

  _submit = formData => {
    const {
      paymentMethod : {
        id,
        isTemporaryCard,
        saveCreditCard,
        items : { cardNumber, expirationDate, cardFlag, cardToken, cardHolder },
      },
      selectedValue,
      phoneNumber,
      phoneCarrierName
    } = formData;

    const paymentData = {
      productType: productTypes.PHONE_RECHARGE,
      phoneNumber,
      phoneCarrierName,
      rechargeValue: selectedValue ? selectedValue.custRecharge * 100 : 0,
      rechargeProductId: selectedValue ? selectedValue.productId : null,
      paymentCardType: paymentCardTypes.CREDIT,
      paymentMethodId: !isTemporaryCard ? id : null,
      creditCardNumber: cardNumber ? cardNumber : null,
      creditCardExpirationDate: expirationDate ? expirationDate : null,
      creditCardBrand: cardFlag ? cardFlag : null,
      cardToken: cardToken ? cardToken : null,
      saveCreditCard: saveCreditCard ? saveCreditCard : null,
      creditCardHolder: cardHolder ? cardHolder : null,
    };
    this.props.dispatch(navigateToRoute(routeNames.PURCHASE_CONFIRMATION_DIALOG, { paymentData }));
  }

  render() {
    const { savedPaymentMethodsUi, smartPurchaseUi, userLogged } = this.props;

    const hideForm = savedPaymentMethodsUi.isFetching || savedPaymentMethodsUi.error !== '' ||
      smartPurchaseUi.isFetching || smartPurchaseUi.error !== '';

    return (
      <View style={styles.container}>
        <Header
          title="Recarga de celular"
          left={{
            type: headerActionTypes.BACK,
            onPress: this._back
          }}
        /> 
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="always"
        >
          <KeyboardDismissView>
            {
              hideForm &&
              <View style={styles.requestFeedbackContainer}>
                <RequestFeedback
                  loadingMessage="Carregando..."
                  errorMessage={savedPaymentMethodsUi.error || smartPurchaseUi.error}
                  retryMessage="Tentar novamente"
                  isFetching={savedPaymentMethodsUi.isFetching || smartPurchaseUi.isFetching}
                  onRetry={this._fetchRequests}
                />
              </View>
            }
            <View style={hideForm ? styles.hideForm : styles.formContainer}>
              {<RechargeForm
                onSubmit={this._submit} 
              />}
            </View>
          </KeyboardDismissView>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#FFF",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1
  },
  formContainer: {
    flex: 1
  },
  hideForm: {
    width: 0,
    height: 0
  },
  requestFeedbackContainer: {
    flex: 1,
    justifyContent: 'center'
  },
})

PhoneRechargeView.propTypes = propTypes;

// redux connect and export
const mapStateToProps = state => {
  return {
    nav: state.nav,
    savedPaymentMethodsUi: getSavedPaymentMethodsUI(state),
    smartPurchaseUi: getSmartPurchaseListUI(state),
    selectedPaymentMethod: getSelectedPaymentMethod(state),
  };
};

export const PhoneRecharge = connect(mapStateToProps)(PhoneRechargeView);

export * from './ConfirmPhoneDialog';
export * from './PhoneCarriersListDialog';
export * from './PhoneRechargeSuccessful';