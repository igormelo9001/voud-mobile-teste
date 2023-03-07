import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import VoudModal from '../Modal';

const propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired,
};

class ActionSheet extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isVisible, onDismiss, children } = this.props;
    const childrenWithProps = React.Children.map(children, (child, index) =>
      React.cloneElement(child, index === children.length - 1 ? { isLast: true } : {}));

    return (
      <VoudModal
        isVisible={isVisible}
        style={styles.container}
        onSwipe={onDismiss}
        onBackdropPress={onDismiss}
        swipeDirection="down"
      >
        <View style={styles.modalContent}>
          {childrenWithProps}
        </View>
      </VoudModal>
    );
  }
}

ActionSheet.propTypes = propTypes;

// Styles
const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
  },
});

export default ActionSheet;
