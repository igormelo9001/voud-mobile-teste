import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import { colors } from '../../../../styles';
import VoudText from '../../../../components/VoudText';
import GradientButton from '../../../../components/GradientButton';

class PendingRegistration extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let title = 'Cartões de transporte';
    let description = 'Para cadastrar e carregar cartões de transporte,';

    if (this.props.serviceMenuType === 'scooter') {
      title = 'Voud Patinete';
      description = 'Para iniciar uma corrida,';
    } else if (this.props.serviceMenuType === 'requestCard') {
      title = 'Solicitar cartão BOM';
      description = 'Para solicitar cartão BOM,';
    }

    return (
      <View style={styles.container}>
        <VoudText style={styles.title}>{title}</VoudText>
        <VoudText style={styles.description}>
          <VoudText>{description}</VoudText>
          <VoudText style={styles.bold}> confirme seu telefone e e-mail.</VoudText>
        </VoudText>
        <GradientButton text="Completar cadastro" onPress={this.props.onCompleteRegistration} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: 'bold',
    color: colors.GRAY_DARK,
    opacity: 0.5,
    paddingBottom: 16,
  },
  description: {
    fontSize: 12,
    color: colors.GRAY_DARK,
    marginBottom: 16,
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default PendingRegistration;
