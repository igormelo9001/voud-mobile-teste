// NPM imports
import React, { Component, Fragment } from "react";
import { View, StyleSheet } from "react-native";
import { NavigationActions, withNavigationFocus } from "react-navigation";
import { connect } from "react-redux";

// VouD imports
import Header, { headerActionTypes } from "../../components/Header";
import RequestFeedback from "../../components/RequestFeedback";
import PaymentMethodList from "./PaymentMethodList";
import { showToast, toastStyles } from "../../redux/toast";

import {
  getSavedPaymentMethodsUI,
  getSavedPaymentList
} from "../../redux/selectors";
import { routeNames } from "../../shared/route-names";

import {
  fetchSavedPaymentMethods,
  requestSavedPaymentMethodsClear,
  fetchRemovePaymentMethod,
  removePaymentMethodClear
} from "../../redux/payment-method";
import { fetchSmartPurchases } from "../../redux/smart-purchase";
import { showRemovePaymentMethodAlert } from "../../utils/payment-method";
import { navigateToRoute } from "../../redux/nav";

//verification card imports
import VerificationCardDialog from "../../flows/VerificationCard/components/VerificationCardDialog";
import { GATrackEvent, GAEventParams } from "../../shared/analytics";
import { selectPaymentMethodToVerify } from "../../flows/VerificationCard/store/ducks/verificationCard";

// Screen component
class PaymentMethodsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.setState({ isModalVisible: false }, this._fetchPaymentMethods);
    }
  }

  componentDidMount() {
    this._fetchPaymentMethods();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(requestSavedPaymentMethodsClear());
    dispatch(removePaymentMethodClear());
  }

  _close = () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.back());
  };

  _fetchPaymentMethods = () => {
    const { dispatch } = this.props;
    dispatch(fetchSavedPaymentMethods());
    dispatch(fetchSmartPurchases());
  };

  _goToAddPaymentMethod = () => {
    const {
      dispatch,
      navigation: {
        state: { params }
      }
    } = this.props;
    const paymentScoo = params && params.paymentScoo;
    const requestCard = params && params.requestCard;

    dispatch(
      navigateToRoute(routeNames.ADD_PAYMENT_METHOD, {
        paymentScoo,
        requestCard
      })
    );
  };

  _removePaymentMethod = id => {
    const { dispatch } = this.props;
    dispatch(fetchRemovePaymentMethod(id))
      .then(() => {
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

  _openVerificationCardScreen = () => {
    const { dispatch } = this.props;

    const {
      categories: { BUTTON },
      actions: { CLICK },
      labels: { OPEN_VERIFICATION_CARD }
    } = GAEventParams;
    GATrackEvent(BUTTON, CLICK, OPEN_VERIFICATION_CARD);
    dispatch(navigateToRoute(routeNames.VERIFICATION_CARD, {}));
  };

  _openVerificationCardConfirmationScreen = paymentMethod => {
    const { dispatch } = this.props;
    const {
      categories: { BUTTON },
      actions: { CLICK },
      labels: { OPEN_VERIFICATION_CARD_CONFIRMATION }
    } = GAEventParams;
    GATrackEvent(BUTTON, CLICK, OPEN_VERIFICATION_CARD_CONFIRMATION);
    dispatch(selectPaymentMethodToVerify(paymentMethod));
    dispatch(navigateToRoute(routeNames.VERIFICATION_CARD_CONFIRMATION, {}));
  };

  _openVerificationCardDialog = paymentMethod => {
    const { dispatch } = this.props;
    const { isModalVisible } = this.state;
    paymentMethod && dispatch(selectPaymentMethodToVerify(paymentMethod));
    this.setState({ isModalVisible: !isModalVisible });
  };

  _renderMainContent = () => {
    const {
      list,
      ui: { error, isFetching },
      removingMethodId
    } = this.props;

    return list && list[0] ? (
      <Fragment>
        <PaymentMethodList
          itemList={list}
          onRemove={this._showRemoveAlert}
          onPressVerification={this._openVerificationCardDialog}
          onPressVerificationConfirmation={
            this._openVerificationCardConfirmationScreen
          }
          removingMethodId={removingMethodId}
        />
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
      </Fragment>
    );
  };

  _renderMainContainerStyleSheet = () => {
    // If payment method list has 1+ credit cards,
    // remove flex: 1 from container to prevent active
    // discount from staying at the bottom of the screen.
    // If payment method list has 0 itens, add flex: 1
    // to move active discount to bottom + empty state
    const { list } = this.props;
    return list.length === 0 ? { flex: 1 } : {};
  };

  render() {
    const { isFetching } = this.props;
    return (
      <View style={styles.container}>
        <Header
          title="Formas de pagamento"
          left={{
            type: headerActionTypes.CLOSE,
            onPress: this._close
          }}
          right={{
            type: headerActionTypes.CUSTOM,
            icon: "add",
            onPress: this._goToAddPaymentMethod
          }}
        />
        {isFetching && <Loader text={loadingMessage || "Carregando..."} />}

        <View style={this._renderMainContainerStyleSheet()}>
          {this._renderMainContent()}
        </View>
        <VerificationCardDialog
          isVisible={this.state.isModalVisible}
          onPressVerificationCard={this._openVerificationCardScreen}
          dismissDialog={this._openVerificationCardDialog}
        />
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
    padding: 24,
    backgroundColor: "white"
  },
  discountContainer: {
    padding: 16
  }
});

function mapStateToProps(state) {
  return {
    ui: getSavedPaymentMethodsUI(state),
    list: getSavedPaymentList(state),
    removingMethodId: state.paymentMethod.remove.id
  };
}

export const PaymentMethods = withNavigationFocus(
  connect(mapStateToProps)(PaymentMethodsView)
);

export * from "./AddPaymentMethod";
export * from "./SelectPaymentMethod";
