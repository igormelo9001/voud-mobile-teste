import React, { PureComponent } from 'react';
import { View, BackHandler, ScrollView, AppState } from 'react-native';
import { connect } from 'react-redux';

import { reduxForm, Field, formValueSelector, change } from 'redux-form';

// VouD imports
import Header, { headerActionTypes } from '../../../../components/Header';
import { showBuySessionExitAlert } from '../../../../shared/buy-session-timer';
import { routeNames } from '../../../../shared/route-names';
import { required } from '../../../../utils/validators';
import { getStateCurrentRouteName } from '../../../../utils/nav-util';
import { navigateToRoute } from '../../../../redux/nav';
import {
  fetchSavedPaymentMethods,
  selectFirstPaymentMethod,
  unselectPaymentMethod,
} from '../../../../redux/payment-method';
import { clearReduxForm } from '../../../../utils/redux-form-util';
import {
  getPurchaseTransportCard,
  getSavedPaymentMethodsUI,
  getSelectedPaymentMethod,
} from '../../../../redux/selectors';
import { productTypes, paymentCardTypes } from '../../../../redux/financial';

import styles from './style';
import VoudText from '../../../../components/VoudText';
import PaymentMethodField from '../../../../screens/BuyCredit/PurchaseForm/PaymentMethodField';
import Button from '../../../../components/Button';

// consts
const reduxFormName = 'requestCardPaymentForm';

class RequestCardPaymentView extends PureComponent {
  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state.params;
    const userData = JSON.parse(params);

