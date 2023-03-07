// NPM imports
import React from 'react';
import { View, StyleSheet } from 'react-native';

// VouD imports
import CheckBox from './CheckBox';

// Component
const CheckBoxField = ({ input, text, right, styleContainer, style, disabled, onPressDisabled, ...props,  }) => {
  return (
    <View style={StyleSheet.flatten([styles.container, styleContainer])}>
      <CheckBox
        {...props}
        style={StyleSheet.flatten([style, styles.checkbox])}
        checked={input.value}
        onPress={() => {
          if (disabled) {
            onPressDisabled && onPressDisabled();
          } else {
            input.onChange(!input.value);

          }
        }}
      >
        {text}
      </CheckBox>
      {right && right()}
    </View>
  )
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    flex: 1
  }
});

export default CheckBoxField;
