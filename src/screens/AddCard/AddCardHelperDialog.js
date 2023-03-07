// NPM imports
import React, { Component } from "react";
import { Image, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import { formValueSelector } from "redux-form";

// VouD imports
import BrandText from "../../components/BrandText";
import TouchableText from "../../components/TouchableText";
import Dialog from "../../components/Dialog";
import { colors } from "../../styles/constants";
import { transportCardTypeValues } from "./TransportCardTypeSelectField";

// Screen component
const bomHelperImg = require("../../images/transport-cards/bom-number-helper.png");
const bomHelperPicImg = require("../../images/transport-cards/bom-number-helper-pic.png");
const bomHelperPlusImg = require("../../images/transport-cards/bom-number-helper-plus.png");

const buHelperImg = require("../../images/transport-cards/bu-number-helper.png");
const buHelperPic1Img = require("../../images/transport-cards/bu-number-helper-pic1.png");
const buHelperPic2Img = require("../../images/transport-cards/bu-number-helper-pic2.png");

const legalHelperImg = require("../../images/transport-cards/nr-legal.png");

const propTypes = {};

class AddCardHelperDialogView extends Component {
  _dismiss = () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.back());
  };

  _renderContent = () => {
    const {
      navigation: {
        state: {
          params: { issuerType }
        }
      }
    } = this.props;

    if (issuerType === transportCardTypeValues.BOM) {
      return (
        <View style={styles.content}>
          <BrandText style={styles.title}>Número do Cartão BOM</BrandText>
          <BrandText style={styles.text}>
            O número do Cartão BOM começa com 31 e encontra-se em um dos locais
            indicados abaixo:
          </BrandText>
          <View style={styles.cardImages}>
            <Image source={bomHelperImg} />
            <Image source={bomHelperPlusImg} style={styles.ml16} />
          </View>
          <BrandText style={styles.sub}>Modelos sem foto</BrandText>
          <View style={styles.cardImages}>
            <Image source={bomHelperPicImg} />
          </View>
          <BrandText style={styles.sub}>Modelos com foto</BrandText>
        </View>
      );
    }

    if (issuerType === transportCardTypeValues.LEGAL) {
      return (
        <View style={styles.content}>
          <BrandText style={styles.title}>Número do Cartão LEGAL</BrandText>
          <BrandText style={styles.text}>
            O número do Cartão LEGAL encontra-se em um dos locais indicados
            abaixo:
          </BrandText>
          <View style={styles.cardImages}>
            <Image source={legalHelperImg} />
          </View>
          <BrandText style={styles.sub}>Modelos sem foto</BrandText>
        </View>
      );
    }

    return (
      <View style={styles.content}>
        <BrandText style={styles.title}>Número do Bilhete Único</BrandText>
        <BrandText style={styles.text}>
          Estudante ou cadastrado - insira o código presente na frente do
          cartão, em um dos locais indicados abaixo:
        </BrandText>
        <View style={styles.cardImages}>
          <Image source={buHelperPic1Img} />
          <Image source={buHelperPic2Img} style={styles.ml16} />
        </View>
        <BrandText style={StyleSheet.flatten([styles.text, styles.mt32])}>
          Demais modelos - últimos 9 números no verso do cartão:
        </BrandText>
        <View style={styles.cardImages}>
          <Image source={buHelperImg} />
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <Dialog onDismiss={this._dismiss} noPadding>
          {this._renderContent()}
          <View style={styles.actions}>
            <TouchableText onPress={this._dismiss} color={colors.GRAY}>
              Fechar
            </TouchableText>
          </View>
        </Dialog>
      </View>
    );
  }
}

AddCardHelperDialogView.propTypes = propTypes;

// Styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24
  },
  title: {
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 20,
    color: colors.BRAND_PRIMARY
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.GRAY
  },
  sub: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    color: colors.GRAY
  },
  cardImages: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24
  },
  ml16: {
    marginLeft: 16
  },
  mt32: {
    marginTop: 32
  },
  actions: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: colors.GRAY_LIGHTER
  }
});

const mapStateToProps = state => ({
  cardType: formValueSelector("addCard")(state, "cardType")
});

export const AddCardHelperDialog = connect(mapStateToProps)(
  AddCardHelperDialogView
);