    this.state = {
      userData: {
        address:
          userData.addressDelivery.zip !== undefined ? userData.addressDelivery : userData.address,
        value: userData.value,
      },
    };
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentDidMount() {
    const { selectedPaymentMethod } = this.props;
    if (selectedPaymentMethod === undefined) {
      this._fetchPaymentMethods();
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
    if (AppState.currentState === 'active') {
      this.props.dispatch(unselectPaymentMethod());
    }
  }

  _fetchPaymentMethods = () => {
    const { dispatch } = this.props;
    dispatch(fetchSavedPaymentMethods()).then(() => {
      dispatch(selectFirstPaymentMethod());
    });
  };

  _backHandler = () => {
    const { nav } = this.props;
    const currentRouteName = getStateCurrentRouteName(nav);

    if (currentRouteName === routeNames.REQUEST_CARD_PAYMENT) {
      this._back();
      return true;
    }
    return false;
  };

  _back = () => {
    const { dispatch } = this.props;
    showBuySessionExitAlert(dispatch, false);
  };

  _onPaymentMethodChange = paymentMethod => {
    if (paymentMethod && paymentMethod.isTemporaryCard && !paymentMethod.saveCreditCard) {
      this.props.dispatch(change(reduxFormName, 'enableSmartPurchase', false));
    }
  };

  _isSmartPurchaseFlow = () => {
    const {
      navigation: {
        state: { params },
      },
    } = this.props;
    return params && params.smartPurchaseFlow;
  };

  _getPaymentInfo = () => {
    const {
      id,
      isTemporaryCard,
      saveCreditCard,
      items: { cardNumber, expirationDate, cardFlag, cardToken, cardHolder },
    } = this.props.selectedPaymentMethod;

    return {
      productType: productTypes.BOM,
      paymentCardType: paymentCardTypes.CREDIT,
      paymentMethodId: !isTemporaryCard ? id : null,
      creditCardNumber: cardNumber || null,
      creditCardExpirationDate: expirationDate || null,
      creditCardBrand: cardFlag || null,
      cardToken: cardToken || null,
      saveCreditCard: saveCreditCard || null,
      creditCardHolder: cardHolder || null,
    };
  };

  _handlerConfirmPayment = () => {
    const { params } = this.props.navigation.state.params;
    const userData = JSON.parse(params);

    const paymentData = {
      userData,
      productType: 'REQUEST_CARD',
      rechargeValue: userData.value.replace(',', '.') * 100,
      params: this._getPaymentInfo(),
    };
    // this.props.dispatch(navigateToRoute(routeNames.REQUEST_CARD_PAYMENT_SUCCESSFUL, { paymentData }));
    this.props.dispatch(
      navigateToRoute(routeNames.PURCHASE_CONFIRMATION_DIALOG, {
        paymentData,
        smartPurchaseFlow: this._isSmartPurchaseFlow(),
      })
    );
    // dispatch(navigateToRoute(routeNames.REQUEST_CARD_PAYMENT));
  };

  render() {
    const { smartPurchaseFlow, paymentMethod, requestCard } = this.props;
    const hasPaymentForm = !!paymentMethod;
    const { address, value } = this.state.userData;
    const price = value;

    const supplement = address.supplement ? address.supplement : '';

    return (
      <View style={[styles.container]}>
        <Header
          title="Solicitar cartão"
          left={{
            type: headerActionTypes.BACK,
            onPress: this._back,
          }}
        />
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <View style={styles.containerPrice}>
              <VoudText style={styles.textDelivery}>Entrega em domicílio</VoudText>
              <VoudText style={styles.price}>{`R$ ${price}`}</VoudText>
            </View>
          </View>
          <View style={styles.containerAddress}>
            <VoudText style={styles.textAddress}>Endereço de entrega</VoudText>
          </View>
          <View style={{ flex: 1 }}>
            <VoudText style={styles.address}>
              {`${address.main} ${address.number} - ${supplement}`}
              {`\n${address.district}`},{`\n${address.city}, ${address.state}.`}
            </VoudText>
          </View>
          <View style={[styles.containerPaymentMethod]}>
            <Field
              name="paymentMethod"
              props={{
                reduxFormName,
                purchaseFlow: false,
                backRouteName: routeNames.BUY_CREDIT,
                requestCard: true,
              }}
              onChange={this._onPaymentMethodChange}
              component={PaymentMethodField}
              validate={[required]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <View style={[styles.continerPriceDelivery]}>
              <View style={styles.containerDescriptionPriceDelivery}>
                <VoudText style={styles.textPriceDelivery}>Valor da entrega</VoudText>
                <VoudText style={styles.textPrice}>{`R$ ${price}`}</VoudText>
              </View>
              <View style={styles.line} />
              <View style={styles.containerPriceTotal}>
                <VoudText style={styles.descriptionPriceTotal}>Valor total</VoudText>
                <VoudText style={styles.priceTotal}>{`R$ ${price}`}</VoudText>
              </View>
              <View style={styles.containerButton}>
                <Button
                  buttonStyle={{ height: 36 }}
                  onPress={this._handlerConfirmPayment}
                  disabled={!hasPaymentForm}
                >
                  PAGAR
                </Button>
              </View>
            </View>
          </View>

          {/* <ScrollView style={{flex:1,}}>
          <View style={styles.containerPrice}>
            <VoudText style={styles.textDelivery}>
              Entrega em domicílio
            </VoudText>
            <VoudText style={styles.price}>{`R$ ${price}`}</VoudText>
          </View>
          <View style={styles.containerAddress}>
            <VoudText style={styles.textAddress}>Endereço de entrega</VoudText>
          </View>
          <View>
            <VoudText style={styles.address}>
              {`${address.main} ${address.number} - ${address.supplement}`},
              {`\n`}{`${address.city}, ${address.state}.`}
            </VoudText>
          </View>
          <View style={[styles.containerPaymentMethod]}>
            <Field
              name="paymentMethod"
              props={{
                reduxFormName,
                purchaseFlow: !smartPurchaseFlow,
                backRouteName: routeNames.BUY_CREDIT
              }}
              onChange={this._onPaymentMethodChange}
              component={PaymentMethodField}
              validate={[required]}
            />
          </View>

          <View style={{flex:1, backgroundColor: "#A84D97",}}>
          <View style={[styles.continerPriceDelivery]}>
            <View style={styles.containerDescriptionPriceDelivery}>
              <VoudText style={styles.textPriceDelivery}>
                Valor da entrega
              </VoudText>
              <VoudText style={styles.textPrice}>{`R$ ${price}`}</VoudText>
            </View>
            <View style={styles.line} />
            <View style={styles.containerPriceTotal}>
              <VoudText style={styles.descriptionPriceTotal}>
                Valor total
              </VoudText>
              <VoudText style={styles.priceTotal}>{`R$ ${price}`}</VoudText>
            </View>
            <View style={styles.containerButton}>
              <Button
                buttonStyle={{ height: 36 }}
                onPress={this._handlerConfirmPayment}
                disabled={!hasPaymentForm}
              >
                PAGAR
              </Button>
            </View>
          </View>
          </View> */}
        </ScrollView>
      </View>
    );
  }
}

// Redux
const mapStateToProps = (state, ownProps) => {
  const { smartPurchaseFlow } = ownProps;
  return {
    initialValues: {
      paymentMethod: null,
      enableSmartPurchase: !!smartPurchaseFlow,
    },
    paymentMethod: formValueSelector(reduxFormName)(state, 'paymentMethod'),
    cardData: getPurchaseTransportCard(state),
    savedPaymentMethodsUi: getSavedPaymentMethodsUI(state),
    selectedPaymentMethod: getSelectedPaymentMethod(state),
  };
};

export const RequestCardPayment = connect(mapStateToProps)(
  reduxForm({ form: reduxFormName, destroyOnUnmount: false })(RequestCardPaymentView)
);
