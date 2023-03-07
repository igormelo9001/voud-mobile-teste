import React, { Component, Fragment } from 'react';
import { View, Keyboard, Animated, Platform, TouchableWithoutFeedback } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import VoudModal from '../../../components/Modal/index';
import TextField from '../../../components/TextField';

import BrandText from '../../../components/VoudText';
import { colors } from '../../../styles';

import Button from '../../../components/Button';
import Picote from '../../../components/Picote';
import Icon from '../../../components/Icon';

import { clearReduxForm } from '../../../utils/redux-form-util';

import {
  getLoggedUser,
  getSelectedPaymentMethod,
  getPromocodeResponse,
} from '../../../redux/selectors';
import { showToast, toastStyles } from '../../../redux/toast';

import { fetchPromocode, fetchPromocodeClear } from '../../../redux/promo-code';

const reduxFormNameBom = 'bomPurchaseForm';
const reduxFormNameBu = 'buPurchaseForm';

const reduxFormName = 'promoCodeForm';
const ATIVAR = 'ATIVAR';
const CODIGO_VALIDO = 'CÓDIGO VÁLIDO';
const ERROR_NOT_MAPPED = 'Erro ao processar requisição';

const propTypes = {
  type: PropTypes.string,
};
const defaultProps = {
  type: 'timing',
};

class PromocodeModalValidation extends Component {
  constructor(props) {
    super(props);
    this.currentValue = 0;

    this.state = {
      animatedValue: new Animated.Value(this.currentValue),
    };
  }

  componentWillUnmount() {
    clearReduxForm(this.props.dispatch, reduxFormName);
  }

  componentDidMount() {
    const { dispatch, change } = this.props;
    dispatch(change('promoCode', 'VOUD-'));
  }

  componentDidUpdate() {
    const { dispatch, promocodeResponse } = this.props;
    if (promocodeResponse.data != null) {
      setTimeout(() => {
        this._onCloseNotification();
      }, 300);
    }
  }

