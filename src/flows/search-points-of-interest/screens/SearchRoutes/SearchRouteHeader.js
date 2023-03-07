// NPM imports
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

// VouD imports
import Icon from '../../../../components/Icon';
import VoudText from '../../../../components/VoudText';
import { colors } from '../../../../styles';
import SearchFormDottedLine from '../../components/SearchFormDottedLine';
import VoudTouchableOpacity from '../../../../components/TouchableOpacity';


// Component
class SearchRouteHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      style,
      origin,
      destination,
      onOriginClear,
      onDestinationClear,
      onOriginEdit,
      onDestinationEdit,
    } = this.props;

    return (
      <View style={styles.content}>
        <View style={styles.wrapper}>
          <View style={styles.wrapperPins}>
            <Icon
              name="md-radio-button-on"
              style={styles.pinIcon}
            />
            <SearchFormDottedLine 
              style={styles.dottedLine}
              startOnMount
            />
            <Icon
              name="pin"
              style={styles.pinIcon}
            />
          </View>
          <View style={styles.wrapperFields}>
            <View style={styles.originField}>
              <VoudTouchableOpacity
                style={styles.userLocationButton}
                onPress={onOriginEdit}
              >
                <VoudText
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                >
                  <VoudText style={styles.locationTextBold}>
                    Sua localização
                  </VoudText>
                  <VoudText style={styles.locationText}>
                    {` (${origin})`}
                  </VoudText>
                </VoudText>
              </VoudTouchableOpacity>
              <VoudTouchableOpacity
                onPress={onOriginClear}
              >
                {/* <VoudText style={styles.cleanText}>
                  LIMPAR
                </VoudText> */}
                <Icon
                 name="close" 
                 style={styles.closeIcon}
                />
              </VoudTouchableOpacity>
            </View>
            <View style={styles.destinationField}>
              <VoudTouchableOpacity
                style={styles.userLocationButton}
                onPress={onDestinationEdit}
              >
                <VoudText
                  style={styles.locationTextBold}
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                >
                  {destination}
                </VoudText>
              </VoudTouchableOpacity>
              <VoudTouchableOpacity
                onPress={onDestinationClear}
              >
                {/* <VoudText style={styles.cleanText}>
                  LIMPAR
                </VoudText> */}
                <Icon
                 name="close" 
                 style={styles.closeIcon}
                />
              </VoudTouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

// styles
const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    elevation: 4,
  },
  cleanText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'right',
    color: colors.BRAND_PRIMARY_DARKER,
  },
  wrapper: {
    flexDirection: 'row',
  },
  userLocationButton: {
    flex: 1,
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    color: colors.GRAY,
  },
  locationTextBold: {
    fontSize: 14,
    color: colors.BRAND_PRIMARY_DARKER,
  },
  wrapperPins: {
    width: 24,
    height: 72,
    alignItems: 'center',
    flexDirection: 'column',
    marginRight: 8
  },
  pinIcon: {
    fontSize: 20,
    color: colors.BRAND_PRIMARY
  },
  wrapperFields: {
    flex: 1,
    height: 72,
    flexDirection: 'column',
    alignItems: 'center',
  },
  originField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 36,
  },
  destinationField: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dottedLine: {
    marginTop: 5,
  },
  closeIcon: {
    fontSize: 20,
    color: colors.BRAND_PRIMARY
  },
});

export default SearchRouteHeader;
