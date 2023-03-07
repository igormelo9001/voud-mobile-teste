// NPM imports
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

// VouD imports
import LinearGradient from "react-native-linear-gradient";
import {
  getSelectedPaymentMethod,
  getHasSavedPayment
} from "../../../redux/selectors";
import Button from "../../../components/Button";
import { navigateToRoute } from "../../../redux/nav";
import { routeNames } from "../../../shared/route-names";
import BrandText from "../../../components/BrandText";
import { getLogoForBrand } from "../../../utils/payment-card";
import { colors } from "../../../styles";
import TouchableNative from "../../../components/TouchableNative";
import VoudText from "../../../components/VoudText";

// Component
const propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number])
};

const defaultProps = {
  style: {}
};

class PaymentMethodField extends Component {
  componentDidMount() {
    const { selectedPaymentMethod, input } = this.props;
    input.onChange(selectedPaymentMethod);
  }

  componentDidUpdate(prevProps) {
    const { selectedPaymentMethod, input } = this.props;
    const prevSelectedPaymentMethod = prevProps.selectedPaymentMethod;

    if (
      (prevSelectedPaymentMethod && !selectedPaymentMethod) ||
      (!prevSelectedPaymentMethod && selectedPaymentMethod) ||
      (selectedPaymentMethod &&
        (selectedPaymentMethod.id !== prevSelectedPaymentMethod.id ||
          selectedPaymentMethod.saveCreditCard !==
            prevSelectedPaymentMethod.saveCreditCard))
    ) {
      // Note: redux-form doesn't update field value if onChange parameter is undefined
      const updateSelectedPaymentMethod = !selectedPaymentMethod
        ? null
        : selectedPaymentMethod;
      input.onChange(updateSelectedPaymentMethod);
    }
  }

  _goToAddPaymentMethod = paymentScoo => {
    const { dispatch, requestCard, purchaseFlow, ticketUnitary } = this.props;
    if (requestCard || ticketUnitary) {
      dispatch(
        navigateToRoute(routeNames.SELECT_PAYMENT_METHOD, {
          purchaseFlow,
          paymentScoo,
          requestCard,
          ticketUnitary
        })
      );
    } else {
      dispatch(
        navigateToRoute(routeNames.PAYMENT_METHODS, {
          paymentScoo,
          requestCard
        })
      );
    }
  };

  _goToSelectPaymentMethod = paymentScoo => {
    const {
      backRouteName,
      purchaseFlow,
      dispatch,
      requestCard,
      ticketUnitary
    } = this.props;
    dispatch(
      navigateToRoute(routeNames.SELECT_PAYMENT_METHOD, {
        backRouteName,
        purchaseFlow: false,
        paymentScoo,
        requestCard,
        ticketUnitary
      })
    );
  };

  _renderButtonScoo = () => (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <View style={styles.containerTextScoo}>
        <BrandText style={styles.textTitleScoo}>
          Para iniciar uma corrida, você precisa adicionar
        </BrandText>
        <BrandText style={styles.textTitleScoo}>
          uma forma de pagamento.
        </BrandText>
      </View>
      <View style={styles.containerButtonScoo}>
        <TouchableOpacity
          onPress={() => this._goToAddPaymentMethod(true)}
          style={styles.buttonScoo}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 2, y: 0 }}
            colors={[colors.BRAND_PRIMARY_DARKER, colors.BRAND_PRIMARY_LIGHTER]}
            style={styles.buttonScoo}
          >
            <VoudText style={styles.textScoo}>
              {" "}
              Adicionar forma de pagamento
            </VoudText>
          </LinearGradient>
        </TouchableOpacity>
        <View style={{ alignItems: "center", marginTop: 8 }}>
          <BrandText
            style={[styles.textTitleScoo, { color: colors.GRAY_DARK }]}
          >
            Bandeiras aceitas: Visa e Master.
          </BrandText>
        </View>
      </View>
    </View>
  );

  render() {
    const {
      selectedPaymentMethod,
      disabled,
      scoo,
      isCardBrandSelected
    } = this.props;

    if (scoo) {
      return (
        <Fragment>
          {selectedPaymentMethod && isCardBrandSelected ? (
            <View>
              <TouchableNative
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 16,
                  marginRight: 20,
                  marginTop: 5
                }}
                onPress={() => this._goToSelectPaymentMethod(true)}
              >
                <Image
                  style={styles.cardBrandImg}
                  source={getLogoForBrand(selectedPaymentMethod.items.cardFlag)}
                />
                <View style={styles.cardInfo}>
                  <BrandText style={styles.cardNameText}>
                    {selectedPaymentMethod.name}
                  </BrandText>
                </View>
                <BrandText style={styles.changeText}>Alterar</BrandText>
              </TouchableNative>
            </View>
          ) : (
            this._renderButtonScoo()
          )}
        </Fragment>
      );
    }
    return (
      <Fragment>
        {selectedPaymentMethod ? (
          <TouchableNative
            style={styles.paymentMethodContainer}
            onPress={this._goToSelectPaymentMethod}
          >
            <Image
              style={styles.cardBrandImg}
              source={getLogoForBrand(selectedPaymentMethod.items.cardFlag)}
            />
            <View style={styles.cardInfo}>
              <BrandText style={styles.cardTypeText}>
                Cartão para crédito
              </BrandText>
              <BrandText style={styles.cardNameText}>
                {selectedPaymentMethod.name}
              </BrandText>
            </View>
            <BrandText style={styles.changeText}>TROCAR</BrandText>
          </TouchableNative>
        ) : (
          <Button
            style={styles.addPaymentMethodButton}
            onPress={this._goToAddPaymentMethod}
            disabled={disabled}
          >
            Forma de pagamento
          </Button>
        )}
      </Fragment>
    );
  }
}

PaymentMethodField.propTypes = propTypes;
PaymentMethodField.defaultProps = defaultProps;

// Styles
const styles = StyleSheet.create({
  addPaymentMethodButton: {
    marginVertical: 24,
    marginHorizontal: 16
  },
  paymentMethodContainer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.GRAY_LIGHTER,
    borderBottomWidth: 1
  },
  cardBrandImg: {
    height: 32,
    width: 32,
    marginRight: 16
  },
  cardInfo: {
    flex: 1
  },
  cardTypeText: {
    color: colors.GRAY,
    fontSize: 14,
    lineHeight: 16,
    marginBottom: 4
  },
  cardNameText: {
    color: colors.GRAY_DARKER,
    fontSize: 16,
    lineHeight: 20
  },
  changeText: {
    color: colors.BRAND_PRIMARY,
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 20
  },
  buttonScoo: {
    borderRadius: 27,
    height: 40,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    width: 292,
    height: 36
  },
  textScoo: {
    color: "#FFF",
    fontSize: 12
  },
  containerButtonScoo: {
    marginTop: 10,
    marginBottom: 25
  },
  containerTextScoo: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 35
  },
  textTitleScoo: {
    color: "#4d1e71",
    fontSize: 12
  }
});

// Redux
const mapStateToProps = state => {
  return {
    selectedPaymentMethod: getSelectedPaymentMethod(state),
    hasSavedPayment: getHasSavedPayment(state)
  };
};

export default connect(mapStateToProps)(PaymentMethodField);
