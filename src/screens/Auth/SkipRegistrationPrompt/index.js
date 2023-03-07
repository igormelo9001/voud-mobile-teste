import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Image, ScrollView, BackHandler } from 'react-native';
import { NavigationActions } from 'react-navigation';

// components
import VoudText from '../../../components/VoudText';
import Button from '../../../components/Button';
import TouchableText from '../../../components/TouchableText';
import { colors } from '../../../styles';
import { changeStep, authSteps, authTypes } from '../../../redux/auth';
import { testInitRequestAction } from '../../../test-utils/request-actions-helper';
import { backToHome } from '../../../redux/nav';

// images
const skipRegistrationIcon = require('../../../images/finish-registration-icon.png');

const MOBILE_VALUES = {
  title: 'Complete seu cadastro!',
  attention: 'Tem certeza que deseja pular a verificação do seu telefone?',
  boldText: 'Não será possível cadastrar um cartão de transportes ou comprar créditos',
  normalText: 'enquanto seu telefone e e-mail  não forem verificados.',
  buttonText: 'VERIFICAR TELEFONE',
  touchableText: 'Pular Etapa',
};
const EMAIL_VALUES = {
  title: 'Complete seu cadastro!',
  attention: 'Tem certeza que deseja pular a verificação do seu e-mail?',
  boldText: 'Não será possível cadastrar um cartão de transportes ou comprar créditos',
  normalText: 'enquanto seu telefone e e-mail  não forem verificados.',
  buttonText: 'VERIFICAR E-MAIL',
  touchableText: 'Pular Etapa',
};

class SkipRegistrationPromptView extends Component {

  _backHandler = () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.back());
    return testInitRequestAction;
  };

  _buttonAction = () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.back());
  }

  _touchableAction = () => {
    const { dispatch, navigation, authType } = this.props;
    const type = navigation.getParam('type');
    if(type === 'mobile') {
      if(authType === authTypes.FACEBOOK) {
        dispatch(changeStep(null));
        dispatch(backToHome());
      }
      dispatch(changeStep(authSteps.CONFIRM_EMAIL));
      dispatch(NavigationActions.back());
      return;
    }
    dispatch(changeStep(null));
    dispatch(backToHome());
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  render() {
    const { navigation } = this.props;
    const type = navigation.getParam('type');
    const values = type === 'mobile' ? MOBILE_VALUES : EMAIL_VALUES;
    console.log('SkipRegistrationPromptView', {
      type,
      values,
      props: this.props,
    })
    return (
      <View style={styles.container}>
        <View style={styles.imgWrapper}>
          <Image source={skipRegistrationIcon} />
        </View>
        <ScrollView>
          <VoudText style={styles.title}>
            {values.title}
          </VoudText>
          <View style={styles.descriptionWrapper}>
            <VoudText style={styles.attention}>
              {values.attention}
            </VoudText>
            <VoudText style={{textAlign: 'center'}}>
              <VoudText style={styles.descriptionBold}>
                {values.boldText}
              </VoudText>
              <VoudText style={styles.descriptionNormal}>
                {` ${values.normalText}`}
              </VoudText>
            </VoudText>
          </View>
        </ScrollView>
        <Button
          style={styles.button}
          onPress={this._buttonAction}
        >
          {values.buttonText}
        </Button>
        <TouchableText
          onPress={this._touchableAction}
          textStyle={styles.skip}
        >
          {values.touchableText}
        </TouchableText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 40,
  },
  innerContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 32,
    flex: 1,
  },
  imgWrapper: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    color: colors.BRAND_PRIMARY_DARKER,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  descriptionWrapper: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  attention: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 24,
    color: colors.GRAY_DARK,
    paddingBottom: 16,
  },
  descriptionBold: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 24,
    color: colors.GRAY_DARK,
  },
  descriptionNormal: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: colors.GRAY_DARK,
  },
  button: {
    margin: 16,
    alignSelf: 'stretch',
  },
  skip: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    color: colors.GRAY,
    // marginBottom: 40,
  }
})

SkipRegistrationPromptView.propTypes = {};
SkipRegistrationPromptView.defaultProps = {};

const mapStateToProps = (state) => {
  return {
    authType: state.auth.type
  }
};

export const SkipRegistrationPrompt = connect(mapStateToProps)(SkipRegistrationPromptView);