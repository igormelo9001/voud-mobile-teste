// NPM imports
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

// VouD imports
import { colors } from '../../../../../styles';
import BrandText from '../../../../../components/BrandText';
import CircleButton from './CircleButton';
import SystemText from '../../../../../components/SystemText';

// component

const propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  minQuotaQty: PropTypes.number.isRequired,
  maxQuotaQty: PropTypes.number.isRequired,
};

const defaultProps = {
  style: {},
};

class BUQuotaQtyField extends Component {

  _incrementValue = () => {
    const { input } = this.props;
    input.onChange(input.value + 1);
  }

  _decrementValue = () => {
    const { input } = this.props;
    input.onChange(input.value - 1);
  }

  render() {
    const { style, input, maxQuotaQty, minQuotaQty } = this.props;

    return (
      <View style={StyleSheet.flatten([styles.container, style])}>
        <BrandText style={styles.fieldLabel}>
          Cotas:
        </BrandText>
        <View style={styles.quotaCountContainer}>
          <View style={styles.quotaCountControls}>
            <CircleButton
              iconName="minus"
              disabled={input.value === minQuotaQty}
              onPress={this._decrementValue}
            />
            <SystemText style={styles.quotaQty}>
              {input.value}
            </SystemText>
            <CircleButton
              iconName="add"
              disabled={input.value === maxQuotaQty}
              onPress={this._incrementValue}
            />
          </View>
          <SystemText style={styles.maxQuotaQtyLabel}>
            Máximo de {maxQuotaQty === 1 ? '1 cota' : `${maxQuotaQty} cotas`}
          </SystemText>
        </View>
      </View>
    );
  }
}

BUQuotaQtyField.propTypes = propTypes;
BUQuotaQtyField.defaultProps = defaultProps;

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.GRAY,
    marginBottom: 8
  },
  quotaCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quotaQty: {
    minWidth: 40,
    fontSize: 32,
    lineHeight: 40,
    textAlign: 'center',
    color: colors.GRAY_DARKER,
    marginHorizontal: 8,
  },
  quotaCountControls:{
    flexDirection: 'row',
    marginRight: 16,
    alignItems: 'center'
  },
  maxQuotaQtyLabel: {
    flex: 1,
    textAlign: 'center',
    color: colors.GRAY,
  }
});

export default BUQuotaQtyField;
