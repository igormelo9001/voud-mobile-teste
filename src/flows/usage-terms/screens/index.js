// NPM Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View, ScrollView, Alert, Platform, BackHandler } from 'react-native';
import { NavigationActions } from 'react-navigation';

// VouD Imports
import { colors, getStatusBarHeight } from '../../../styles';
import BrandContainer from '../../../components/BrandContainer';
import BrandText from '../../../components/BrandText';
import TouchableNative from '../../../components/TouchableNative';
import Icon from '../../../components/Icon';
import TouchableText from '../../../components/TouchableText';
import Button from '../../../components/Button';
import BounceLink from './BounceLink';
import { viewPrivacyPolicy, viewTerms } from '../utils';
import { fetchAcceptCurrentTerms } from '../actions';
import { getAcceptCurrentTermsUi } from '../reducer';
import LoadMask from '../../../components/LoadMask';
import MessageBox from '../../../components/MessageBox';

import { logout } from '../../../redux/login';

// Component
const propTypes = {
  dispatch: PropTypes.func.isRequired,
};

class AcceptUsageTermsView extends Component {
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  _backHandler = () => true;

  _showRefuseAlert = () => {
    const buttonActions = [{ text: 'Cancelar', style: 'cancel' }];

    if (Platform.OS === 'android') {
      buttonActions.push({
        text: 'Recusar e sair',
        onPress: () => {
          BackHandler.exitApp();
        },
      });
    }

    Alert.alert(
      'Atenção',
      'Caso recuse os novos termos de uso e a política de privacidade, não será possível continuar utilizando os serviços oferecidos pelo VouD. Para mais informações, entre em contato pelo e-mail atendimento@voud.com.br.',
      buttonActions
    );
  };

  _acceptTerms = () => {
    const { dispatch, forceUpdateProfile } = this.props;
    dispatch(fetchAcceptCurrentTerms()).then(({ payload }) => {
      if (payload) {
        if (forceUpdateProfile) {
          dispatch(logout());
        } else {
          dispatch(NavigationActions.back());
        }
      }
    });
  };

  render() {
    const { dispatch, acceptCurrentTermsUi } = this.props;
    return (
      <BrandContainer>
        <View style={styles.statusBarSpaceHolder} />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
        >
          <TouchableNative borderless onPress={this._showRefuseAlert} style={styles.dismissButton}>
            <Icon name="close" style={styles.dismissIcon} />
          </TouchableNative>
          <BrandText style={styles.title}>Termos de uso e Política de privacidade</BrandText>
          <BrandText style={styles.subtitle}>
            Atualizamos os termos de uso e a política de privacidade. Por favor, leia cada documento
            com atenção.
          </BrandText>
          <View style={styles.docLinks}>
            <BounceLink style={styles.mb16} onPress={() => viewTerms(dispatch)}>
              Ler os Termos de Uso
            </BounceLink>
            <BounceLink onPress={() => viewPrivacyPolicy(dispatch)}>
              Ler os Política de Privacidade
            </BounceLink>
          </View>
          <View>
            <BrandText style={styles.footerText}>
              Aceite e continue aproveitando todos os serviços oferecidos pelo VouD.
            </BrandText>
            {acceptCurrentTermsUi.error ? (
              <MessageBox message={acceptCurrentTermsUi.error} style={styles.mb16} />
            ) : null}
            <Button onPress={this._acceptTerms}>Aceitar</Button>
            <TouchableText
              onPress={this._showRefuseAlert}
              style={styles.refuseButton}
              color={colors.BRAND_SECONDARY}
            >
              Recusar
            </TouchableText>
          </View>
        </ScrollView>
        {acceptCurrentTermsUi.isFetching && <LoadMask />}
      </BrandContainer>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  statusBarSpaceHolder: {
    height: getStatusBarHeight(),
    backgroundColor: colors.BRAND_PRIMARY,
  },
  dismissButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  dismissIcon: {
    fontSize: 24,
    color: 'white',
  },
  title: {
    color: 'white',
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 24,
  },
  subtitle: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  docLinks: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  footerText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 32,
  },
  refuseButton: {
    marginTop: 16,
  },
  mb16: {
    marginBottom: 16,
  },
});

AcceptUsageTermsView.propTypes = propTypes;

// redux connect and export
const mapStateToProps = state => {
  return {
    acceptCurrentTermsUi: getAcceptCurrentTermsUi(state),
    forceUpdateProfile: state.profile.data.forceUpdateProfile,
  };
};

export const AcceptUsageTerms = connect(mapStateToProps)(AcceptUsageTermsView);
