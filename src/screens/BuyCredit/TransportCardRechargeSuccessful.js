// NPM imports
import React, { Component, Fragment } from "react";
import { ScrollView, StyleSheet, Image, View, BackHandler } from "react-native";
import { connect } from "react-redux";

// VouD imports
import BrandText from "../../components/BrandText";
import SystemText from "../../components/SystemText";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import { backToHome, navigateFromHome, backToRoute } from "../../redux/nav";
import { fetchCardList } from "../../redux/transport-card";
import { colors } from "../../styles";
import { routeNames } from "../../shared/route-names";
import { productTypes, getProductTypeLabel } from "../../redux/financial";
import { buCreditTypeLabels } from "../../utils/transport-card";
import { formatCurrencyFromCents } from "../../utils/parsers-formaters";
import { getPaddingForNotch } from "../../utils/is-iphone-with-notch";
import { getLegalTextVisible } from "../../shared/remote-config";

const validator = require("../../images/validator-green.png");
const smartPurchaseCalendar = require("../../images/smart-purchase-calendar.png");

// Screen component
class TransportCardRechargeSuccessfulView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      legalText: {}
    };
  }
  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this._backHandler);
  }

  async componentDidMount() {
    const dataText = JSON.parse(await getLegalTextVisible());
    this.setState({ legalText: dataText });

    RatingTracker.handlePositiveEvent();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._backHandler);
  }

  _backHandler = () => {
    this._finish();
    return true;
  };

  _finish = () => {
    const {
      dispatch,
      navigation: {
        state: {
          params: { smartPurchaseFlow }
        }
      }
    } = this.props;
    dispatch(fetchCardList());

    if (smartPurchaseFlow) {
      dispatch(backToRoute(routeNames.SMART_PURCHASE));
    } else {
      dispatch(backToHome());
    }
  };

  _goToServicePoints = () => {
    const { dispatch } = this.props;
    dispatch(
      navigateFromHome(routeNames.SEARCH_POINTS_OF_INTEREST, {
        isTransportCardRecharge: true
      })
    );
  };

  _getCreditValidationText = () => {
    const {
      navigation: {
        state: {
          params: { paymentData }
        }
      }
    } = this.props;
    const isBU = paymentData && paymentData.productType === productTypes.BU;

    return isBU
      ? "validar seus créditos nos pontos de recarga dos terminais e estações (Ônibus, Metrô e CPTM)."
      : "validar seus créditos nos pontos de recarga dos terminais e estações (Metra, Metrô e CPTM), ou em até 3 dias nos validadores dos ônibus intermunicipais.";
  };

  _getPurchaseValueText = () => {
    const {
      navigation: {
        state: {
          params: { paymentData }
        }
      }
    } = this.props;
    const purchaseValue =
      paymentData && paymentData.purchaseValue ? paymentData.purchaseValue : 0;
    return `R$ ${formatCurrencyFromCents(purchaseValue)}`;
  };

  _hasScheduledDay = () => {
    const {
      navigation: {
        state: {
          params: { paymentData }
        }
      }
    } = this.props;
    return !!(paymentData && paymentData.scheduledDay);
  };

  _renderPurchaseImage = () => {
    if (this._hasScheduledDay())
      return (
        <Image
          style={styles.smartPurchaseCalendarImage}
          source={smartPurchaseCalendar}
        />
      );

    return <Image style={styles.validatorImage} source={validator} />;
  };

  _getPurchaseOrderText = () => {
    const {
      navigation: {
        state: {
          params: { paymentData }
        }
      }
    } = this.props;
    const isBU = paymentData && paymentData.productType === productTypes.BU;
    const buAdditionalData =
      paymentData && paymentData.buAdditionalData
        ? paymentData.buAdditionalData
        : null;

    if (
      isBU &&
      buAdditionalData &&
      buAdditionalData.buCreditType === buCreditTypeLabels.TEMPORAL
    ) {
      const { periodType, transportType, productQuantity } = buAdditionalData;
      return `${productQuantity} ${
        productQuantity === 1 ? "cota" : "cotas"
      } (${periodType.toLowerCase()} ${transportType.toLowerCase()})`;
    }

    const rechargeValue =
      paymentData && paymentData.rechargeValue ? paymentData.rechargeValue : 0;
    return `R$ ${formatCurrencyFromCents(rechargeValue)}`;
  };

  _getCardNameText = () => {
    const {
      navigation: {
        state: {
          params: { paymentData }
        }
      }
    } = this.props;
    const transportCardNick =
      paymentData && paymentData.transportCardNick
        ? paymentData.transportCardNick
        : "";
    const productType = paymentData && paymentData.productType;
    return `cartão ${getProductTypeLabel(productType)} ${transportCardNick}`;
  };

  renderText = () => {
    const {
      navigation: {
        state: {
          params: { paymentData }
        }
      }
    } = this.props;

    if (paymentData.productType === "LEGAL") {
      const { legalText } = this.state;
      return (
        <View>
          <BrandText style={{ color: colors.BRAND_PRIMARY, fontSize: 20 }}>
            {legalText.Title}
          </BrandText>
          <BrandText
            style={{ color: colors.GRAY_DARK, paddingTop: 40, fontSize: 14 }}
          >
            {legalText.Texto1}
          </BrandText>
          <BrandText style={{ color: colors.GRAY_DARK, fontSize: 14 }}>
            {legalText.Texto2}
          </BrandText>
          <BrandText style={{ color: colors.GRAY_DARK, fontSize: 14 }}>
            {legalText.Texto3}
          </BrandText>
        </View>
      );
    } else {
      return (
        <View>
          <BrandText style={{ color: colors.BRAND_PRIMARY, fontSize: 20 }}>
            Créditos liberados!
          </BrandText>
          <BrandText
            style={{ color: colors.GRAY_DARK, paddingTop: 40, fontSize: 14 }}
          >
            Para validar seus créditos aproxime o seu
          </BrandText>
          <BrandText style={{ color: colors.GRAY_DARK, fontSize: 14 }}>
            cartão em um terminal de validação
          </BrandText>
          <BrandText style={{ color: colors.GRAY_DARK, fontSize: 14 }}>
            disponível em pontos de ônibus, estações
          </BrandText>
          <BrandText style={{ color: colors.GRAY_DARK, fontSize: 14 }}>
            de trem.metrô ou estabelecimentos
          </BrandText>
          <BrandText style={{ color: colors.GRAY_DARK, fontSize: 14 }}>
            habilitados.
          </BrandText>
        </View>
      );
    }
  };

  _renderPurchaseValidationText = () => {
    const {
      navigation: {
        state: {
          params: { smartPurchaseFlow }
        }
      }
    } = this.props;

    if (this._hasScheduledDay()) {
      const {
        navigation: {
          state: {
            params: { paymentData }
          }
        }
      } = this.props;
      const scheduledDay =
        paymentData && paymentData.scheduledDay ? paymentData.scheduledDay : 0;

      return (
        <SystemText style={styles.purchaseValidationText}>
          {smartPurchaseFlow ? (
            <Fragment>
              <SystemText>Mensalmente todo o dia</SystemText>
              <SystemText
                style={styles.fontBold}
              >{` ${scheduledDay} `}</SystemText>
            </Fragment>
          ) : (
            <Fragment>
              <SystemText>
                Pedido realizado com sucesso. E a partir do próximo dia
              </SystemText>
              <SystemText
                style={styles.fontBold}
              >{` ${scheduledDay}`}</SystemText>
              <SystemText>, mensalmente, nós </SystemText>
            </Fragment>
          )}
          <SystemText>efetuaremos um pedido de compra de </SystemText>
          <SystemText
            style={styles.fontBold}
          >{`${this._getPurchaseOrderText()} `}</SystemText>
          <SystemText>para o </SystemText>
          <SystemText style={styles.fontBold}>
            {this._getCardNameText()}
          </SystemText>
          <SystemText>{`. Não se esqueça de validar os seus créditos ${
            smartPurchaseFlow || paymentData.productType === "LEGAL"
              ? ""
              : "nos pontos de recarga"
          }`}</SystemText>
          {smartPurchaseFlow && (
            <SystemText
              style={styles.servicePointsText}
              onPress={this._goToServicePoints}
            >
              pontos de recarga
            </SystemText>
          )}
          <SystemText> após a confirmação do pagamento.</SystemText>
        </SystemText>
      );
    }
    return (
      <View
        style={{
          padding: 16,
          paddingTop: 40,
          flex: 1,
          alignItems: "center",
          justifyContent: "space-around"
        }}
      >
        {this.renderText()}
      </View>

      // <SystemText style={styles.purchaseValidationText}>
      //   <SystemText>{`Pagamento aprovado.`}</SystemText>
      //   <SystemText> {`Agora, você precisa validar seus `}</SystemText>
      //   <SystemText> {`créditos em um dos pontos de recarga `}</SystemText>
      //   <SystemText> {`dos terminais de ônibus ou nas estações de trem e metrô.`}</SystemText>
      // </SystemText>
    );
  };

  _getSuccessTitle = () => {
    const {
      navigation: {
        state: {
          params: { smartPurchaseFlow }
        }
      }
    } = this.props;

    if (smartPurchaseFlow) {
      return "A sua compra programada foi agendada com sucesso!";
    }

    if (this._hasScheduledDay()) {
      return "Pedido e programação de compra realizados com sucesso!";
    }

    return "Pedido realizado\ncom sucesso!";
  };

  render() {
    const {
      navigation: {
        state: {
          params: { smartPurchaseFlow, paymentData }
        }
      }
    } = this.props;

    return (
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Icon style={styles.closeIcon} name="close" onPress={this._finish} />
          <Icon style={styles.successIcon} name="checkmark-circle-outline" />
          <SystemText style={styles.purchaseValue}>
            {this._getPurchaseValueText()}
          </SystemText>
          <BrandText
            style={
              this._hasScheduledDay()
                ? styles.successTitleSmartPurchase
                : styles.successTitle
            }
          >
            {this._getSuccessTitle()}
          </BrandText>
        </View>
        <View style={styles.purchaseImageContainer}>
          {this._renderPurchaseImage()}
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContainer}
        >
          {this._renderPurchaseValidationText()}
        </ScrollView>
        <View style={styles.actionBtnContainer}>
          {smartPurchaseFlow || paymentData.productType === "LEGAL" ? (
            <Button onPress={this._finish}>OK</Button>
          ) : (
            <Button onPress={this._goToServicePoints}>
              Ver pontos de recarga
            </Button>
          )}
        </View>
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white"
  },
  headerContainer: {
    paddingTop: getPaddingForNotch() + 48,
    backgroundColor: colors.BRAND_SUCCESS,
    alignItems: "center",
    paddingHorizontal: 16
  },
  scrollView: {
    flex: 1
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 16
  },
  closeIcon: {
    color: "white",
    width: 24,
    fontSize: 24,
    position: "absolute",
    top: 40,
    left: 16
  },
  successIcon: {
    color: "white",
    width: 72,
    fontSize: 72,
    marginBottom: 16
  },
  purchaseValue: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 32,
    lineHeight: 32,
    marginBottom: 8
  },
  purchaseValueNormal: {
    fontWeight: "normal"
  },
  successTitle: {
    color: "white",
    fontSize: 20,
    lineHeight: 28,
    textAlign: "center",
    marginBottom: 87
  },
  successTitleSmartPurchase: {
    color: "white",
    fontSize: 20,
    lineHeight: 28,
    textAlign: "center",
    marginBottom: 80
  },
  purchaseValidationText: {
    color: colors.GRAY,
    fontSize: 14,
    lineHeight: 24
  },
  fontBold: {
    fontWeight: "bold"
  },
  purchaseImageContainer: {
    alignItems: "center"
  },
  validatorImage: {
    marginTop: -63,
    width: 114,
    height: 126
  },
  smartPurchaseCalendarImage: {
    marginTop: -56,
    width: 112,
    height: 112
  },
  actionBtnContainer: {
    padding: 16
  },
  servicePointsText: {
    fontWeight: "bold",
    color: colors.BRAND_PRIMARY
  }
});

export const TransportCardRechargeSuccessful = connect()(
  TransportCardRechargeSuccessfulView
);