  _onCloseNotification = async () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.back());
  };

  _fetchPromoCode = () => {
    const {
      dispatch,
      promoCode,
      rechargeValueBu,
      rechargeValueBom,
      loggedUser,
      paymentMethod,
      navigation: {
        state: {
          params: { creditValue, ticketUnitary },
        },
      },
    } = this.props;
    if (!promoCode) return;

    let rechargeValue = 0;

    if (!ticketUnitary) {
      rechargeValue =
        rechargeValueBu && rechargeValueBu > 0
          ? rechargeValueBu
          : rechargeValueBom && rechargeValueBom > 0
          ? rechargeValueBom
          : 0;
    } else {
      rechargeValue = creditValue * 100;
    }

    const cardFlag = paymentMethod.items && paymentMethod.items.cardFlag;

    dispatch(
      fetchPromocode({
        code: promoCode,
        rechargeValue: rechargeValue / 100,
        idCustomer: loggedUser.id,
        brandcard: cardFlag,
      })
    );
  };

  _onChangePromoCode = () => {};

  _renderMessageButtom = () => {
    const { promocodeResponse, dispatch } = this.props;
    const isMappedError =
      promocodeResponse.error && promocodeResponse.error.match(ERROR_NOT_MAPPED) == null;

    let styleButton = {};
    let textColor = colors.BRAND_PRIMARY;
    let result = ATIVAR;

    promocodeResponse.error &&
      !isMappedError &&
      dispatch(showToast(promocodeResponse.error, toastStyles.DEFAULT));

    if (promocodeResponse.error && isMappedError) {
      styleButton = styles.buttonStyleFail;
      textColor = colors.WHITE;
      result = promocodeResponse.error;
      this.move();
      setTimeout(() => {
        dispatch(fetchPromocodeClear());
      }, 2000);
    } else if (promocodeResponse.data != null) {
      styleButton = styles.buttonStyleSuccess;
      textColor = colors.WHITE;
      result = CODIGO_VALIDO;
    }

    return (
      <Button
        textStyle={{
          textAlign: 'center',
          color: textColor,
        }}
        buttonStyle={styleButton}
        onPress={this._fetchPromoCode}
      >
        {result}
      </Button>
    );
  };

  move = () => {
    const { animatedValue } = this.state;

    Animated.timing(animatedValue, {
      toValue: this.currentValue === 0 ? 1 : 0,
    }).start(() => {
      this.currentValue = this.currentValue === 0 ? 1 : 0;
    });
  };

  render() {
    const { animatedValue } = this.state;

    const translateX = animatedValue.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
      outputRange: [0, -10, 10, -10, 10, 0],
    });

    const animatedStyle = {
      transform: [{ translateX }],
    };

    return (
      <Fragment>
        <VoudModal
          isVisible
          style={styles.containerModal}
          animationIn="fadeIn"
          animationOut="fadeOut"
          onSwipe={this._onCloseNotification}
          onBackdropPress={this._onCloseNotification}
          backdropOpacity={0.3}
        >
          <Animated.View style={animatedStyle}>
            <View style={styles.modal}>
              <View style={styles.container}>
                <View style={styles.headerContainer}>
                  <BrandText style={styles.headerText}> Código Promocional </BrandText>
                  <TouchableWithoutFeedback onPress={this._onCloseNotification}>
                    <Icon name="close" size={24} color="white" />
                  </TouchableWithoutFeedback>
                </View>
              </View>
              <Picote max={5} />
              <View style={styles.container}>
                <View style={styles.bodyContainer}>
                  <BrandText style={styles.bodyText}> Digite o código </BrandText>
                  <Field
                    name="promoCode"
                    props={{
                      isPrimary: true,
                      label: '',
                      minLength: 10,
                      maxLength: 20,
                      reduxFormName,
                      onSubmitEditing: () => {
                        Keyboard.dismiss();
                      },
                    }}
                    underlineColorAndroid="transparent"
                    onChange={this._onChangePromoCode}
                    onFocus={() => {}}
                    autoCapitalize="characters"
                    component={TextField}
                  />
                </View>
                <View style={styles.footerContainer}>{this._renderMessageButtom()}</View>
              </View>
            </View>
          </Animated.View>
        </VoudModal>
      </Fragment>
    );
  }
}

const styles = {
  containerModal: {
    flexDirection: 'column',
  },

  modal: {
    backgroundColor: '#6D3E91',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'stretch',
  },

  container: {
    margin: Platform.OS === 'ios' ? 5 : 16,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },

  headerContainer: {
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  headerText: {
    fontSize: Platform.OS === 'ios' ? 20 : 24,
    color: '#fff',
  },

  bodyContainer: {
    padding: Platform.OS === 'ios' ? 5 : 16,
  },

  bodyText: {
    fontSize: 14,
    color: '#fff',
    justifyContent: 'flex-start',
  },
  bodyInput: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },

  footerContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: Platform.OS === 'ios' ? 5 : 10,
  },

  buttonStyleSuccess: {
    backgroundColor: '#7CCA5A',
  },

  buttonStyleFail: {
    backgroundColor: '#FD4100',
  },
};

PromocodeModalValidation.propTypes = propTypes;
PromocodeModalValidation.defaultProps = defaultProps;

const mapStateToProps = state => {
  return {
    promoCode: formValueSelector(reduxFormName)(state, 'promoCode'),
    rechargeValueBom: formValueSelector(reduxFormNameBom)(state, 'creditValue'),
    rechargeValueBu: formValueSelector(reduxFormNameBu)(state, 'creditValue'),
    paymentMethod: getSelectedPaymentMethod(state),
    promocodeResponse: getPromocodeResponse(state),
    loggedUser: getLoggedUser(state),
  };
};

export default connect(mapStateToProps)(
  reduxForm({ form: reduxFormName, destroyOnUnmount: false })(PromocodeModalValidation)
);
