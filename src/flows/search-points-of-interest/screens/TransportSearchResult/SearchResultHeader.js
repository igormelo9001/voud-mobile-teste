// NPM imports
import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// VouD imports
import TouchableOpacity from '../../../../components/TouchableOpacity';
import { colors } from '../../../../styles';

// Group imports
import ButtonIcon from '../../../../flows/home/components/ButtonIcon';
import VoudText from '../../../../components/VoudText';
import TouchableNative from '../../../../components/TouchableNative';

import Icon from '../../../../components/Icon';


// Component
const propTypes = {
  onBack: PropTypes.func,
  onClear: PropTypes.func,
  searchText: PropTypes.string,
};

const defaultProps = {
  searchText: '',
  onBack: () => {},
  onClear: () => {},
};

class SearchResultHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { searchText, onBack, onEdit, onClear } = this.props;
    return (
      <View 
        style={styles.container}
        pointerEvents="box-none"
      >
        <LinearGradient
          colors={[ 'rgba(110, 62, 145, 1)', 'rgba(0, 0, 0, 0)' ]}
          style={styles.linearGradient}
          pointerEvents="none"
        />
        <View style={styles.wrapper}>
          <ButtonIcon
            onPress={onBack}
            icon="md-arrow-back"
          />
          <TouchableNative 
            style={styles.field}
            onPress={onEdit}
          >
            <VoudText 
              style={styles.fieldText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {searchText}
            </VoudText>
            <TouchableOpacity
              onPress={onClear}
              style={styles.rightAction}
            >
                <Icon
                 name="close" 
                 style={styles.closeIcon}/>
            </TouchableOpacity>
          </TouchableNative>
        </View>
      </View>
    );
  }
}

SearchResultHeader.propTypes = propTypes;
SearchResultHeader.defaultProps = defaultProps;

// Styles
const styles = StyleSheet.create({
  container: {
    height: 140,
    position: 'absolute',
    width: '100%'
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 56,
    paddingHorizontal: 16,
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: 140
  },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    padding: 16,
    marginLeft: 8,
    borderRadius: 28,
    backgroundColor: 'white',
    ...Platform.select({
      android: {
        elevation: 4
      },
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOpacity: 1,
        shadowRadius: 2,
        shadowOffset: {
          height: 1,
          width: 0,
        },
      },
    })
  },
  fieldText: {
    flex: 1,
    fontSize: 12,
    color: colors.GRAY,
  },
  rightAction: {
    paddingLeft: 16,
  },
  rightActionText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'right',
    color: colors.BRAND_PRIMARY_DARKER,
  },
  closeIcon: {
    fontSize: 20,
    color: colors.BRAND_PRIMARY
  },
})

export default SearchResultHeader;