// NPM imports
import React from "react";
import PropTypes from "prop-types";
import { Image, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

// VouD imports
import Icon from "../Icon";
import TouchableOpacity from "../TouchableOpacity";
import {
  transportCardTypes,
  actionsAddTransCard
} from "../../redux/transport-card";
import { colors } from "../../styles";
import NotificationBadge from "../NotificationBadge/index";

// Images
const bomLogo = require("../../images/transport-cards/bom-badge.png");
const bomLogoGray = require("../../images/transport-cards/bom-badge-gray.png");
const buLogo = require("../../images/transport-cards/bu-badge.png");
const buLogoGray = require("../../images/transport-cards/bu-badge-gray.png");
const legalLogoGray = require("../../images/transport-cards/legal-badge-gray.png");
const legalLogo = require("../../images/transport-cards/legal-badge.png");

const bilheteUnitarioGray = require("../../images/transport-cards/BilheteUnitario-badge-gray.png");
const bilheteUnitario = require("../../images/transport-cards/BilheteUnitarioQrCode.png");

const taxi = require("../../images/taxi.png");
const carro = require("../../images/carro.png");

class TransportCardBadge extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    style: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
  };

  constructor(props) {
    super(props);

    this.state = {};

    this.gradients = {
      ADD: [colors.BRAND_PRIMARY_DARKER, colors.BRAND_PRIMARY_LIGHTER],
      BU: [colors.CARD_BU, "white"],
      BOM_COMUM: [colors.CARD_C, "white"],
      BOM_VT: [colors.CARD_VT, "white"],
      BOM_ESCOLAR: [colors.CARD_E, "white"],
      BILHETE_UNITARIO: [colors.BRAND_PRIMARY, "white"],
      LEGAL: [colors.CARD_LEGAL_PRIMARY, "white"]
    };
  }

  getGradientByLayoutType = layoutType => {
    if (layoutType === transportCardTypes.BILHETE_UNITARIO)
      return this.gradients.BILHETE_UNITARIO;

    if (layoutType === transportCardTypes.BU) return this.gradients.BU;

    if (layoutType === transportCardTypes.LEGAL) return this.gradients.LEGAL;

    if (
      layoutType === transportCardTypes.BOM_VT ||
      layoutType === transportCardTypes.BOM_VT_EXPRESS
    )
      return this.gradients.BOM_VT;

    if (
      layoutType === transportCardTypes.BOM_ESCOLAR ||
      layoutType === transportCardTypes.BOM_ESCOLAR_GRATUIDADE
    )
      return this.gradients.BOM_ESCOLAR;

    return this.gradients.BOM_COMUM;
  };

  renderImageLogo = type => {
    switch (type) {
      case transportCardTypes.BU:
        return buLogo;
      case transportCardTypes.BILHETE_UNITARIO:
        return bilheteUnitario;
      case transportCardTypes.LEGAL:
        return legalLogo;

      default:
        return bomLogo;
    }
  };

  renderImageLogaGray = type => {
    switch (type) {
      case "ADD_BOM":
        return bomLogoGray;
      case "ADD_BIUN":
        return bilheteUnitarioGray;
      case "ADD_LEGAL":
        return legalLogoGray;

      default:
        return buLogoGray;
    }
  };

  renderBadge = () => {
    const { type, onPress, style, hasPendingRecharges } = this.props;
    const imgSrc = this.renderImageLogo(type);

    return (
      <TouchableOpacity
        onPress={onPress}
        style={StyleSheet.flatten([styles.container, style])}
      >
        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          colors={this.getGradientByLayoutType(type)}
          style={styles.container}
        >
          <View style={styles.issuerContainer}>
            <Image source={imgSrc} />
          </View>
        </LinearGradient>
        {hasPendingRecharges && <NotificationBadge />}
      </TouchableOpacity>
    );
  };

  renderCarro = () => {
    const { onPress, style } = this.props;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={StyleSheet.flatten([styles.container, style])}
      >
        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          colors={this.gradients.ADD}
          style={styles.container}
        >
          <Image source={carro} />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  renderTaxi = () => {
    const { onPress, style } = this.props;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={StyleSheet.flatten([styles.container, style])}
      >
        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          colors={this.gradients.ADD}
          style={styles.container}
        >
          <Image source={taxi} />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  renderAdd = () => {
    const { onPress, style } = this.props;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={StyleSheet.flatten([styles.container, style])}
      >
        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          colors={this.gradients.ADD}
          style={styles.container}
        >
          <Icon name="add" style={styles.addIcon} />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  renderEmpty = () => {
    const { type, onPress, style } = this.props;
    // const imgSrc = type === 'ADD_BOM' ? bomLogoGray : buLogoGray;
    const imgSrc = this.renderImageLogaGray(type);

    return (
      <TouchableOpacity
        onPress={onPress}
        style={StyleSheet.flatten([styles.container, styles.empty, style])}
      >
        <Image source={imgSrc} />
      </TouchableOpacity>
    );
  };

  render() {
    const { type } = this.props;

    if (type === "ADD") return this.renderAdd();

    if (type === "CARRO") return this.renderCarro();

    if (type === "TAXI") return this.renderTaxi();

    if (
      type === "ADD_BOM" ||
      type === "ADD_BU" ||
      type === "ADD_BIUN" ||
      type === "ADD_LEGAL"
    )
      return this.renderEmpty();

    return this.renderBadge();
  }
}

// styles
const styles = {
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    height: 64,
    borderRadius: 32
  },
  empty: {
    borderWidth: 1,
    borderColor: colors.GRAY_LIGHT,
    backgroundColor: colors.GRAY_LIGHTER
  },
  issuerContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white"
  },
  addIcon: {
    fontSize: 24,
    color: "white"
  }
};

export default TransportCardBadge;
