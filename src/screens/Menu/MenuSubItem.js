// NPM imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

// VouD imports
import BrandText from '../../components/BrandText';
import NotificationBadge from '../../components/NotificationBadge';
import TouchableNative from '../../components/TouchableNative';
import { colors } from '../../styles';
import { getLogoSmForLayoutType, isTransportCardScholarNotRevalidated } from '../../utils/transport-card';
import { transportCardTypes } from '../../redux/transport-card';
import BlockTag from '../../components/TransportCard/BlockTag';

// Component
const propTypes = {
  text: PropTypes.string.isRequired,
  badge: PropTypes.number,
  actionText: PropTypes.string,
  onPress: PropTypes.func,
  cardType: PropTypes.string,
};

const defaultProps = {
  badge: 0,
  actionText: '',
  onPress: null,
  cardType: '',
};

class MenuSubItem extends Component {
  render() {
    const { text, badge, actionText, onPress, cardData } = this.props;
    const cardType = cardData ? cardData.layoutType : '';
    const showBlockTag = cardData ? isTransportCardScholarNotRevalidated(cardData) : false;
    const MenuSubItemContainer = showBlockTag ? View : TouchableNative;

    return (
      <MenuSubItemContainer
        onPress={showBlockTag ? null : onPress}
        style={styles.container}
      >
        {!!cardType && (
          <View style={styles.card}>
            <Image
              source={getLogoSmForLayoutType(cardType)}
              style={cardType === transportCardTypes.BU ? styles.buImg : styles.bomImg}
            />
          </View>
        )}
        <BrandText style={styles.text}>
          {text}
        </BrandText>
        {
          actionText ?
            <BrandText style={styles.actionText}>
              {actionText}
            </BrandText> :
            (badge && +badge > 0 ? <NotificationBadge count={badge} /> : null)
        }
        {
          showBlockTag && (
            <BlockTag 
              circle
              cardData={cardData}
            />
          )
        }
      </MenuSubItemContainer>
    );
  }
}

MenuSubItem.propTypes = propTypes;
MenuSubItem.defaultProps = defaultProps;

// styles
const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 16
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 20,
    borderRadius: 1,
    marginRight: 16,
    backgroundColor: 'white',
  },
  bomImg: {
    width: 20,
    height: 9,
  },
  buImg: {
    width: 16,
    height: 16,
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: 'white'
  },
  actionText: {
    fontSize: 12,
    color: colors.BRAND_SECONDARY
  },
});

export default MenuSubItem;
