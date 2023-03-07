import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import TouchableNative from '../TouchableNative';
import BrandText from '../BrandText';
import Icon from '../Icon';
import { colors } from '../../styles';

const propTypes = {
  onPress: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isLast: PropTypes.bool,
};

const defaultProps = {
  isLast: false,
};

class ActionSheetItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onPress, icon, label, isLast } = this.props;
    return (
      <TouchableNative
        onPress={onPress}
        style={StyleSheet.flatten([styles.container, isLast ? styles.isLast : {}])}
      >
        <Icon
          name={icon}
          style={styles.icon} 
        />
        <BrandText style={styles.label}>{label}</BrandText>
      </TouchableNative>
    );
  }
}

ActionSheetItem.propTypes = propTypes;
ActionSheetItem.defaultProps = defaultProps;

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_LIGHT
  },
  isLast: {
    borderBottomWidth: 0,
  },
  icon: {
    fontSize: 24,
    color: colors.BRAND_PRIMARY,
    marginRight: 16
  },
  label: {
    fontSize: 16,
    lineHeight: 20,
    color: colors.GRAY_DARKER
  }
});

export default ActionSheetItem;
