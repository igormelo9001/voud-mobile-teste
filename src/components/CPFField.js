// NPM imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

// VouD imports
import BrandText from './BrandText';
import Icon from './Icon';

// consts
const CPF_MAX_LENGTH = 14;

// Component
const propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};

const defaultProps = {
  style: {},
};

class CPFField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
    };
  }

  _focus = (event) => {
    this.setState({ isFocused: true });
    this.props.input.onFocus(event);
  };

  _blur = (event) => {
    this.setState({ isFocused: false });
    this.props.input.onBlur(event);
  };

  render() {
    const { input, meta, textFieldRef, style, ...props } = this.props;
    const { error, touched } = meta;
    const inputValue = input.value ? input.value.toString() : '';
    const maxLengthReached = inputValue.length >= CPF_MAX_LENGTH;

    return (
      <View style={StyleSheet.flatten([styles.container, style || {}, this.state.isFocused ? styles.focus : {}])}>
        <TextInput
          {...props}
          style={styles.textInput}
          textFieldRef={ textFieldRef || null }
          onChangeText={input.onChange}
          onFocus={this._focus}
          onEndEditing={this._blur}
          value={input.value}
          maxLength={CPF_MAX_LENGTH}
          keyboardType="numeric"
          underlineColorAndroid="transparent"
          placeholder="000.000.000-00"
          placeholderTextColor="rgba(255,255,255,0.5)"
        />
        {((touched || maxLengthReached) && error) && (
          <View style={styles.messageContainer}>
            <Icon
              name="error-outline"
              style={styles.messageIcon}
            />
            <BrandText style={styles.messageText}>
              {error}
            </BrandText>
          </View>
        )}
      </View>
    );
  }
}

CPFField.propTypes = propTypes;
CPFField.defaultProps = defaultProps;

// Styles
const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    ...Platform.select({
      'ios': {
        borderRadius: 4,
      },
      'android': {
        borderRadius: 2,
      },
    }),
  },
  focus: {
    borderColor: 'white',
  },
  textInput: {
    flex: 1,
    padding: 0,
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    opacity: 0.5,
  },
  messageIcon: {
    width: 16,
    marginRight: 8,
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
  },
  messageText: {
    fontSize: 12,
    color: 'white',
  },
});

export default CPFField;
