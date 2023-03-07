// NPM imports
import React from 'react';

import { StyleSheet } from 'react-native';

// VouD imports
import SystemText from '../../../../components/SystemText';
import TouchableNative from '../../../../components/TouchableNative';

// styles
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 4,
    minHeight: 48,
    borderWidth: 1,
    backgroundColor: 'transparent',
    elevation: 0,
    padding: 8,
  },
  text: {
    textAlign: 'center',
    color: '#C0C0C0',
    fontSize: 18,
  },
});

// component
const AddCreditButton = ({ onPress, children, style, styleText }) => {
  const getButtonStyle = () => {
    return StyleSheet.flatten([style, styles.button]);
  };

  return (
    <TouchableNative onPress={onPress} style={getButtonStyle()} disablePreventDoubleTap>
      <SystemText style={StyleSheet.flatten([styles.text, styleText])}>{children}</SystemText>
    </TouchableNative>
  );
};

export default AddCreditButton;
