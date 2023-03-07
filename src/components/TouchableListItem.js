import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import TouchableNative from './TouchableNative';
import BrandText from './BrandText';
import Icon from './Icon';
import { colors } from '../styles';

class TouchableListItem extends Component {

  constructor(props) {
    super(props);
  }

  _onPress = () => {
    const { onPress, item } = this.props;
    onPress(item);
  }

  _getItemStyles = () => {
    const { isLast } = this.props;
    const rowStyles = [styles.container];

    if (isLast) rowStyles.push(styles.lastRow);

    return StyleSheet.flatten(rowStyles);
  };

  render() {
    const { item } = this.props;
    return (
      <TouchableNative 
        style={this._getItemStyles()}
        onPress={this._onPress}
      >
        <BrandText 
          style={styles.itemText}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.name}
        </BrandText>
        <Icon 
          style={styles.icon}
          name="arrow-forward"
        />
      </TouchableNative>
    );
  }
}

// Styles
const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 72,
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.GRAY_LIGHTER,
    backgroundColor: 'white'
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    color: colors.GRAY_DARKER,
  },
  icon: {
    marginLeft: 16,
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.BRAND_PRIMARY,
  },
  lastRow: {
    borderBottomWidth: 0
  },
};

export default TouchableListItem;
