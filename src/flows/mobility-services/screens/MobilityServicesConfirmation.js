// NPM imports
import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, View, Platform } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// VouD imports
import BrandText from '../../../components/BrandText';
import SystemText from '../../../components/SystemText';
import Button from '../../../components/Button';
import TouchableText from '../../../components/TouchableText';
import Dialog from '../../../components/Dialog';
import { formatCurrency } from '../../../utils/parsers-formaters';
import { openUrl } from '../../../utils/open-url';
import { colors } from '../../../styles/constants';

// Module imports
import { getSelectedService } from '../reducer';
import { fetchEstimateAction } from '../actions';
import { GAEventParams, GATrackEvent } from '../../../shared/analytics';

// Screen component
class MobilityServicesConfirmationView extends Component {
  openApp = async () => {
    const { data, currentSearchId, players, dispatch } = this.props;
    const { player } = data;
    const appStoreLink = players[player]['apple_store_url'];
    const googlePlayLink = players[player]['google_store_url'];

    const { categories: { BUTTON }, actions: { CLICK }, labels: { VAH_OPEN_PLAYER_DEEP_LINK } } = GAEventParams;
    GATrackEvent(BUTTON, CLICK, `${VAH_OPEN_PLAYER_DEEP_LINK}-${data.player}`);

    try {
      await openUrl(data.deeplink);
      dispatch(fetchEstimateAction(currentSearchId, data.urban_result_id));
    } catch(error) {
      if (Platform.OS === 'ios' && appStoreLink) {
        await openUrl(appStoreLink);
      }
      if (Platform.OS === 'android' && googlePlayLink) {
        await openUrl(googlePlayLink);
      }
      dispatch(fetchEstimateAction(currentSearchId, data.urban_result_id, true));
    }

    dispatch(NavigationActions.back());
  };

  dismiss = () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.back());
  };

  renderContent = () => {
    const { data, players } = this.props;
    const { promotion, product } = data;

    if (promotion) {
      const { name, discount, end_at, max_value, popup } = promotion;

      return (
        <React.Fragment>
          <View style={styles.promoBanner}>
            <BrandText style={styles.promoBannerText}>
              Nós achamos um desconto para você!
            </BrandText>
          </View>
          <ScrollView>
            <View
              onStartShouldSetResponder={() => true}
              style={styles.content}
            >
              <Image
                source={{ uri: players[data.player].icon }}
                style={styles.serviceLogoSm}
              />
              <SystemText style={styles.productText}>
                {product}
              </SystemText>
              <BrandText style={styles.textSm}>
                Você está sendo redirecionado para o app parceiro do VouD, onde poderá concluir a sua chamada.
              </BrandText>
              <View style={styles.promoInfo}>
                <View style={styles.promoInfoRow}>
                  <BrandText style={styles.promoInfoLeftText}>
                    Código:
                  </BrandText>
                  <SystemText style={styles.promoInfoRightText}>
                    {name}
                  </SystemText>
                </View>
                <View style={styles.promoInfoRow}>
                  <BrandText style={styles.promoInfoLeftText}>
                    Desconto:
                  </BrandText>
                  <SystemText style={styles.promoInfoRightText}>
                    {discount}%
                  </SystemText>
                </View>
                <View style={styles.promoInfoRow}>
                  <BrandText style={styles.promoInfoLeftText}>
                    Limite por corrida:
                  </BrandText>
                  <SystemText style={styles.promoInfoRightText}>
                    R$ {formatCurrency(max_value)}
                  </SystemText>
                </View>
                <View style={styles.promoInfoRow}>
                  <BrandText style={styles.promoInfoLeftText}>
                    Validade:
                  </BrandText>
                  <SystemText style={styles.promoInfoRightText}>
                    {end_at}
                  </SystemText>
                </View>
              </View>
              <BrandText style={styles.textSm}>
                {popup}
              </BrandText>
            </View>
          </ScrollView>
        </React.Fragment>
      )
    }

    return (
      <View style={styles.content}>
        <Image
          source={{ uri: players[data.player].icon }}
          style={styles.serviceLogo}
        />
        <BrandText style={styles.text}>
          Você está sendo redirecionado para o app parceiro do VouD, onde poderá concluir a sua chamada.
        </BrandText>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Dialog
          noPadding
          onDismiss={this.dismiss}
        >
          {this.renderContent()}
          <View style={styles.actions}>
            <Button
              onPress={this.openApp}
              style={styles.openAppButton}
            >
              Prosseguir
            </Button>
            <TouchableText
              onPress={this.dismiss}
              color={colors.GRAY}
            >
              Cancelar
            </TouchableText>
          </View>
        </Dialog>
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  serviceLogo: {
    width: 104,
    height: 104,
    borderRadius: 12,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: colors.GRAY,
  },
  // with promotion
  promoBanner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    backgroundColor: colors.BRAND_PRIMARY_LIGHTER,
  },
  promoBannerText: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    color: 'white',
  },
  serviceLogoSm: {
    width: 32,
    height: 32,
    borderRadius: 4,
    marginBottom: 8,
  },
  productText: {
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center',
    color: colors.GRAY_DARKER,
  },
  textSm: {
    fontSize: 12,
    lineHeight: 14,
    textAlign: 'center',
    color: colors.GRAY,
  },
  promoInfo: {
    alignSelf: 'stretch',
    marginVertical: 16,
  },
  promoInfoRow: {
    flexDirection: 'row',
  },
  promoInfoLeftText: {
    flex: 1,
    marginRight: 4,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'right',
    color: colors.GRAY,
  },
  promoInfoRightText: {
    flex: 1,
    marginLeft: 4,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'bold',
    color: colors.BRAND_PRIMARY,
  },
  // actions
  actions: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: colors.GRAY_LIGHTER,
  },
  openAppButton: {
    marginBottom: 24,
  },
});

// redux connect and export
const mapStateToProps = state => ({
  data: getSelectedService(state),
  currentSearchId: state.mobilityServices.estimates.data.urban_search_id,
  players: state.mobilityServices.estimates.data.players,
});

export const MobilityServicesConfirmation = connect(mapStateToProps)(MobilityServicesConfirmationView);
