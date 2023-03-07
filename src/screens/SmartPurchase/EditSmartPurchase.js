// NPM imports
import React, { Component } from "react";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import { View, ScrollView, StyleSheet, Alert } from "react-native";

// VouD imports
import Header, { headerActionTypes } from "../../components/Header";
import SystemText from "../../components/SystemText";
import BrandText from "../../components/BrandText";
import TransportCardSm from "../../components/TransportCardSm";
import LoadMask from "../../components/LoadMask";
import KeyboardDismissView from "../../components/KeyboardDismissView";
import Switch from "../../components/Switch";
import Icon from "../../components/Icon";

import {
  getSaveSmartPurchaseUI,
  getCurrentSmartPurchaseDetail,
  getPurchaseTransportCard,
  getSavedPaymentList
} from "../../redux/selectors";
import {
  fetchSaveSmartPurchase,
  fetchRemoveSmartPurchase,
  saveClear,
  removeClear
} from "../../redux/smart-purchase";
import { showToast, toastStyles } from "../../redux/toast";
import { formatCurrency } from "../../utils/parsers-formaters";
import { colors } from "../../styles";
import TouchableNative from "../../components/TouchableNative";
import { transportCardTypes } from "../../redux/transport-card";
import { navigateToRoute } from "../../redux/nav";
import { routeNames } from "../../shared/route-names";
import Button from "../../components/Button";
import { checkIfSmartPurchaseHasPaymentMethod } from "../../utils/smart-purchase-util";

