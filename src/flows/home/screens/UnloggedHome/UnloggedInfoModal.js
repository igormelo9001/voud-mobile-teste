import React, { Component } from "react";
import { StyleSheet, Image } from "react-native";
import PropTypes from "prop-types";

import VoudText from "../../../../components/VoudText";
import { colors } from "../../../../styles";
import GradientButton from "../../../../components/GradientButton";
import InfoModal from "../../../../components/InfoModal";
import { View } from "react-native-animatable";

const propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired
};

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white"
  },
  imgWrapper: {
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 24,
    color: colors.BRAND_PRIMARY_DARKER,
    textAlign: "center"
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.GRAY,
    textAlign: "center",
    paddingVertical: 16
  }
});

class UnloggedInfoModal extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      isVisible,
      onDismiss,
      image,
      title,
      description,
      buttonCallback
    } = this.props;
    return (
      <InfoModal isVisible={isVisible} onDismiss={onDismiss}>
        <View style={styles.container}>
          <View style={styles.imgWrapper}>
            <Image source={image} resizeMode="contain" />
          </View>
          <VoudText style={styles.title}>{title}</VoudText>
          <VoudText style={styles.description}>{description}</VoudText>
          <GradientButton
            text="Acessar ou Cadastrar"
            large
            onPress={() => {
              onDismiss();
              buttonCallback();
            }}
          />
        </View>
      </InfoModal>
    );
  }
}

UnloggedInfoModal.propTypes = propTypes;

export default UnloggedInfoModal;
