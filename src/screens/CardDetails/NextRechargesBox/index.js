// NPM imports
import React, { Component } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  Image,
  View
} from "react-native";

// VouD imports

import SystemText from "../../../components/SystemText";
import { colors } from "../../../styles";
const validator = require("../../../images/img-validador.png");

const typesRecharge = {
  RECHARGE_PENDING: "RECHARGE_PENDING",
  RECHARGE_ERROR: "RECHARGE_ERROR"
};

// Component
class NextRechargesBox extends Component {
  constructor(props) {
    super(props);

    const { type } = this.props;
    let value = 0;
    let valueAnimationTop = 24;

    if (type === typesRecharge.RECHARGE_ERROR) {
      value = 1;
      valueAnimationTop = 100;
    }

    this._animValue = new Animated.Value(value);

    this._animOpacity = this._animValue.interpolate({
      inputRange: [0, 0],
      outputRange: [0, 1]
    });

    this._animTop = this._animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [valueAnimationTop, 0]
    });
  }

  componentWillMount() {
    const { type } = this.props;

    if (type === typesRecharge.RECHARGE_ERROR) {
      setTimeout(() => {
        Animated.timing(this._animValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }).start();
      }, 5000);
    } else {
      Animated.timing(this._animValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }).start();
    }
  }

  renderRechargePending = () => {
    const animStyle = {
      opacity: this._animOpacity,
      transform: [{ translateY: this._animTop }]
    };
    return (
      <Animated.View
        style={StyleSheet.flatten([styles.containerRechargePending, animStyle])}
      >
        <TouchableOpacity
          style={styles.rechargePending}
          activeOpacity={0.8}
          onPress={this.props.onPress}
        >
          <Animated.View style={styles.rechargePendingImage}>
            <View style={styles.containerImageRechargePending}>
              <Image source={validator} resizeMode="contain" />
            </View>
            <View style={styles.containerRechargeDescription}>
              <SystemText
                style={styles.rechargeValue}
              >{`R$ ${this.props.value} Aguardando validação`}</SystemText>
              <SystemText style={{ color: "#FFFF", fontSize: 12 }}>
                Encontre o validador mais próximo e aproxime o seu cartão.
              </SystemText>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  renderRechargeError = () => {
    const animStyle = {
      opacity: this._animOpacity,
      transform: [{ translateY: this._animTop }]
    };
    return (
      <Animated.View
        style={StyleSheet.flatten([styles.containerRechargePending, animStyle])}
      >
        <View style={styles.rechargeError}>
          <Animated.View style={styles.rechargePendingImage}>
            <View style={styles.containerImageRechargePending}>
              <Image source={validator} resizeMode="contain" />
            </View>
            <View style={styles.containerRechargeDescription}>
              <SystemText style={styles.rechargeValue}>
                Serviço indisponível
              </SystemText>
              <SystemText style={{ color: "#FFFF", fontSize: 12 }}>
                Erro ao carregar saldo aguardando validação.
              </SystemText>
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    );
  };

  render() {
    const { type } = this.props;
    if (typesRecharge.RECHARGE_PENDING === type)
      return this.renderRechargePending();

    if (typesRecharge.RECHARGE_ERROR === type)
      return this.renderRechargeError();
    return <View></View>;
  }
}

// Styles
const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: "white"
  },
  containerRechargePending: {
    marginLeft: 12,
    marginRight: 12,
    padding: 5
  },
  rechargePending: {
    height: 71,
    width: "100%",
    marginBottom: 13,
    backgroundColor: "#6E3E91",
    elevation: 1,
    borderRadius: 8
  },
  rechargePendingImage: {
    flexDirection: "row"
  },
  containerImageRechargePending: {
    marginLeft: 15.5,
    marginTop: 17.5,
    marginBottom: 18.5
  },
  containerRechargeDescription: {
    flex: 1,
    marginLeft: 16.49,
    marginTop: 10,
    alignItems: "flex-start"
  },
  rechargeValue: {
    color: "#fdc300",
    fontSize: 12,
    fontWeight: "bold"
  },
  rechargeEmpty: {
    height: 71,
    width: "100%",
    marginBottom: 13,
    backgroundColor: colors.BRAND_SUCCESS,
    elevation: 1,
    borderRadius: 8
  },
  rechargeError: {
    height: 71,
    width: "100%",
    marginBottom: 13,
    backgroundColor: colors.BRAND_ERROR,
    elevation: 1,
    borderRadius: 8
  }
});

export default NextRechargesBox;
