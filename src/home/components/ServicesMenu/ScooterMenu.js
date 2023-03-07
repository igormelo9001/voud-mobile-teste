import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, TouchableOpacity, AppState } from "react-native";
import VoudText from "../../../components/VoudText";
import { colors } from "../../../styles";
import IconButton from "../../../components/IconButton";
import Loader from "../../../components/Loader";
import { routeNames } from "../../../shared/route-names";
import PaymentMethodField from "../../../screens/BuyCredit/PurchaseForm/PaymentMethodField";
import { clearReduxForm } from "../../../utils/redux-form-util";
import { required } from "../../../utils/validators";
import { getSelectedPaymentMethod, getSavedPaymentMethodsUI } from "../../../redux/selectors";
import {
  fetchSavedPaymentMethods,
  selectFirstPaymentMethod,
  unselectPaymentMethod
} from "../../../redux/payment-method";
import LinearGradient from "react-native-linear-gradient";
import SystemText from "../../../components/SystemText";

import { connect } from "react-redux";

import { reduxForm, Field, change } from "redux-form";

// consts
const reduxFormName = "scooPurchaseForm";

class ScooterMenu extends PureComponent {
  componentWillMount() {
    const { dispatch } = this.props;
    clearReduxForm(dispatch, reduxFormName);
  }

  componentDidMount() {
    this._fetchRequests();
  }

  componentDidUpdate() {
    const { selectedPaymentMethod } = this.props;
    if (selectedPaymentMethod === undefined) {
      this._fetchRequests();
    }
  }

  _onPaymentMethodChange = paymentMethod => {
    if (
      paymentMethod &&
      paymentMethod.isTemporaryCard &&
      !paymentMethod.saveCreditCard
    ) {
      this.props.dispatch(change(reduxFormName, "enableSmartPurchase", false));
    }
  };

  _fetchRequests = () => {
    const { dispatch, selectedPaymentMethod } = this.props;
    dispatch(fetchSavedPaymentMethods()).then(() => {
     if(!selectedPaymentMethod) dispatch(selectFirstPaymentMethod());
    });
  };

