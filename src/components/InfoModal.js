import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import VoudModal from "./Modal";
import { colors } from "../styles";

const propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired
};

class InfoModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isVisible, onDismiss, children, isDiscountInfoModal } = this.props;
    const paddingHorizontal = isDiscountInfoModal === undefined ? 40 : 0;

    return (
      <VoudModal
        isVisible={isVisible}
        style={styles.container}
        onSwipe={onDismiss}
        onBackdropPress={onDismiss}
        swipeDirection="down"
        backdropOpacity={0.3}
      >
        <View style={[styles.modalContent,{paddingHorizontal: paddingHorizontal}]}>
          <View style={styles.handle} />
          {children}
        </View>
      </VoudModal>
    );
  }
}

InfoModal.propTypes = propTypes;

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
    // paddingHorizontal: 40,
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
  }
});

export default InfoModal;
