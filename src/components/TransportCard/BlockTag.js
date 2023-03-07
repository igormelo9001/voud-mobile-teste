import React, { Component } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';

import { colors } from '../../styles';
import TouchableNative from '../TouchableNative';
import BrandText from '../BrandText';
import Icon from '../Icon';
import { fetchRemoveCard } from '../../redux/transport-card';
import { openUrl } from '../../utils/open-url';
import { closeMenu } from '../../redux/menu';
import { isTransportCardScholarNotRevalidated } from '../../utils/transport-card';

class BlockTag extends Component {

  _removeCard = () => {
    const { dispatch, cardData } = this.props;
    dispatch(closeMenu());
    dispatch(fetchRemoveCard(cardData.uuid));
  }

  _showBlockedCardAlert = () => {
    Alert.alert(
      'Cartão bloqueado ou cancelado',
      'Exclua este cartão e solicite uma segunda via a sua administradora.',
      [
        {
          text: 'Cancelar',
        },
        {
          text: 'Excluir cartão',
          onPress: this._removeCard,
        }
      ]
    );
  }

  _showRemoverCardAlert = () => {
    Alert.alert(
      'Remover cartão',
      'Você tem certeza que deseja remover este cartão?',
      [
        {
          text: 'Cancelar',
        },
        {
          text: 'Sim',
          onPress: this._removeCard,
        },
      ]
    );
  }

  _showScholarNotRevalidatedAlert = () => {
    Alert.alert(
      'Cartão escolar inativo',
      'Seu cartão escolar foi inativado. Caso você ainda tenha direito ao benefício, revalide seu cartão no portal da EMTU com o seu CPF em mãos.',
      [
        {
          text: 'Excluir',
          onPress: this._showRemoverCardAlert,
        },
        {
          text: 'Revalidar',
          onPress: () => { openUrl('http://www.emtu.sp.gov.br/passe/indexregiao.htm'); },
        },
        {
          text: 'OK',
        }
      ]
    );
  }

  _onPress = () => {
    const { cardData } = this.props;

    if (isTransportCardScholarNotRevalidated(cardData)) {
      this._showScholarNotRevalidatedAlert();
    } else {
      this._showBlockedCardAlert();
    }
  }

  _getBlockTagText = () => {
    const { cardData } = this.props;

    if (isTransportCardScholarNotRevalidated(cardData)) {
      return 'Cartão escolar não revalidado';
    }
    
    return 'Cartão bloqueado ou cancelado';
  }

  _renderCircle = () => (
    <View style={StyleSheet.flatten([styles.blockTagIconCircleContainer, this.props.style])}>
      <TouchableNative 
        style={styles.blockTagCircle}
        borderless
        onPress={this._onPress}
      >
        <Icon
          name='help-outline' 
          style={styles.blockTagCircleIcon}
        />
      </TouchableNative>
    </View>
  )

  render() {
    const { style, circle } = this.props;

    if (circle) return this._renderCircle();

    return (
      <View style={StyleSheet.flatten([styles.blockTagContainer, style])}>
        <View style={styles.blockTagWrapper}>
          <TouchableNative 
            style={styles.blockTag} 
            borderless
            onPress={this._onPress}
          >
            <BrandText style={styles.blockTagText}>{this._getBlockTagText()}</BrandText>
            <Icon
              style={styles.blockTagIcon}
              name='help-outline'
            />
          </TouchableNative>
        </View>
      </View>
    );
  }
}

// styles
const styles = StyleSheet.create({
  blockTagContainer: {
    alignItems: 'center',
  },
  blockTagWrapper: {
    backgroundColor: colors.BRAND_ERROR,
    height: 32,
    borderRadius: 16,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  blockTag: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  blockTagText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginRight: 8,
  },
  blockTagIcon: {
    color: 'white',
    fontSize: 24,
  },
  blockTagIconCircleContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.BRAND_ERROR,
  },
  blockTagCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  blockTagCircleIcon: {
    color: 'white',
    fontSize: 24,
    marginTop: -2
  }
});

export default connect()(BlockTag);
