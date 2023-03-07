// NPM imports
import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

// VouD imports
import BrandText from '../../../components/BrandText';
import { colors } from '../../../styles';

// Module imports
import IconWithConnector from './IconWithConnector';

// Component
const propTypes = {
  originText: PropTypes.string.isRequired,
  destinationText: PropTypes.string.isRequired,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

const defaultProps = {
  style: {},
};

class OriginDestination extends React.Component {
  render() {
    const { originText, destinationText, style } = this.props;

    return (
      <View style={style}>
        <View style={styles.place}>
          <IconWithConnector
            iconName="pin"
            style={styles.connectorIcon}
            iconStyle={styles.icon}
          />
          <BrandText style={styles.text}>{originText}</BrandText>
        </View>
        <View style={styles.place}>
          <IconWithConnector
            iconName="pin-drop"
            isDestination
            style={styles.connectorIcon}
            iconStyle={styles.icon}
          />
          <BrandText style={styles.text}>{destinationText}</BrandText>
        </View>
      </View>
    );
  }
}

OriginDestination.propTypes = propTypes;
OriginDestination.defaultProps = defaultProps;

const styles = StyleSheet.create({
  place: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  connectorIcon: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    color: colors.BRAND_PRIMARY_LIGHTER,
  },
  text: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 14,
    lineHeight: 16,
    color: colors.GRAY,
  },
});

export default OriginDestination;
