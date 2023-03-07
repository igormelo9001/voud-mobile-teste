// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { View, ScrollView, StyleSheet } from 'react-native';

// VouD imports
import Header, { headerActionTypes } from '../../../components/Header';
import LoadMask from '../../../components/LoadMask';
import KeyboardDismissView from '../../../components/KeyboardDismissView';

import { openMenu } from '../../../redux/menu';
import {
  fetchSavePaymentMethod,
  savePaymentMethodClear,
  selectTemporaryCard,
} from '../../../redux/payment-method';
import { showToast } from '../../../redux/toast';
import { getSavePaymentMethodUI } from '../../../redux/selectors';

import { formatPaymentMethodName } from '../../../utils/payment-card';

// Component imports
import { AddPaymentMethodForm } from './AddPaymentMethodForm';
import SupportedPaymentCardBrands from '../../../components/SupportedPaymentCardBrands';
import { backToRoute, navigateToRoute } from '../../../redux/nav';

import { routeNames } from '../../../shared/route-names';

// Screen component
class AddPaymentMethodView extends Component {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(savePaymentMethodClear());
  }

  openMenu = () => {
    this.props.dispatch(openMenu());
  };

  _submit = ({
    creditCardNumber,
    creditCardHolder,
    creditCardBrand,
    creditCardExpirationDate,
    creditCardSecurityCode,
    saveCreditCard,
  }) => {
    const {
      dispatch,
      navigation: {
        state: { params },
      },
    } = this.props;
    const purchaseFlow = params && params.purchaseFlow ? params.purchaseFlow : null;

    const paymentInfo = {
      name: formatPaymentMethodName(creditCardBrand, creditCardNumber),
      creditCardNumber,
      creditCardBrand,
      creditCardExpirationDate,
      creditCardSecurityCode,
      creditCardHolder,
      saveCreditCard,
    };

    if (purchaseFlow) {
      dispatch(selectTemporaryCard(paymentInfo));
      this._backToRoute();
    } else {
      dispatch(fetchSavePaymentMethod(paymentInfo)).then(() => {
        dispatch(showToast('Forma de pagamento adicionada com sucesso!'));
        this._backToRoute();
      });
    }
  };

  _backToRoute = () => {
    const {
      dispatch,
      navigation: {
        state: { params },
      },
    } = this.props;
    const backRouteName = params && params.backRouteName ? params.backRouteName : null;
    const requestCard = params && params.requestCard;
    const ticketUnitary = params && params.ticketUnitary;

    if (backRouteName && !requestCard && !ticketUnitary) {
      dispatch(backToRoute(backRouteName));
    } else {
      this._close();
    }
  };

  _close = () => {
    this.props.dispatch(NavigationActions.back());
  };

  render() {
    const {
      ui,
      navigation: {
        state: { params },
      },
    } = this.props;
    const purchaseFlow = params && params.purchaseFlow ? params.purchaseFlow : null;
    const editPaymentMethod = params && params.editPaymentMethod ? params.editPaymentMethod : null;
    const paymentScoo = params && params.paymentScoo;

    return (
      <View style={styles.container}>
        <Header
          title="Forma de pagamento"
          left={{
            type: headerActionTypes.CLOSE,
            onPress: this._close,
          }}
        />
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always">
          <KeyboardDismissView>
            <SupportedPaymentCardBrands paymentScoo={paymentScoo} />
            <AddPaymentMethodForm
              ui={ui}
              onSubmit={this._submit}
              purchaseFlow={purchaseFlow}
              editPaymentMethod={editPaymentMethod}
              paymentScoo={paymentScoo}
            />
          </KeyboardDismissView>
        </ScrollView>
        {ui.isFetching && <LoadMask message="Adicionando forma de pagamento" />}
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  submitButton: {
    marginTop: 24,
  },
});

// Redux
const mapStateToProps = state => ({
  ui: getSavePaymentMethodUI(state),
});

export const AddPaymentMethod = connect(mapStateToProps)(AddPaymentMethodView);
