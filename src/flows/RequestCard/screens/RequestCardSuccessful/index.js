import React, { PureComponent } from 'react';
import { ScrollView, StyleSheet, Image, View, BackHandler } from 'react-native';
import { connect } from 'react-redux';

// VouD imports
import moment from 'moment';
import BrandText from '../../../../components/BrandText';
import SystemText from '../../../../components/SystemText';
import Icon from '../../../../components/Icon';
import Button from '../../../../components/Button';
import { backToHome } from '../../../../redux/nav';
import { colors } from '../../../../styles';
import { formatCurrencyFromCents, formatCpf } from '../../../../utils/parsers-formaters';

import styles from './style';
import VoudText from '../../../../components/VoudText';

const imageCardBOM = require('../../../../images/thumb-comum.png');

class RequestCardSuccessfulView extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentDidMount() {
    // RatingTracker.handlePositiveEvent();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  _backHandler = () => {
    this._finish();
    return true;
  };

  _finish = () => {
    this.props.dispatch(backToHome());
  };

  _handlerConfirm = () => {
    this._finish();
  };

  _renderDescriptionLocalWithdrawal = () => {
    return (
      <View style={styles.containerDescriptionSecondary}>
        <VoudText style={styles.text}>
          Seu cartão BOM Comum poderá ser retirado no Poupatempo mais próximo.
        </VoudText>
      </View>
    );
  };

  _renderDateDelivery = () => {
    let date = new Date();
    let count = 1;

    while (count <= 7) {
      date = moment(date).add(1, 'day');
      const day = moment(date).format('dddd');
      const isDayValid = this._renderSatAndSun(day);
      if (isDayValid) count += 1;
    }
    return moment(date).format('DD/MM/YYYY');
  };

  _renderSatAndSun = day => {
    return day.toUpperCase() !== 'DOMINGO' && day.toUpperCase() !== 'SÁBADO';
  };

  _renderDescriptionDelivery = () => {
    const {
      navigation: {
        state: {
          params: {
            paymentData: { userData },
          },
        },
      },
    } = this.props;

    const address =
      userData && userData.addressDelivery.zip !== undefined
        ? {
            zip: userData.addressDelivery.zip,
            main: userData.addressDelivery.main,
            number: userData.addressDelivery.number,
            supplement: userData.addressDelivery.supplement
              ? userData.addressDelivery.supplement
              : '',
            district: userData.addressDelivery.district,
            city: userData.addressDelivery.city,
            state: userData.addressDelivery.state,
          }
        : {
            zip: userData.address.zipCode,
            main: userData.address.main,
            number: userData.address.number,
            supplement: userData.address.supplement ? userData.address.supplement : '',
            district: userData.address.district,
            city: userData.address.city,
            state: userData.address.state,
          };

    return (
      <View style={styles.containerDescriptionSecondary}>
        <VoudText style={styles.text}>
          Seu cartão BOM Comum será entregue no endereço abaixo:
        </VoudText>
        <VoudText style={styles.text}>{`${address.main}, ${address.number} - ${
          address.supplement
        }`}</VoudText>
        <VoudText style={styles.text}>{`${address.city}, ${address.state}`}</VoudText>
        <VoudText style={styles.text}>Previsão de entrega: {this._renderDateDelivery()}</VoudText>
      </View>
    );
  };

  render() {
    const { profileData } = this.props;
    const {
      navigation: {
        state: {
          params: { localWithdrawal },
        },
      },
    } = this.props;
    const requestDate = moment(new Date()).format('DD/MM/YYYY');

    return (
      <View style={{ flex: 1, backgroundColor: '#FFF' }}>
        <View style={styles.headerContainer}>
          <Icon style={styles.closeIcon} name="close" onPress={this._finish} />
          <Icon style={styles.successIcon} name="checkmark-circle-outline" />
          <BrandText style={styles.successTitle}>Solicitação realizada</BrandText>
          <BrandText style={styles.successTitle}> com sucesso!</BrandText>
        </View>
        <View style={styles.continerImage}>
          <Image source={imageCardBOM} resizeMode="contain" />
        </View>
        <View style={styles.containerDescriptionPrimary}>
          <VoudText style={styles.text}>{`${profileData.name} ${profileData.lastName}`} </VoudText>
          <VoudText style={styles.text}>{`CPF: ${formatCpf(profileData.cpf)}`} </VoudText>
          <VoudText style={styles.text}>Data da solicitação: {requestDate}</VoudText>
        </View>
        {localWithdrawal && this._renderDescriptionLocalWithdrawal()}
        {!localWithdrawal && this._renderDescriptionDelivery()}
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            marginHorizontal: 16,
            padding: 16,
          }}
        >
          <Button buttonStyle={{ height: 36 }} onPress={this._handlerConfirm}>
            OK
          </Button>
        </View>
      </View>
    );
  }
}

// Redux
const mapStateToProps = state => {
  return {
    profileData: state.profile.data,
  };
};

export const RequestCardSuccessful = connect(mapStateToProps)(RequestCardSuccessfulView);
