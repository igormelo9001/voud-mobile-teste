import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import VoudTouchableOpacity from '../../../components/TouchableOpacity';
import Icon from '../../../components/Icon';
import BrandText from '../../../components/BrandText';
import { colors } from '../../../styles';

class BounceLink extends Component {
  render() {
    return (
      <VoudTouchableOpacity 
        {...this.props}
        style={StyleSheet.flatten([styles.docLinkContainer, this.props.style])}
      >
        <Icon 
          style={styles.docLinkIcon}
          name="open-in-new"
        />
        <BrandText style={styles.docLinkText}>{this.props.children}</BrandText>
      </VoudTouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  docLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  docLinkIcon: {
    fontSize: 24,
    lineHeight: 24,
    color: colors.BRAND_SECONDARY,
    marginRight: 8,
  },
  docLinkText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.BRAND_SECONDARY,
  },
});

export default BounceLink;
