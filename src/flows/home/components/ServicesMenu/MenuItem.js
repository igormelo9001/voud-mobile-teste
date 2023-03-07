import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

// Components
import Icon from '../../../../components/Icon';
import VoudText from '../../../../components/VoudText';
import LinearGradient from 'react-native-linear-gradient';
import TouchableNative from '../../../../components/TouchableNative';

// util
import { colors } from '../../../../styles';

class MenuItem extends Component {
  render() {
    const {
      name,
      icon,
      isNew,
      onPress,
    } = this.props;

    return (
      <TouchableNative
        key={name}
        style={styles.buttonContainer}
        onPress={onPress}
      >
        <LinearGradient
          colors={[colors.BRAND_PRIMARY_DARKER, 'white']}
          style={styles.buttonBorder}
          start={{ x: 0, y: 1 }}
          end={{ x: 1.2, y: 0 }}
        >
          <View style={styles.buttonBody}>
            <View style={styles.iconContainer}>
              <Icon size={24} name={icon} />
              {
                isNew &&
                <LinearGradient
                  style={styles.newItemLabel}
                  colors={[colors.BRAND_SECONDARY_DARKER, colors.CARD_E]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                >
                  <VoudText style={styles.newItemLabelText}>NOVO</VoudText>
                </LinearGradient>
              }
            </View>
            <VoudText style={styles.buttonText}>{name}</VoudText>
          </View>
        </LinearGradient>
      </TouchableNative>
    );
  }
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  newItemLabel: {
    borderRadius: 2,
    width: 32,
    height: 16,
  },
  newItemLabelText: {
    flex: 1,
    fontSize: 8,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    lineHeight: 16,
  },

  buttonContainer: {
    width: 90,
    height: 84,
    marginRight: 8,
    shadowColor: 'rgba(0, 0, 0, 0.30)',
    shadowOpacity: 0.30,
    shadowRadius: 4,
    shadowOffset: {
      height: 1,
      width: 1,
    },

    elevation: 2,
  },
  buttonBorder: {
    padding: 1,
    borderRadius: 4,
  },
  buttonBody: {
    backgroundColor: 'white',
    borderRadius: 4,
    height: '100%',
    padding: 8,
    justifyContent: "space-between",
  },
  buttonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.BRAND_PRIMARY,
  }
})

MenuItem.propTypes = {};
MenuItem.defaultProps = {};

export default MenuItem;
