// NPM imports
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { pipe, append } from 'ramda';

// VouD imports
import BrandText from '../BrandText';
import SystemText from '../SystemText';
import { colors } from '../../styles';
import { formatBomCardNumber } from '../../utils/parsers-formaters';
import { getColorForLayoutType } from '../../utils/transport-card';
import { transportCardTypes } from '../../redux/transport-card';

import { appendIf } from '../../utils/fp-util';

// component
class TransportCardHeader extends Component {

  _getHeaderStyle = () => {
    const { data, small } = this.props;

    return pipe(
      () => [styles.header],
      append({ borderBottomColor: getColorForLayoutType(data.layoutType) }),
      appendIf(styles.headerSmall, small),
      StyleSheet.flatten,
    )();
  };

  _getCardNickStyle = () => {
    const { data, small } = this.props;
    const isBu = data && data.layoutType === transportCardTypes.BU;

    return pipe(
      () => [styles.headerText],
      append(isBu ? { color: getColorForLayoutType(data.layoutType) } : {}),
      appendIf(styles.headerTextSmall, small),
      StyleSheet.flatten,
    )();
  }

  render() {
    const { data } = this.props;
    const isBu = data && data.layoutType === transportCardTypes.BU;

    return (
      <View style={styles.container}>
        <View style={StyleSheet.flatten([styles.cardStrip, { backgroundColor: isBu ? 'white' : getColorForLayoutType(data.layoutType) }])} />
        <View style={this._getHeaderStyle()}>
          <BrandText
            style={this._getCardNickStyle()}
            numberOfLines={2}
            ellipsizeMode={'tail'}
          >
            {data.nick}
          </BrandText>
          <SystemText style={styles.cardNumber}>
            {isBu ? data.cardNumber : formatBomCardNumber(data.cardNumber)}
          </SystemText>
        </View>
      </View>
    );
  }
}

// styles
const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch'
  },
  cardStrip: {
    height: 4,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    backgroundColor: 'white'
  },
  headerSmall: {
    height: 34,
    paddingHorizontal: 10,
  },
  headerText: {
    flex: 1,
    paddingRight: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.GRAY_DARKER
  },
  headerTextSmall: {
    fontSize: 14,
    color: colors.GRAY_DARKER,
  },
  cardNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.GRAY_DARKER
  },
});

export default TransportCardHeader;
