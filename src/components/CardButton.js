// NPM imports
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// VouD imports
import Icon from './Icon';
import TouchableOpacity from './TouchableOpacity';
import { colors } from './../styles';
import VoudText from './VoudText';

// Component
const propTypes = {
  text: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  isNew: PropTypes.bool,
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

const defaultProps = {
  isNew: false,
  onPress: () => { },
  style: {},
};

class CardButton extends React.Component {
  _getBorderGradient = () => {
    const { isUnlogged } = this.props;
    return (
      isUnlogged
        ? [colors.BRAND_PRIMARY_DARKER, 'white']
        : [colors.BRAND_PRIMARY_DARKER, colors.BRAND_PRIMARY_LIGHTER]
    )
  }

  _getIconStyle = () => {
    const { availableUnlogged, isUnlogged } = this.props;
    if (isUnlogged) return (
      StyleSheet.flatten([
        styles.icon,
        {
          color: colors.BRAND_PRIMARY_DARKER
        }
      ])
    )
    return (
      StyleSheet.flatten(
        availableUnlogged
          ? [styles.icon, { color: '#FDC228' }]
          : [styles.icon, { color: colors.BRAND_PRIMARY }]
      )
    );
  }

  _getTextStyle = () => {
    const { availableUnlogged, isUnlogged } = this.props;
    if (isUnlogged) return (
      StyleSheet.flatten([
        styles.text,
        {
          fontWeight: 'bold',
        }
      ])
    )
    return (
      StyleSheet.flatten(
        availableUnlogged
          ? [styles.text, { color: 'white' }]
          : [styles.text, { color: colors.BRAND_PRIMARY_DARKER }]
      )
    );
  }

  _getContainerStyle = () => {
    const { availableUnlogged, isUnlogged, style } = this.props;
    if(!isUnlogged && !availableUnlogged) {
      return ({
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        width: 90,
        height: 84,
        borderRadius: 4,
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: {
          height: 2,
          width: 0,
        },
        elevation: 1,
      });
    }
    if(!isUnlogged) {
      return (
        StyleSheet.flatten([
          styles.container,
          style,
          { borderRadius: 4 },
          availableUnlogged ? { height: 82 } : {},
        ])
      )
    }
    if(availableUnlogged) {
      return (
        StyleSheet.flatten([
          styles.container,
          style,
          { height: 82 },
        ])
      )
    }
    return (
      StyleSheet.flatten([
        styles.container,
        style,
        { borderRadius: 4 },
      ])
    )
  }

  _getContentStyle = () => {
    const { isUnlogged, availableOffline } = this.props;
    return (
      StyleSheet.flatten(
        (isUnlogged || availableOffline)
          ? [styles.content, { backgroundColor: 'transparent' }]
          : [styles.content, { backgroundColor: 'white' }]
      )
    )
  }

  _renderNew = () => {
    const { isNew, isUnlogged } = this.props;
    return (
      isNew && (
        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          colors={
            isUnlogged
            ? ['rgba(243, 146, 0, 0.3)', 'rgba(253, 195, 0, 0.3)']
            : [colors.BRAND_SECONDARY_DARKER, colors.BRAND_SECONDARY]
          }
          style={styles.new}
        >
          <VoudText style={styles.newText}>NOVO</VoudText>
        </LinearGradient>
      )
    )
  }

  _renderContent = () => {
    const {
      isUnlogged,
      availableUnlogged,
      iconName,
      text,
    } = this.props;
    if (availableUnlogged) {
      return (
        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          colors={[colors.BRAND_PRIMARY_LIGHT, colors.BRAND_PRIMARY_LIGHTER]}
          style={this._getContentStyle()}
        >
          <Icon
            name={iconName}
            style={this._getIconStyle()}
          />
          {this._renderNew()}
          <VoudText style={this._getTextStyle()}>
            {text}
          </VoudText>
        </LinearGradient>
      )
    }
    if (isUnlogged) {
      return (
        <View>
          <LinearGradient
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            colors={['rgba(83,32,115,1)', 'rgba(162,73,148,1)']}
            style={{borderRadius: 4}}
          >
            <LinearGradient
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              colors={['rgba(140,54,140,0.3)', 'rgba(168,77,151,0.3)']}
              style={this._getContentStyle()}
            >
              <Icon
                name={iconName}
                style={this._getIconStyle()}
              />  
              {this._renderNew()}
              <VoudText style={this._getTextStyle()}>{text}</VoudText>
            </LinearGradient>
          </LinearGradient>

        </View>
      )
    }
    return (
      <LinearGradient
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        colors={[colors.BRAND_PRIMARY_DARKER, 'white']}
        style={styles.normalGradient}
      >
        <View style={styles.normalContent}>
          <Icon
            name={iconName}
            style={styles.icon}
          />
          {this._renderNew()}
          <VoudText style={styles.normalText}>{text}</VoudText>
        </View>
      </LinearGradient>
    )
  }

  render() {
    const {
      onPress,
    } = this.props;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={this._getContainerStyle()}
      >
        {this._renderContent()}
      </TouchableOpacity>
    );
  }
}

CardButton.propTypes = propTypes;
CardButton.defaultProps = defaultProps;

// styles
const styles = StyleSheet.create({
  normalGradient: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: 84,
    borderRadius: 4,
  },
  normalContent: {
    justifyContent: 'space-between',
    width: 88,
    height: 82,
    padding: 8,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  normalText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: 'bold',
    color: colors.BRAND_PRIMARY_DARKER,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 88,
    height: 82,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    elevation: 1,
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: 84,
    borderRadius: 4,
  },
  content: {
    justifyContent: 'space-between',
    width: 88,
    height: 82,
    padding: 8,
    borderRadius: 4,
  },
  icon: {
    fontSize: 24,
    color: colors.BRAND_PRIMARY,
  },
  text: {
    fontSize: 10,
    lineHeight: 14,
    color: colors.BRAND_PRIMARY_DARKER,
  },
  new: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    borderRadius: 2,
  },
  newText: {
    fontSize: 8,
    color: 'white',
  },
});

export default CardButton;
