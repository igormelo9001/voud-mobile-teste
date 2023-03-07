import React from 'react';
import { TextInput, StyleSheet, Platform, View } from 'react-native';

class RoundedTextInput extends React.Component {
  render() {
    const { input, ...inputProps } = this.props;

    let refFunc = () => { };
    if (inputProps.getRef)
      refFunc = inputProps.getRef

      return (
      <TextInput
        {...inputProps}
        ref={r => refFunc(r)}
        style={[styles.style, inputProps.style]}
        onChangeText={input.onChange}
        onBlur={input.onBlur}
        onFocus={input.onFocus}
        value={input.value}
        autoCapitalize="characters"
        maxLength={1}
        underlineColorAndroid="transparent"
        // clearButtonMode="while-editing"
        // clearTextOnFocus={true}
        // enablesReturnKeyAutomatically={true}
        // onKeyPress={input.onKeyPress}
      />
    );
  }
}

const styles = StyleSheet.create({
  style: {
    backgroundColor: '#fff',
    height: 43,
    width: 36,
    textAlign: 'center',
    flex: 1,
    fontSize: 16,
  }
});

export default RoundedTextInput;
