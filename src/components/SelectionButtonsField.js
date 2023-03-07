// NPM imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

// VouD imports
import SelectionButton from './SelectionButton';
import BrandText from './BrandText';
import { colors } from '../styles';

// Component
const propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};

const defaultProps = {
  style: {},
};

class SelectionButtonsField extends Component {

  render() {
    const {
      style,
      input,
      options,
      label,
      onChangeValidation,
      columnDirection
    } = this.props;

    return (
      <View style={StyleSheet.flatten([styles.container, style])}>
        {
          label &&
          <BrandText style={styles.fieldLabel}>
            { label }
          </BrandText>
        }
        <View style={columnDirection ? styles.brandsListColumn : styles.brandsListRow}>
          {
            options && options.map((option, i) => (
              <SelectionButton
                key={i}
                style={StyleSheet.flatten([
                  columnDirection ? styles.buttonColumn : styles.buttonRow,
                  i === 0 ? (columnDirection ? styles.firstButtonColumn : styles.firstButtonRow) : null
                ])}
                outline
                gray
                pristine={input.value === ''}
                selected={option.value === input.value}
                onPress={() => {
                  if (onChangeValidation && !onChangeValidation(option.value)) return;

                  input.onChange(option.value);
                }}
                useSysFont={true}
              >
                { option.label }
              </SelectionButton>
            ))
          }
        </View>
      </View>
    );
  }
}

SelectionButtonsField.propTypes = propTypes;
SelectionButtonsField.defaultProps = defaultProps;

// Styles
const styles = StyleSheet.create({
  container: {
  },
  brandsListRow: {
    flexDirection: 'row',
  },
  brandsListColumn: {
    flexDirection: 'column',
  },
  buttonRow: {
    flex: 1,
    marginLeft: 8,
  },
  firstButtonRow: {
    marginLeft: 0
  },
  buttonColumn: {
    flex: 1,
    marginTop: 8,
  },
  firstButtonColumn: {
    marginTop: 0
  },
  fieldLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.GRAY,
    marginBottom: 8
  }
});

export default SelectionButtonsField;
