// NPM imports
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

// VouD Imports
import TouchableText from '../../components/TouchableText';
import { formatCurrency } from '../../utils/parsers-formaters';
import { colors } from '../../styles';

// Component
const propTypes = {
  value: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.number,
  isActive: PropTypes.bool,
  noMarginRight: PropTypes.bool,
}

class RechargeValue extends Component {

  constructor(props) {
    super(props);
    this.state = {
      componentHeight: null
    }
  }

  render() {
    const { value, isActive, style, onPress, noMarginRight } = this.props;
    const { componentHeight } = this.state;

    return (
      <TouchableText
        useSysFont
        style={StyleSheet.flatten([
          styles.rechargeValue,
          isActive ? styles.rechargeValueActive : {},
          noMarginRight ? styles.mr0 : {},
          componentHeight ? { height: componentHeight } : {},
          style
        ])}
        onPress={onPress}
        textStyle={StyleSheet.flatten([
          styles.rechargeValueText,
          isActive ? styles.rechargeValueTextActive : {},
        ])}
        onLayout={(event) => {
          // Note - We get and set the Height style in the component because an issue in RN.
          // If a component is added dynamically inside a ScrollView and it doesn't have the Height style, 
          // the ScrollView doesn't allow to scroll to the bottom.
          // See - https://github.com/appswefit/autopass-voud/issues/3422
          const { height } = event.nativeEvent.layout;
          this.setState({ componentHeight: height });
        }}
      >
        R$ {formatCurrency(value)}
      </TouchableText>
    )
  }
}

RechargeValue.propTypes = propTypes;

// Style
const styles = StyleSheet.create({
  rechargeValue: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colors.GRAY_LIGHT2,
    paddingVertical: 8,
    flex: 1,
    marginRight: 12,
  },
  mr0: {
    marginRight: 0,
  },
  rechargeValueActive: {
    backgroundColor: colors.BRAND_PRIMARY_LIGHTER,
    borderColor: colors.BRAND_PRIMARY_LIGHTER,
  },
  rechargeValueText: {
    fontSize: 16,
    color: colors.BRAND_PRIMARY_LIGHTER
  },
  rechargeValueTextActive: {
    color: 'white',
  }
});

export default RechargeValue;