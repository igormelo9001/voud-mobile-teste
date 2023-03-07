import React, { Component } from 'react';
import { StyleSheet, Linking, Image,View } from 'react-native';
import PropTypes from 'prop-types';

import VoudText from "../../../../components/VoudText";
import { colors } from "../../../../styles";
import { GAEventParams, GATrackEvent } from "../../../../shared/analytics";
import GradientButton from "../../../../components/GradientButton";
import InfoModal from "../../../../components/InfoModal";

const discountImg = require("../../../../images/discount-img.png");

const propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired
};

class DiscountInfoModal extends Component {
  constructor(props) {
    super(props);
  }

  _openDiscountPage = () => {
    const {
      categories: { BUTTON },
      actions: { CLICK },
      labels: { OPEN_DISCOUNT_PAGE }
    } = GAEventParams;
    GATrackEvent(BUTTON, CLICK, OPEN_DISCOUNT_PAGE);
    Linking.openURL(
      "http://www.descontosbom.com.br/?utm_source=Descontos%20BOM&utm_medium=Clube%20de%20Desconto"
    );
  };

  render() {
    const { isVisible, onDismiss } = this.props;

    return (
      <InfoModal
        isVisible={isVisible}
        onDismiss={onDismiss}
         isDiscountInfoModal={true}
      >
      <View style={{width:"100%",alignItems:"center",justifyContent:"center"}}>
        <Image
          style={styles.discountImg}
          source={discountImg}
          resizeMode="contain"
        />
        </View>
        <View style={{paddingHorizontal:40}}>
        <VoudText style={styles.infoTitle}>Clube de Descontos</VoudText>
        <VoudText style={styles.infoText}>
          Você será direcionado para um monte de descontos incríveis e exclusivos! Para utilizar, basta ter em mãos seu número do BOM. Experimente!
        </VoudText>
        <GradientButton
          large
          text="Continuar"
          onPress={this._openDiscountPage}
        />
        </View>
      </InfoModal>
    );
  }
}

DiscountInfoModal.propTypes = propTypes;

// Styles
const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    margin: 0
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 40,
    paddingTop: 8,
    paddingBottom: 16,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: {
      height: -2,
      width: 0
    },
    elevation: 16
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.GRAY_LIGHT,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 42
  },
  infoTitle: {
    color: colors.BRAND_PRIMARY_DARKER,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16
  },
  infoText: {
    color: colors.GRAY_DARK,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 32
  },
  discountImg: {
    height: 192,
    // alignItems: 'center',
  }
});

export default DiscountInfoModal;
