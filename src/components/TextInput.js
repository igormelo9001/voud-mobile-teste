// NPM imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  TextInput,
  View
} from 'react-native';

// VouD imports
import SystemText from './SystemText';

// Component
const propTypes = {
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

const defaultProps = {
  onFocus: () => {},
  onBlur: () => {},
};

class VoudTextInput extends Component {

  constructor(props) {
    super(props);

    this._floatValue = new Animated.Value(props.value !== '' || props.fixedValue ? 1 : 0); // 1 is floating
    this._focusValue = new Animated.Value(0); // 1 is focused

    this._floatingLabelTop = this._floatValue.interpolate({
      inputRange: [0, 1],
      outputRange: [22, 0]
    });

    this._floatingLabelFontSize = this._floatValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12]
    });

    this._color = this._focusValue.interpolate({
      inputRange: [0, 1],
      outputRange: [props.baseColor, props.tintColor]
    });

    this.state = { hasFocus: false };
    this._textInputRef = null;
  }

  componentDidUpdate() {
    if (this.props.value !== '')
      this._animFloatIn();
  }

  _handleFocus = (ev) => {
    this._animFloatIn();

    Animated.timing(this._focusValue, {
      toValue: 1,
      duration: 250
    }).start();

    this.setState({ hasFocus: true });
    this.props.onFocus(ev);
  };

  _blur = (ev) => {
    if (this.props.value === '' && !this.props.fixedValue)
      this._animFloatOut();

    Animated.timing(this._focusValue, {
      toValue: 0,
      duration: 250
    }).start();

    this.setState({ hasFocus: false });
    this.props.onBlur(ev);
  };

  _animFloatIn = () => {
    Animated.timing(this._floatValue, {
      toValue: 1,
      duration: 250
    }).start();
  };

  _animFloatOut = () => {
    Animated.timing(this._floatValue, {
      toValue: 0,
      duration: 250
    }).start();
  };

  _getFixedValueStyles = () => {
    const { textColor, largeField } = this.props;
    let fixedValueStyles = [styles.textInput, { color: textColor }];
    if (largeField) fixedValueStyles.push(styles.largeField);
    return StyleSheet.flatten([fixedValueStyles, { flex: 0 }]);
  }

  _getInputWithFixedValueStyles = () => {
    const { textColor, largeField } = this.props;
    let inputStyles = [styles.textInput, styles.fixedValue, { color: textColor }];
    if (largeField) inputStyles.push(styles.largeField);
    return StyleSheet.flatten([inputStyles]);
  }

  _getInputStyles = () => {
    const { textColor, largeField } = this.props;
    let inputStyles = [styles.textInput, { color: textColor }];
    if (largeField) inputStyles.push(styles.largeField);
    return StyleSheet.flatten(inputStyles);
  }

  _getContainerStyles = () => {
    const { style, largeField, multiline, numberOfLines } = this.props;
    let containerStyles = [styles.container, style];
    if (largeField) containerStyles.push(styles.largeContainer);

    // container height
    if (multiline && numberOfLines && numberOfLines > 1) {
      const h = largeField ? 96 : 72;
      const lineH = largeField ? 32 * 1.2 : 16 * 1.2;
      containerStyles.push({ height: h + (lineH * (numberOfLines - 1)) });
    }

    return StyleSheet.flatten(containerStyles);
  }

  _getFloatingLabelStyles = () => {
    const { hasFocus } = this.state;
    const { largeField } = this.props;

    const inputIsFocusedOrHasValue = hasFocus || (this.props.value && this.props.value.length > 0);
    const largeFieldLabelStyle = inputIsFocusedOrHasValue ? styles.floatingLabelLargeFocused : styles.floatingLabelLarge

    const floatingLabelStyle = largeField ? largeFieldLabelStyle : styles.floatingLabel

    const floatingLabelAnimStyle = {
      color: this._color,
      fontSize: this._floatingLabelFontSize,
      transform: [
        { translateY: this._floatingLabelTop }
      ]
    };

    return StyleSheet.flatten([
      floatingLabelStyle,
      floatingLabelAnimStyle,
    ]);
  }

  _focus = () => {
    if (this._textInputRef) this._textInputRef.focus();
  }

  _renderInput = () => {
    const { textFieldRef, textColor, baseColor, fixedValue, right, placeholder, underlineColorAndroid, ...props } = this.props;
    const { hasFocus } = this.state;

    if (fixedValue)
      return (
        <View style={styles.textInputContainer}>
          <View 
            style={styles.fixedValueContainer}
          >
            <SystemText 
              style={this._getFixedValueStyles()} 
              onPress={this._focus}
            >
              {fixedValue}
            </SystemText>
          </View>
          <TextInput
            {...props}
            ref={(ref) => { 
              this._textInputRef = ref;
              if (textFieldRef) textFieldRef(ref);
            }}
            style={this._getInputWithFixedValueStyles()}
            selectionColor={textColor}
            underlineColorAndroid={underlineColorAndroid? underlineColorAndroid :  'transparent'}
            onFocus={this._handleFocus}
            onEndEditing={this._blur}
            placeholder={placeholder}
            placeholderTextColor={baseColor}
          />
          {right && right()}
        </View>
      );

    return (
      <View style={styles.textInputContainer}>
        <TextInput
          {...props}
          ref={(ref) => { 
            this._textInputRef = ref;
            if (textFieldRef) textFieldRef(ref);
          }}
          style={this._getInputStyles()}
          underlineColorAndroid={underlineColorAndroid? underlineColorAndroid :  'transparent'}
          onFocus={this._handleFocus}
          onEndEditing={this._blur}
          placeholder={hasFocus ? placeholder : null}
          placeholderTextColor={baseColor}
        />
        {right && right()}
      </View>
    )
  }

  render() {
    const { baseColor, tintColor, label } = this.props;

    const underlineAnimStyle = {
      transform: [
        { scaleX: this._focusValue }
      ],
      opacity: this._focusValue,
      backgroundColor: tintColor
    };

    return (
      <View style={this._getContainerStyles()}>
        <SystemText
          style={this._getFloatingLabelStyles()}
          numberOfLines={1}
        >
          {label}
        </SystemText>
        {this._renderInput()}
        <View style={styles.underlineContainer}>
          <View style={StyleSheet.flatten([styles.baseUnderline, { backgroundColor: baseColor }])} />
          <Animated.View style={StyleSheet.flatten([styles.tintUnderline, underlineAnimStyle])} />
        </View>
      </View>
    );
  }
}

VoudTextInput.propTypes = propTypes;
VoudTextInput.defaultProps = defaultProps;

// Styles
const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    height: 72,
    paddingTop: 32,
    paddingBottom: 12,
  },
  largeContainer: {
    height: 96
  },
  floatingLabel: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0
  },
  floatingLabelLargeFocused: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0
  },
  floatingLabelLarge: {
    position: 'absolute',
    top: 36,
    left: 0,
    right: 0
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  textInput: {
    flex: 1,
    alignSelf: 'stretch',
    padding: 0,
    fontSize: 16,
    // lineHeight: Platform.OS === 'ios' ? 27 : 28 // apparently, lineHeight isn't working for textInputs
  },
  fixedValueContainer: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingRight: 4,
    opacity: 0.8,
  },
  underlineContainer: {
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    height: 2
  },
  baseUnderline: {
    height: 1
  },
  tintUnderline: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  largeField: {
    fontSize: 32,
    // lineHeight: 40, // apparently, lineHeight isn't working for textInputs
    marginTop: 8
  }
});

export default VoudTextInput;