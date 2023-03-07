// NPM imports
import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, View } from 'react-native';

// VouD imports
import BrandText from '../../../components/BrandText';
import SystemText from '../../../components/SystemText';
import TouchableNative from '../../../components/TouchableNative';
import { colors } from '../../../styles';

// Component

const propTypes = {
  data: PropTypes.shape({}).isRequired,
  imageUri: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

const defaultProps = {
  imageUri: '',
  style: {},
};

class EstimateItem extends React.Component {
  render() {
    const { data, imageUri, onPress, style } = this.props;
    const { product, estimate, promotion, time } = data;
    
    return (
      <TouchableNative
        onPress={onPress}
        style={StyleSheet.flatten([styles.container, style])}
      >
        <Image
          source={{ uri: imageUri }}
          style={styles.serviceLogo}
        />
        <View style={styles.main}>
          <SystemText style={styles.serviceNameText}>
            {product}
          </SystemText>
          <SystemText style={styles.timeText}>Chega em {Math.round(time/60)} min.</SystemText>
          {promotion && (
            <View style={styles.promoCode}>
              <SystemText
                numberOfLines={1}
                style={styles.promoCodeText}
              >
                {promotion.name}
              </SystemText>
            </View>
          )}
        </View>
        <View style={styles.valueAction}>
          <View style={styles.valueDiscount}>
            <SystemText style={styles.valueText}>{estimate}</SystemText>
            {promotion && (
              <View style={styles.discount}>
                <SystemText style={styles.discountText}>
                  -{promotion.discount}%
                </SystemText>
              </View>
            )}
          </View>
          <View style={styles.callToAction}>
            <BrandText style={styles.callToActionText}>CHAMAR AGORA</BrandText>
          </View>
        </View>
      </TouchableNative>
    );
  }
}

EstimateItem.propTypes = propTypes;
EstimateItem.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceLogo: {
    width: 32,
    height: 32,
    borderRadius: 4,
  },
  main: {
    flex: 1,
    alignItems: 'flex-start',
    marginHorizontal: 8,
  },
  serviceNameText: {
    fontSize: 16,
    lineHeight: 20,
    color: colors.GRAY_DARKER,
  },
  timeText: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 16,
    color: colors.GRAY,
  },
  promoCode: {
    padding: 4,
    borderRadius: 5,
    marginTop: 6,
    backgroundColor: colors.BRAND_PRIMARY_LIGHTER,
  },
  promoCodeText: {
    fontSize: 12,
    lineHeight: 14,
    color: 'white',
  },
  valueAction: {
    flex: 1,
    alignItems: 'stretch',
  },
  valueDiscount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  valueText: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    color: colors.GRAY_DARKER,
  },
  discount: {
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: colors.GRAY_LIGHT,
    marginLeft: 8,
  },
  discountText: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.GRAY,
  },
  callToAction: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.BRAND_PRIMARY_LIGHTER,
  },
  callToActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.BRAND_PRIMARY,
  },
});

export default EstimateItem;
