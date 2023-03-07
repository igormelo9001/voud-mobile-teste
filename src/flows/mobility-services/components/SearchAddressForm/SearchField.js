// NPM imports
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

// VouD imports
import Icon from '../../../../components/Icon';
import TouchableNative from '../../../../components/TouchableNative';
import { colors } from '../../../../styles';
import VoudTextField from '../../../../components/TextField';

// Component
const propTypes = {
  isOrigin: PropTypes.bool,
  onMyLocationPress: PropTypes.func,
};

const defaultProps = {
  isOrigin: false,
  onMyLocationPress: () => {},
};

class SearchField extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { isOrigin, onMyLocationPress, style, ...props } = this.props;

    return (
      <View style={StyleSheet.flatten([styles.container, style, isOrigin ? styles.noPaddingRight : {}])}>
        <Icon
          name={isOrigin ? 'pin' : 'pin-drop'}
          style={styles.icon}
        />
        <VoudTextField
          {...props}
          label={isOrigin ? 'Qual é o seu local de partida?' : 'E o seu destino?'}
          style={styles.field}
        />
        {isOrigin && (
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
        )}
      </View>
    );
  }
}

SearchField.propTypes = propTypes;
SearchField.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
    fontSize: 24,
    color: colors.GRAY_LIGHT,
  },
  field: {
    flex: 1,
  },
  myLocation: {
    padding: 16,
  },
  myLocationIcon: {
    fontSize: 24,
    color: colors.BRAND_PRIMARY,
  },
  noPaddingRight: {
    paddingRight: 0,
  }
});

export default SearchField;
