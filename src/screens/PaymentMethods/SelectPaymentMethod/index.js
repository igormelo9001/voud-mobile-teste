// NPM imports
import React, { Component, Fragment } from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";

// VouD imports
import Header, { headerActionTypes } from "../../../components/Header";
import RequestFeedback from "../../../components/RequestFeedback";
import PaymentMethodList from "../PaymentMethodList";
import DiscountItemList from "../../../components/DiscountItemList";

import { showToast, toastStyles } from "../../../redux/toast";

import {
  getSavedPaymentMethodsUI,
  getSavedPaymentList,
  getActiveDiscountsUi,
  getActiveDiscounts
} from "../../../redux/selectors";
import { routeNames } from "../../../shared/route-names";

import {
  fetchSavedPaymentMethods,
  requestSavedPaymentMethodsClear,
  fetchRemovePaymentMethod,
  removePaymentMethodClear,
  fetchActiveDiscounts,
  selectPaymentMethod,
  selectFirstPaymentMethod
} from "../../../redux/payment-method";
import { fetchSmartPurchases } from "../../../redux/smart-purchase";
import { showRemovePaymentMethodAlert } from "../../../utils/payment-method";
import { navigateToRoute } from "../../../redux/nav";

// Screen component
class SelectPaymentMethodView extends Component {
  componentDidMount() {
    this._fetchPaymentMethods();
    this._fetchActiveDiscounts();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(requestSavedPaymentMethodsClear());
    dispatch(removePaymentMethodClear());
  }

  _fetchPaymentMethods = () => {
    const { dispatch } = this.props;
    dispatch(fetchSavedPaymentMethods());
    dispatch(fetchSmartPurchases());
  };

  _fetchActiveDiscounts = () => {
    const { dispatch } = this.props;
    dispatch(fetchActiveDiscounts());
  };

  _goToAddPaymentMethod = () => {
    const {
      dispatch,
      navigation: {
        state: { params }
      }
    } = this.props;
    const purchaseFlow =
      params && params.purchaseFlow ? params.purchaseFlow : null;
    const backRouteName =
      params && params.backRouteName ? params.backRouteName : null;
    const requestCard = params && params.requestCard;
    const paymentScoo = params && params.paymentScoo;
    const ticketUnitary = params && params.ticketUnitary;

    dispatch(
      navigateToRoute(routeNames.ADD_PAYMENT_METHOD, {
        purchaseFlow,
        backRouteName,
        paymentScoo,
        requestCard,
        ticketUnitary
      })
    );
  };

  _removePaymentMethod = id => {
    const { dispatch } = this.props;
    dispatch(fetchRemovePaymentMethod(id))
      .then(() => {
        dispatch(selectFirstPaymentMethod());
        dispatch(showToast("Forma de pagamento removida com sucesso!"));
      })
      .catch(error => {
        dispatch(showToast(error.message, toastStyles.ERROR));
      });
  };

  _showRemoveAlert = paymentMethod => {
    showRemovePaymentMethodAlert(paymentMethod, () =>
      this._removePaymentMethod(paymentMethod.id)
    );
  };

  _onPaymentMethodPress = paymentMethod => {
    this.props.dispatch(selectPaymentMethod(paymentMethod.id));
    this._back();
  };

  _back = () => {
    this.props.dispatch(NavigationActions.back());
  };

  _renderMainContent = () => {
    const {
      list,
      ui: { error, isFetching },
      removingMethodId,
      activeDiscounts,
      activeDiscountsUi
    } = this.props;

    return list && list[0] ? (
      <Fragment>
        <PaymentMethodList
          itemList={list}
          onRemove={this._showRemoveAlert}
          removingMethodId={removingMethodId}
          onPress={this._onPaymentMethodPress}
        />
        <View style={styles.discountContainer}>
          <DiscountItemList
            activeDiscounts={activeDiscounts}
            isFetching={activeDiscountsUi.isFetching}
            error={activeDiscountsUi.error}
            onRetry={this._fetchActiveDiscounts}
          />
        </View>
      </Fragment>
    ) : (
      <Fragment>
        <View style={styles.requestFeedbackContainer}>
          <RequestFeedback
            loadingMessage="Carregando formas de pagamento..."
            errorMessage={error}
            emptyMessage="Não foram encontradas formas de pagamento salvas"
            retryMessage="Tentar novamente"
            isFetching={isFetching}
            onRetry={this._fetchPaymentMethods}
          />
        </View>
        <View style={styles.discountContainer}>
          <DiscountItemList
            activeDiscounts={activeDiscounts}
            isFetching={activeDiscountsUi.isFetching}
            error={activeDiscountsUi.error}
            onRetry={this._fetchActiveDiscounts}
          />
        </View>
      </Fragment>
    );
  };

  _renderContainerStyleSheet = () => {
    // If payment method list has 1+ credit cards,
    // remove flex: 1 from container to prevent active
    // discount from staying at the bottom of the screen.
    // If payment method list has 0 itens, add flex: 1
    // to move active discount to bottom + empty state
    const { list } = this.props;
    return list.length === 0 ? { flex: 1 } : {};
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={this._renderContainerStyleSheet()}>
          <Header
            title="Formas de pagamento"
            left={{
              type: headerActionTypes.BACK,
              onPress: this._back
            }}
            right={{
              type: headerActionTypes.CUSTOM,
              icon: "add",
              onPress: this._goToAddPaymentMethod
            }}
          />
          {this._renderMainContent()}
        </View>
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  requestFeedbackContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24
  },
  discountContainer: {
    padding: 16
  }
});

function mapStateToProps(state) {
  return {
    ui: getSavedPaymentMethodsUI(state),
    list: getSavedPaymentList(state),
    removingMethodId: state.paymentMethod.remove.id,
    activeDiscounts: getActiveDiscounts(state),
    activeDiscountsUi: getActiveDiscountsUi(state)
  };
}

export const SelectPaymentMethod = connect(mapStateToProps)(
  SelectPaymentMethodView
);
