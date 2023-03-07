import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { NavigationActions } from 'react-navigation';

import Header, { headerActionTypes } from '../../../components/Header';

import styles from './styles';
import BrandText from '../../../components/BrandText';
import CardView from '../component/card';
import { navigateToRoute } from '../../../redux/nav';
import { routeNames } from '../../../shared/route-names';

class AddCardTicketView extends PureComponent {
  close = () => {
    const {
      navigation: { dispatch },
    } = this.props;
    dispatch(NavigationActions.back());
  };

  onPress = type => {
    const {
      navigation: { dispatch },
    } = this.props;
    dispatch(
      navigateToRoute(routeNames.PURCHASE_TICKET, {
        type,
      })
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          title="Comprar bilhete unitário"
          left={{
            type: headerActionTypes.CLOSE,
            onPress: this.close,
          }}
        />
        <View style={styles.containerTitle}>
          <BrandText style={styles.title}>Selecione o tipo de bilhete unitário</BrandText>
        </View>
        <CardView type="METRO" onPress={this.onPress} />
        <CardView type="CPTM" onPress={this.onPress} />
      </View>
    );
  }
}

export const AddCardTicket = AddCardTicketView;
