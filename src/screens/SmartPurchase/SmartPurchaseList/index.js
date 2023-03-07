// NPM imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { FlatList, View } from "react-native";

// VouD imports
import SmartPurchaseListItem from "./Item";
import { colors } from "../../../styles";

// Component
const propTypes = {
  itemList: PropTypes.array.isRequired,
  onConfig: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

class SmartPurchaseList extends Component {
  _renderSmartPurchaseItem = ({ item }) => {
    const { onConfig, onEdit, onItemStatusToggle } = this.props;

    return (
      <SmartPurchaseListItem
        itemData={item}
        onConfig={onConfig}
        onEdit={onEdit}
        onItemStatusToggle={onItemStatusToggle}
      />
    );
  };

  render() {
    const { itemList } = this.props;

    return (
      <FlatList
        contentContainerStyle={styles.mainContainer}
        data={itemList}
        renderItem={this._renderSmartPurchaseItem}
        keyExtractor={item => item.cardData.uuid}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
    );
  }
}

const styles = {
  mainContainer: {
    paddingVertical: 8
  },
  itemSeparator: {
    borderColor: colors.GRAY_LIGHTER,
    borderBottomWidth: 1
  }
};

// prop types
SmartPurchaseList.propTypes = propTypes;

export default SmartPurchaseList;
