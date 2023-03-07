import React, { Component, Fragment } from "react";
import { pipe } from "ramda";
import PropTypes from "prop-types";
import { Image, StyleSheet, View } from "react-native";

// VouD imports
import TouchableNative from "../../../components/TouchableNative";
import { colors } from "../../../styles";
import BrandText from "../../../components/BrandText";
import SystemText from "../../../components/SystemText";
import Icon from "../../../components/Icon";
import Switch from "../../../components/Switch";
import {
  getColorForLayoutType,
  getLogoSmForLayoutType,
  getBUSupportedCreditTypes,
  isBOMEscolar,
  isLegal
} from "../../../utils/transport-card";
import { formatCurrency } from "../../../utils/parsers-formaters";
import { transportCardTypes } from "../../../redux/transport-card";

// Component
const propTypes = {
  itemData: PropTypes.object.isRequired,
  onConfig: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

class SmartPurchaseListItem extends Component {
  _getCardNickStyles = baseStyle =>
    pipe(
      () => [
        baseStyle,
        {
          color: getColorForLayoutType(this.props.itemData.cardData.layoutType)
        }
      ],
      StyleSheet.flatten
    )();

  _renderAdditionalInfo = (isBOMEscolar, isBUWithoutPurchaseSupport) => {
    const { itemData } = this.props;

    if (isBOMEscolar || isBUWithoutPurchaseSupport)
      return (
        <SystemText style={styles.additionalInfoText}>
          {isBOMEscolar
            ? "Funcionalidade indisponível para Cartão BOM Escolar"
            : "Compra de créditos indisponível para este cartão"}
        </SystemText>
      );

    if (itemData.hasError)
      return (
        <SystemText style={styles.additionalInfoErrorText}>
          Ocorreu um erro na última tentativa de compra. Verifique a
          configuração para reativar.
        </SystemText>
      );

    if (itemData.hasSetSmartPurchase)
      return (
        <SystemText
          style={StyleSheet.flatten([
            styles.additionalInfoText,
            !itemData.isActive ? styles.additionalInfoTextInactive : {}
          ])}
        >
          {itemData.hasSetSmartPurchase &&
            `Compra programada para todo dia ${itemData.scheduledDay}`}
        </SystemText>
      );
    return null;
  };

  render() {
    const { itemData, onConfig, onEdit, onItemStatusToggle } = this.props;
    const { cardData } = itemData;

    const isBOMEscolarCard = isBOMEscolar(cardData.layoutType);
    const isBUWithoutPurchaseSupport =
      cardData.layoutType == transportCardTypes.BU &&
      getBUSupportedCreditTypes(cardData).length === 0;
    const isDisabled = isBOMEscolarCard || isBUWithoutPurchaseSupport;

    // const isLegal = isLegal(cardData.layoutType);

    // isDisabled - transport card not allowed
    // itemData.isActive - smart purchase disabled / enabled
    // itemData.hasSetSmartPurchase - smart purchase unset / set

    return (
      <TouchableNative
        style={styles.mainContainer}
        key={itemData.cardData.uuid}
        onPress={() => {
          if (!isDisabled) {
            if (itemData.hasSetSmartPurchase) onEdit(itemData);
            else onConfig(itemData);
          }
        }}
      >
        {/* ===================== */}
        {/* ======= HEADER ====== */}
        {/* ===================== */}
        <View style={styles.headerContainer}>
          <Image
            style={styles.transportCardLogo}
            source={getLogoSmForLayoutType(cardData.layoutType)}
          />
          <BrandText style={this._getCardNickStyles(styles.cardNick)}>
            {cardData.nick}
          </BrandText>
          {!isDisabled && itemData.hasSetSmartPurchase && (
            <Switch
              checked={itemData.isActive}
              onPress={() => {
                onItemStatusToggle(itemData);
              }}
            />
          )}
          {!itemData.hasSetSmartPurchase && !isDisabled && (
            <BrandText style={styles.addSmartPurchaseText}>ADICIONAR</BrandText>
          )}
        </View>

        {/* ===================== */}
        {/* ======== BODY ======= */}
        {/* ===================== */}
        {itemData.hasSetSmartPurchase && (
          <Fragment>
            <View style={styles.purchaseValueContainer}>
              <Icon
                name="automatic-purchase"
                size={24}
                color={
                  itemData.isActive ? colors.BRAND_PRIMARY : colors.GRAY_LIGHT
                }
              />
              <SystemText
                style={StyleSheet.flatten([
                  styles.purchaseValueText,
                  !itemData.isActive ? styles.purchaseValueTextInactive : {}
                ])}
              >
                {`R$ ${formatCurrency(itemData.rechargeValue)}`}
              </SystemText>
            </View>
            <View>
              {itemData.isActive && (
                <SystemText style={styles.transactionValueText}>
                  {`Total (crédito + tarifa): R$ ${formatCurrency(
                    itemData.transactionValue
                  )}`}
                </SystemText>
              )}
            </View>
          </Fragment>
        )}
        {this._renderAdditionalInfo(
          isBOMEscolarCard,
          isBUWithoutPurchaseSupport
        )}
      </TouchableNative>
    );
  }
}

// prop types
SmartPurchaseListItem.propTypes = propTypes;

// Styles
const styles = {
  mainContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  transportCardLogo: {
    width: 24,
    height: 24
  },
  cardNick: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 20,
    marginHorizontal: 8
  },
  purchaseValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8
  },
  purchaseValueText: {
    fontSize: 20,
    lineHeight: 24,
    color: colors.BRAND_PRIMARY,
    marginLeft: 8
  },
  purchaseValueTextInactive: {
    color: colors.GRAY_LIGHT
  },
  transactionValueText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.GRAY_DARKER
  },
  additionalInfoText: {
    fontSize: 14,
    color: colors.GRAY,
    marginTop: 4
  },
  additionalInfoTextInactive: {
    color: colors.GRAY_LIGHT
  },
  additionalInfoErrorText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.BRAND_ERROR
  },
  addSmartPurchaseText: {
    fontWeight: "bold",
    color: colors.BRAND_PRIMARY,
    fontSize: 14
  }
};

export default SmartPurchaseListItem;
