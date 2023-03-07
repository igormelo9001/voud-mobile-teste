// NPM imports
import React from 'react';
import { pipe } from 'ramda';

import {
    Platform,
    StyleSheet,
    View,
    TextInput
} from 'react-native';

// VouD imports
import Icon from '../../../components/Icon';
import TouchableNative from '../../../components/TouchableNative';
import { colors } from '../../../styles';
import { appendIf } from '../../../utils/fp-util';
import VoudText from '../../../components/VoudText';
import VoudTouchableOpacity from '../../../components/TouchableOpacity';

// component
const ButtonField = ({
  onPress,
  icon,
  rightActionText,
  rightActionPress,
  rightIcon,
  align,
  style,
  buttonStyle,
  hasField,
  inputStyle,
  input,
  textFieldRef,
  ...props
}) => {
    const getButtonStyle = pipe(
      (baseStyle, complementaryStyle) => [baseStyle, complementaryStyle],
      appendIf(buttonStyle, buttonStyle), // append buttonStyle prop at the end, to override other styles
      StyleSheet.flatten
    );

    const renderIcon = () => {
      if (icon) {

        const getIconStyle = pipe(
          baseStyle => [baseStyle],
          StyleSheet.flatten
        );

        const iconName = Array.isArray(icon) ? (Platform.OS === 'ios' ? icon[0] : icon[1]) : icon;

        return (
          <Icon
            name={iconName}
            style={getIconStyle(styles.icon)}
          />
        );
      }
    };

    const renderRightTextAction = () => {
      if (rightActionText) {
        return (
          <VoudTouchableOpacity
            onPress={rightActionPress}
          >
            <VoudText style={styles.rightActionText}>
              {rightActionText}
            </VoudText>
          </VoudTouchableOpacity>
        );
      }
      if (rightIcon) {
        const getIconStyle = pipe(
          baseStyle => [baseStyle],
          StyleSheet.flatten
        );

        const iconName = Array.isArray(rightIcon) ? (Platform.OS === 'ios' ? rightIcon[0] : rightIcon[1]) : rightIcon;

        return (
          <TouchableNative 
            onPress={rightActionPress}
            borderless
            style={styles.iconWrapper}
          >
            <Icon
              name={iconName}
              style={getIconStyle(styles.icon)}
            />
          </TouchableNative>
        );
      }
    }

    const _onChangeText = (text) => {
      input.onChange(text);
    };

    return hasField ?
    (
      <View style={getButtonStyle(styles.button, styles.buttonFieldContainer)}>
        {renderIcon()}
        <View style={styles.textInput}>
          <TextInput
            allowFontScaling={false}
            {...props}
            ref={textFieldRef}
            style={inputStyle}
            onChangeText={_onChangeText}
          />
        </View>
        {renderRightTextAction()}
      </View>
    ) : (
      <View style={styles.buttonFieldContainer}>
        <TouchableNative
          borderless
          onPress={() => { onPress() }}
          style={getButtonStyle(styles.button)}
        >
          {renderIcon()}
          <VoudText
            style={styles.text}
            numberOfLines={1} ellipsizeMode={'tail'}
          >
            {/* Rotas, linhas ou pontos de recarga */}
            Para onde vamos?
          </VoudText>
        </TouchableNative>
      </View>
    );
}

export default ButtonField;

// styles
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 48,
    paddingLeft: 10,
    paddingHorizontal: 4,
    backgroundColor: 'white',
    borderRadius: 24
  },
  iconWrapper: {
    marginRight: 8,
    marginLeft: 4,
  },
  icon: {
    fontSize: 22,
    color: colors.BRAND_PRIMARY,
    alignSelf: 'center'
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: colors.GRAY,
  },
  textInput: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    marginRight: 16
  },
  buttonFieldContainer: {
    borderRadius: 24,
    height: 48,
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 4,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOpacity: 1,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    ...Platform.select({
      android: {
        elevation: 4
      }
    })
  },
  rightActionText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'right',
    color: colors.BRAND_PRIMARY_DARKER,
  },
});
