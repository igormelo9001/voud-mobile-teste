// NPM imports
import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

// VouD imports
import TouchableNative from '../../../components/TouchableNative';
import SystemText from '../../../components/SystemText';
import Icon from '../../../components/Icon';
import { colors } from '../../../styles';

// Module imports
import IconWithConnector from './IconWithConnector';

// Component
const propTypes = {
  origin: PropTypes.object.isRequired,
  destination: PropTypes.object.isRequired,
  onOriginPress: PropTypes.func.isRequired,
  onDestinationPress: PropTypes.func.isRequired,
  onMyLocationPress: PropTypes.func.isRequired,
  onChangeDirection: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

const defaultProps = {
  style: {},
};

class OriginDestinationSearch extends React.Component {
  renderPlaceholder = (placeholderText) => (
    <View style={styles.placeholder}>
      <SystemText style={styles.placeholderText}>
        {placeholderText}
      </SystemText>
    </View>
  );

  renderMain = (formatedAddress) => (
    <View style={styles.mainInfo}>
      <SystemText
        numberOfLines={2}
        style={styles.mainInfoText}
      >
        {formatedAddress}
      </SystemText>
    </View>
  );

  renderOrigin = () => {
    const { origin, onOriginPress, onMyLocationPress } = this.props;
    return (
      <TouchableNative
        onPress={onOriginPress}
        style={StyleSheet.flatten([styles.place, styles.noPaddingRight])}
      >
        <IconWithConnector
          iconName="pin"
          style={styles.connectorIcon}
          iconStyle={{ color: origin.name ? colors.BRAND_PRIMARY_LIGHTER : colors.GRAY_LIGHT }}
        />
        {origin.name ?
          this.renderMain(origin.formatted_address) :
          this.renderPlaceholder('Qual é o seu local de partida?')
        }
        <TouchableNative
          borderless
          onPress={onMyLocationPress}
          style={styles.myLocation}
        >
          <Icon
            name="my-location"
            style={styles.myLocationIcon}
          />
        </TouchableNative>
      </TouchableNative>
    );
  };

  renderDestination = () => {
    const { destination, onDestinationPress } = this.props;
    return (
      <TouchableNative
        onPress={onDestinationPress}
        style={styles.place}
      >
        <IconWithConnector
          iconName="pin-drop"
          isDestination
          style={styles.connectorIcon}
          iconStyle={{ color: destination.name ? colors.BRAND_PRIMARY_LIGHTER : colors.GRAY_LIGHT }}
        />
        {destination.name ?
          this.renderMain(destination.formatted_address) :
          this.renderPlaceholder('E o seu destino?')
        }
        <View style={styles.myLocationPlaceholder} />
      </TouchableNative>
    );
  };

  render() {
    const { origin, destination, onChangeDirection, style } = this.props;

    const canChangeDirection = origin.name || destination.name;

    return (
      <View style={style}>
        {this.renderOrigin()}
        {this.renderDestination()}
        <View style={styles.changeDirection}>
          <TouchableNative
            borderless
            onPress={() => {
              if (canChangeDirection) onChangeDirection();
            }}
          >
            <Icon
              name="change-direction"
              style={StyleSheet.flatten([
                styles.changeDirectionIcon,
                canChangeDirection ? {} : { color: colors.GRAY_LIGHT },
              ])}
            />
          </TouchableNative>
        </View>
      </View>
    );
  }
}

OriginDestinationSearch.propTypes = propTypes;
OriginDestinationSearch.defaultProps = defaultProps;

const styles = StyleSheet.create({
  place: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 100,
    paddingHorizontal: 16,
  },
  connectorIcon: {
    alignSelf: 'stretch',
    marginRight: 16,
  },
  placeholder: {
    flex: 1,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: colors.GRAY_LIGHT,
    marginVertical: 16,
  },
  placeholderText: {
    fontSize: 16,
    lineHeight: 20,
    color: colors.GRAY,
  },
  mainInfo: {
    flex: 1,
    marginVertical: 16,
  },
  mainInfoText: {
    fontSize: 16,
    lineHeight: 20,
    color: colors.GRAY_DARKER,
  },
  mainInfoSecondaryText: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 16,
    color: colors.GRAY,
  },
  myLocation: {
    padding: 16,
  },
  myLocationIcon: {
    fontSize: 24,
    lineHeight: 24,
    color: colors.BRAND_PRIMARY,
  },
  myLocationPlaceholder: {
    width: 24,
    marginLeft: 16,
  },
  changeDirection: {
    position: 'absolute',
    top: '50%',
    left: 16,
    width: 24,
    height: 24,
    marginTop: -12,
    backgroundColor: 'white',
  },
  changeDirectionIcon: {
    fontSize: 24,
    lineHeight: 24,
    color: colors.BRAND_PRIMARY,
  },
  noPaddingRight: {
    paddingRight: 0
  }
});

export default OriginDestinationSearch;