// Screen component
class EditSmartPurchaseView extends Component {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(saveClear());
    dispatch(removeClear());
  }

  _close = () => {
    this.props.dispatch(NavigationActions.back());
  };

  _getStatusTextStyle = style =>
    StyleSheet.flatten([
      style,
      this.props.currentSmartPurchaseDetail.isActive ? {} : styles.textDisabled
    ]);

  _renderStatusContainer = () => {
    const {
      currentSmartPurchaseDetail: { rechargeValue, scheduledDay, isActive }
    } = this.props;

    return (
      <View>
        <View style={styles.statusInfoContainer}>
          <View style={styles.rechargeValueInfoContainer}>
            <View style={styles.rechargeValueInfo}>
              <Icon
                name="automatic-purchase"
                size={24}
                color={isActive ? colors.BRAND_PRIMARY : colors.GRAY_LIGHT}
              />
              <SystemText
                style={this._getStatusTextStyle(styles.rechargeValueText)}
              >
                {`R$ ${formatCurrency(rechargeValue)}`}
              </SystemText>
            </View>
            <SystemText style={this._getStatusTextStyle(styles.statusLabel)}>
              Valor programado
            </SystemText>
          </View>
          <View style={styles.scheduledDayInfoContainer}>
            <SystemText
              style={this._getStatusTextStyle(styles.scheduledDayText)}
            >
              {`Dia ${scheduledDay}`}
            </SystemText>
            <SystemText style={this._getStatusTextStyle(styles.statusLabel)}>
              Compra mensal
            </SystemText>
          </View>
        </View>
        <TouchableNative
          style={styles.toggleContainer}
          onPress={this._toggleSmartPurchase}
        >
          <SystemText style={styles.toggleLabel}>
            {`Compra programada ${isActive ? "ativa" : "desativada"}`}
          </SystemText>
          <Switch checked={isActive} viewOnly />
        </TouchableNative>
        {!isActive && (
          <Button
            onPress={this._showRemoveSmartPurchaseAlert}
            style={styles.removeBtn}
            outline={"primary"}
            outlineText={"primary"}
          >
            Excluir permanentemente
          </Button>
        )}
      </View>
    );
  };

  _showRemoveSmartPurchaseAlert = () => {
    Alert.alert(
      "Remover compra programada",
      "Você tem certeza que deseja remover esta compra programada?",
      [
        {
          text: "Cancelar",
          onPress: () => {}
        },
        {
          text: "Sim",
          onPress: this._submitRemove
        }
      ]
    );
  };

  _toggleSmartPurchase = () => {
    const {
      currentSmartPurchaseDetail: {
        id,
        cardData,
        isActive,
        rechargeValue,
        scheduledDay,
        paymentMethod,
        idTransportCardWallet,
        productQuantity
      },
      dispatch,
      savedPaymentMethods
    } = this.props;

    const params = {
      smartPurchaseId: id,
      transportCardId: cardData.uuid,
      transportCardIssuer: cardData.issuer,
      activateSmartPurchase: !isActive,
      rechargeValue: Number(rechargeValue) * 100,
      scheduledDay,
      paymentMethodId: paymentMethod.id,
      buAdditionalData: {
        ...(cardData.layoutType === transportCardTypes.BU
          ? {
              idTransportCardWallet,
              productQuantity
            }
          : {})
      }
    };

    if (
      !checkIfSmartPurchaseHasPaymentMethod(
        dispatch,
        paymentMethod.id,
        savedPaymentMethods
      )
    )
      return;

    dispatch(fetchSaveSmartPurchase(params)).catch(error => {
      dispatch(showToast(error.message, toastStyles.ERROR));
    });
  };

  _submitRemove = () => {
    const {
      currentSmartPurchaseDetail: { id },
      dispatch
    } = this.props;

    dispatch(fetchRemoveSmartPurchase(id))
      .then(() => {
        dispatch(showToast("Compra programada removida com sucesso!"));
        this._close();
      })
      .catch(error => {
        dispatch(showToast(error.message, toastStyles.ERROR));
      });
  };

  _goToEditSmartPurchase = () => {
    const { dispatch, currentSmartPurchaseDetail } = this.props;
    dispatch(
      navigateToRoute(routeNames.BUY_CREDIT, {
        editSmartPurchase: currentSmartPurchaseDetail,
        smartPurchaseFlow: true
      })
    );
  };

  render() {
    const { currentSmartPurchaseDetail, saveSmartPurchaseUi } = this.props;
    const { cardData, hasError, lastError } = currentSmartPurchaseDetail;

    return (
      <View style={styles.container}>
        <Header
          title="Compra Programada"
          left={{
            type: headerActionTypes.BACK,
            onPress: this._close
          }}
          right={{
            type: headerActionTypes.EDIT,
            onPress: this._goToEditSmartPurchase
          }}
        />
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="always"
        >
          <KeyboardDismissView style={styles.scrollViewContent}>
            <TransportCardSm
              style={styles.transportCardSm}
              cardName={cardData.nick}
              cardNumber={cardData.cardNumber}
              layoutType={cardData.layoutType}
            />
            {hasError && (
              <BrandText style={styles.errorInfoText}>
                {`Ocorreu um erro na sua última tentativa de compra.${
                  lastError ? ` ${lastError}.` : ""
                }`}
              </BrandText>
            )}
            {this._renderStatusContainer()}
          </KeyboardDismissView>
        </ScrollView>
        {saveSmartPurchaseUi.isFetching && (
          <LoadMask message="Atualizando compra programada" />
        )}
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
  scrollView: {
    flex: 1
  },
  scrollViewContent: {
    paddingVertical: 24,
    paddingHorizontal: 16
  },
  transportCardSm: {
    marginBottom: 24
  },
  statusInfoContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colors.GRAY_LIGHTER,
    marginBottom: 16
  },
  rechargeValueInfoContainer: {
    flex: 1,
    padding: 16,
    borderRightWidth: 1,
    borderColor: colors.GRAY_LIGHTER,
    alignItems: "center",
    justifyContent: "center"
  },
  rechargeValueInfo: {
    flexDirection: "row",
    marginBottom: 4
  },
  rechargeValueText: {
    fontSize: 20,
    lineHeight: 24,
    color: colors.BRAND_PRIMARY,
    marginLeft: 8
  },
  statusLabel: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: colors.GRAY
  },
  scheduledDayInfoContainer: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  scheduledDayText: {
    fontSize: 20,
    lineHeight: 24,
    color: colors.GRAY_DARKER,
    marginBottom: 4
  },
  toggleContainer: {
    flexDirection: "row"
  },
  toggleLabel: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: colors.GRAY_DARKER
  },
  removeBtn: {
    marginTop: 40
  },
  errorInfoText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.BRAND_ERROR,
    marginBottom: 24
  },
  textDisabled: {
    color: colors.GRAY_LIGHT
  }
});

// Redux
const mapStateToProps = state => ({
  cardData: getPurchaseTransportCard(state),
  saveSmartPurchaseUi: getSaveSmartPurchaseUI(state),
  currentSmartPurchaseDetail: getCurrentSmartPurchaseDetail(state),
  savedPaymentMethods: getSavedPaymentList(state)
});

export const EditSmartPurchase = connect(mapStateToProps)(
  EditSmartPurchaseView
);
