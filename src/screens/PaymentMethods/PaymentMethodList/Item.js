import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Image } from "react-native";

// VouD imports
import SystemText from "../../../components/SystemText";
import Icon from "../../../components/Icon";
import TouchableNative from "../../../components/TouchableNative";
import TouchableOpacity from "../../../components/TouchableOpacity";
import Spinner from "../../../components/Spinner";
import { colors } from "../../../styles";
import {
  getLogoForBrand,
  generateDisplayMask
} from "../../../utils/payment-card";
// import { verificationStatusType } from "../../../flows/verificationCard/components/types";

// Component
const propTypes = {
  itemData: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
  isRemoving: PropTypes.bool,
  onPress: PropTypes.func
};

const defaultProps = {
  isRemoving: false
};

class PaymentMethodListItem extends Component {
  render() {
    const { itemData, onRemove, isRemoving, onPress } = this.props;
    const ContainerComponent = onPress ? TouchableNative : View;

    return (
      <ContainerComponent
        style={styles.mainContainer}
        key={itemData.id}
        onPress={onPress}
      >
        <Image
          style={styles.cardIcon}
          source={getLogoForBrand(itemData.items.cardFlag)}
        />
        <View style={styles.cardInfo}>
          <SystemText style={styles.cardNumber}>
            {generateDisplayMask(
              itemData.items.cardFlag,
              itemData.items.finalDigits
            )}
          </SystemText>
          {itemData.items.expirationDate && (
            <SystemText style={styles.cardExpiration}>
              {`Validade ${itemData.items.expirationDate}`}
            </SystemText>
          )}
        </View>
        {isRemoving ? (
          <Spinner iconSize={16} style={styles.deleteButton} />
        ) : (
          <TouchableNative
            borderless
            style={styles.deleteButton}
            onPress={() => onRemove(itemData.id)}
          >
            <Icon name="delete" size={24} color={colors.GRAY_LIGHT} />
          </TouchableNative>
        )}
      </ContainerComponent>
    );
  }
}

// prop types
PaymentMethodListItem.propTypes = propTypes;
PaymentMethodListItem.defaultProps = defaultProps;

// Styles
const styles = {
  mainContainer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center"
  },
  cardIcon: {
    marginRight: 24
  },
  cardInfo: {
    flex: 1
  },
  cardNumber: {
    fontSize: 16,
    lineHeight: 20,
    color: colors.GRAY_DARKER,
    marginBottom: 4
  },
  cardExpiration: {
    fontSize: 14,
    lineHeight: 16,
    color: colors.GRAY
  },
  deleteButton: {
    marginLeft: 16
  },
  spinner: {
    marginLeft: 20,
    marginRight: 4
  }
};

export default PaymentMethodListItem;
