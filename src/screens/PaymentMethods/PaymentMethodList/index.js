// NPM imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { FlatList } from "react-native";

// VouD imports
import PaymentMethodListItem from "./Item";

// Component
const propTypes = {
  removingMethodId: PropTypes.number,
  itemList: PropTypes.array.isRequired,
  onPress: PropTypes.func,
  onPressVerification: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

const defaultProps = {
  removingMethodId: 0
};

class PaymentMethodList extends Component {
  _renderPaymentMethodItem = ({ item }) => {
    const {
      onRemove,
      removingMethodId,
      onPress,
      onPressVerification,
      onPressVerificationConfirmation
    } = this.props;
    return (
      <PaymentMethodListItem
        isRemoving={item.id === removingMethodId}
        itemData={item}
        onRemove={() => {
          onRemove(item);
        }}
        onPress={
          onPress
            ? () => {
                onPress(item);
              }
            : null
        }
        onPressVerification={onPressVerification}
        onPressVerificationConfirmation={onPressVerificationConfirmation}
      />
    );
  };

  render() {
    const { itemList, removingMethodId } = this.props;

    return (
      <FlatList
        contentContainerStyle={styles.mainContainer}
        data={itemList}
        renderItem={this._renderPaymentMethodItem}
        keyExtractor={item => item.id}
        extraData={removingMethodId}
      />
    );
  }
}

const styles = {
  mainContainer: {
    paddingVertical: 8
  }
};

// prop types
PaymentMethodList.propTypes = propTypes;
PaymentMethodList.defaultProps = defaultProps;

export default PaymentMethodList;