  _renderPaymentPending = () => {
    const { pendingTransactionRide :  { rideValue }  } = this.props;
    return (
      <View>
      <View style={styles.buttonsContainer}>
      <View style={{ padding: 5, marginBottom:8, alignItems:"center"}}>
      <SystemText style={{ color: colors.GRAY_DARK, fontSize: 12 }}>
          Você possui uma cobrança pendente
        </SystemText>
        <SystemText style={{ color: colors.GRAY_DARK, fontSize: 12, alignItems:"center" }}>
          no valor de {`R$ ${rideValue.toFixed(2).replace(".",",")}.`}
        </SystemText>
        </View>
        <TouchableOpacity
          onPress={this.props.onScooterPaymentPending}
          style={styles.buttonScoo}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 2, y: 0 }}
            colors={[
              colors.BRAND_PRIMARY_DARKER,
              colors.BRAND_PRIMARY_LIGHTER
            ]}
            style={styles.buttonScoo}
          >
            <VoudText style={styles.textScoo}> Prosseguir pagamento</VoudText>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View
        style={{ alignItems: "center", marginTop: 8, marginBottom: 8 }}
      >
      </View>
    </View>
    )
  }

  _renderRidePending = () => {
    return (
      <View>
      <View style={styles.buttonsContainer}>
      <View style={{ padding: 5, marginBottom:8, alignItems:"center"}}>
      <SystemText style={{ color: colors.GRAY_DARK, fontSize: 12 }}>
          Você possui uma uma corrida pendente.
        </SystemText>
        </View>
        <TouchableOpacity
          onPress={this.props.onScooterBegin}
          style={styles.buttonScoo}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 2, y: 0 }}
            colors={[
              colors.BRAND_PRIMARY_DARKER,
              colors.BRAND_PRIMARY_LIGHTER
            ]}
            style={styles.buttonScoo}
          >
            <VoudText style={styles.textScoo}>Continuar</VoudText>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View
        style={{ alignItems: "center", marginTop: 8, marginBottom: 8 }}
      >
      </View>
    </View>
    )
  }

  _renderRideBegin = () => {
    return (
      <View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={this.props.onScooterBegin}
              style={styles.buttonScoo}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 2, y: 0 }}
                colors={[
                  colors.BRAND_PRIMARY_DARKER,
                  colors.BRAND_PRIMARY_LIGHTER
                ]}
                style={styles.buttonScoo}
              >
                <VoudText style={styles.textScoo}> Começar</VoudText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View
            style={{ alignItems: "center", marginTop: 8, marginBottom: 8 }}
          >
            <SystemText style={{ color: colors.GRAY_DARK, fontSize: 12 }}>
              R$ 4,30 por 15 min + R$ 0,45/min
            </SystemText>
          </View>
        </View>
    )
  }

  render() {
    const {
      dataProfile: { isFetching },
      smartPurchaseFlow,
      selectedPaymentMethod,
      pendingTransactionRide :  { pending },
      scooter,
    } = this.props;
    let isCardBrandSelected = false;

    if(selectedPaymentMethod){
      const cardFlag = selectedPaymentMethod.items.cardFlag;
      if(cardFlag === "master" || cardFlag === "visa"){
        isCardBrandSelected = true;
      }
    }

    const rideBegin = selectedPaymentMethod && isCardBrandSelected && !pending && !scooter.pendingRide;
    const paymentRidePending = selectedPaymentMethod && isCardBrandSelected && pending && !scooter.pendingRide;
    const ridePending = selectedPaymentMethod && isCardBrandSelected && !pending && scooter.pendingRide;
    return (
      <View style={[styles.container, { backgroundColor: "transparent" }]}>
          <View style={{ backgroundColor: "transparent" }}>
            <Field
              name="paymentMethod"
              props={{
                reduxFormName,
                purchaseFlow: false,
                backRouteName: routeNames.BUY_CREDIT,
                scoo: true,
                isCardBrandSelected: isCardBrandSelected,
              }}
              onChange={this._onPaymentMethodChange}
              component={PaymentMethodField}
              validate={[required]}
            />
          </View>

        {rideBegin &&
          this._renderRideBegin()
        }
        {paymentRidePending &&
        this._renderPaymentPending()
        }
        {ridePending &&
           this._renderRidePending()
        }

        {scooter.isFetching  && (
          <View style={{ flex: 1, margin: 10, padding: 10 }}>
            <Loader text={"Aguarde"} iconSize={32} />
          </View>
        )}
      </View>
    );
  }
}

ScooterMenu.propTypes = {
  onScooterHelp: PropTypes.func,
  onScooterReport: PropTypes.func,
  onScooterBegin: PropTypes.func
};

ScooterMenu.defaultProps = {
  onScooterHelp: () => {},
  onScooterReport: () => {},
  onScooterBegin: () => {}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 0
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  text: {
    color: colors.GRAY_DARK
  },
  fontBold: {
    fontWeight: "bold"
  },
  buttonsContainer: {
    flex: 1,
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 17,
    marginTop: 0,
    // padding:8,
    // marginBottom: 25,
    marginTop: 10
  },
  roundButton: {
    borderColor: colors.BRAND_PRIMARY,
    borderWidth: 1,
    width: 36,
    height: 36,
    borderRadius: 36
  },
  roundButtonIcon: {
    color: colors.BRAND_PRIMARY,
    fontSize: 21
  },
  button: {
    flex: 1,
    flexDirection: "row",
    height: 36,
    backgroundColor: colors.BRAND_PRIMARY,
    marginHorizontal: 13
  },
  buttonIcon: {
    color: "#fff",
    fontSize: 14
  },
  buttonText: {
    color: "#fff",
    fontWeight: "400"
  },
  buttonScoo: {
    borderRadius: 27,
    height: 40,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    width: 292,
    height: 36,
  },
  textScoo: {
    color: "#FFF",
    fontSize: 12
  }
});

const mapStateToProps = state => {
  return {
    initialValues: {
      paymentMethod: null
    },
    dataProfile: state.scooter,
    selectedPaymentMethod: getSelectedPaymentMethod(state),
    pendingTransactionRide: state.scooter.pendingTransactionRide,
    scooter: state.scooter,
  };
};

export default connect(mapStateToProps)(
  reduxForm({ form: reduxFormName, destroyOnUnmount: false })(ScooterMenu)
);
