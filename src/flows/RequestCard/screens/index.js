import React from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { reduxForm, Field, change, untouch, touch } from 'redux-form';
import Moment from 'moment';
import Header, { headerActionTypes } from '../../../components/Header';
import {
  getHasProfileAlerts,
  getPersonalDataAlertCount,
  getPersonalDataValidation,
} from '../../../redux/selectors';
import {
  formatRg,
  parseNumeric,
  formatNumeric,
  formatCep,
  parseCep,
  formatCpf,
  formatExcludeNumbers,
  parseExcludeNumbers,
  formatMobile,
  parseMobile,
} from '../../../utils/parsers-formaters';
import { clearReduxForm } from '../../../utils/redux-form-util';
import { routeNames } from '../../../shared/route-names';
import { navigateToRoute } from '../../../redux/nav';

import fetchViaCepService from '../../../utils/via_cpf';
import CheckBox from '../../../components/CheckBox';
import ScreenWithCardHeader from '../../../components/ScreenWithCardHeader';
import styles from './style';
import VoudText from '../../../components/VoudText';
import InfoListItem from '../../../components/InfoList/InfoListItem';
import ProfileInfoItem from '../../../screens/MyProfile/ProfileInfoItem';
import KeyboardDismissView from '../../../components/KeyboardDismissView';
import { fetchRegisterComplementaryData, fetchPriceDeliveryResidence } from '../store/requestCard';
import Icon from '../../../components/Icon';
import Button from '../../../components/Button';

import TextField from '../../../components/TextField';
import { required, mobileValidator, cepValidator } from '../../../utils/validators';
import { colors } from '../../../styles';
import LoadMask from '../../../components/LoadMask';
import { showToast, toastStyles } from '../../../redux/toast';

const cardImage = require('../../../images/cartao.png');

const reduxFormName = 'resquestCardData';

const listField = [
  'zipDelivery',
  'stateDelivery',
  'cityDelivery',
  'districtDelivery',
  'mainDelivery',
  'localWithdrawal',
  'supplementDelivery',
  'numberDelivery',
];

class RequestCardView extends ScreenWithCardHeader {
  constructor(props) {
    super(props);
    this.state = {
      isDeliveryResidence: true,
      isDeliveryWithdrawal: false,
      addressDelivery: false,
    };

    this.animationDeliveryWithdrawal = new Animated.Value(0);
    this.animationDeliveryResidence = new Animated.Value(1);
  }

  componentDidMount() {
    this._renderPriceDeliveryResidence();
  }

  componentWillUnmount() {
    clearReduxForm(this.props.dispatch, reduxFormName);
  }

  _renderPriceDeliveryResidence = () => {
    const { dispatch } = this.props;
    dispatch(fetchPriceDeliveryResidence());
  };

  _getPersonalDataInfo = () => {
    const {
      userData: { name, lastName, birthDate, cpf },
      personalDataValidation,
    } = this.props;
    const personalDataInfo = [
      `${this.capitalize(name)}${
        personalDataValidation.isValidLastName ? ` ${this.capitalize(lastName)}` : ''
      }`,
    ];

    if (birthDate) personalDataInfo.push(`Nascimento: ${Moment(birthDate).format('DD/MM/YYYY')}`);
    personalDataInfo.push(`CPF: ${formatCpf(cpf)}`);

    return personalDataInfo;
  };

  _getPersonalDataErrorText = () => {
    const {
      personalDataAlertCount,
      personalDataValidation: { isValidLastName, isValidBirthDate },
    } = this.props;
    const singleAlert = personalDataAlertCount === 1;
    const filteredInvalidFields = requiredPersonalDataFields.filter(
      el =>
        (el === 'sobrenome' && !isValidLastName) ||
        (el === 'data de nascimento' && !isValidBirthDate)
    );
    const invalidFieldsText = filteredInvalidFields.reduce((acc, cur, index) => {
      if (index === 0) return capitalizeFirstLetter(cur);
      if (index < filteredInvalidFields.length - 1) return `${acc}, ${cur}`;
      return `${acc} e ${cur}`;
    }, '');

    return `${invalidFieldsText} não informad${
      singleAlert && !isValidBirthDate ? 'a' : !singleAlert ? 'os' : 'o'
    }.`;
  };

  capitalize = s => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  _handlerDeliveryResidence = () => {
    const { isDeliveryResidence } = this.state;
    const { dispatch } = this.props;

    if (!isDeliveryResidence) {
      this.setState({
        isDeliveryResidence: true,
        isDeliveryWithdrawal: false,
        addressDelivery: false,
      });

      dispatch(change(reduxFormName, 'zipDelivery', null));
      dispatch(change(reduxFormName, 'stateDelivery', null));
      dispatch(change(reduxFormName, 'cityDelivery', null));
      dispatch(change(reduxFormName, 'districtDelivery', null));
      dispatch(change(reduxFormName, 'mainDelivery', null));
      dispatch(change(reduxFormName, 'localWithdrawal', null));
      dispatch(change(reduxFormName, 'numberDelivery', null));
      this.validationAddressDelivery();
      this.MainDeliveryField.focus();
    }

    Animated.timing(this.animationDeliveryWithdrawal, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(this.animationDeliveryResidence, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  _handlerDeliveryWithdrawal = () => {
    const { isDeliveryWithdrawal } = this.state;
    if (!isDeliveryWithdrawal) {
      this.setState({
        isDeliveryWithdrawal: true,
        isDeliveryResidence: false,
        addressDelivery: true,
      });
      this.PhoneNumberField.focus();
    }

    Animated.timing(this.animationDeliveryWithdrawal, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(this.animationDeliveryResidence, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    this.clearFieldAddressDelivery();
  };

  handlerRequestCard = ({
    motherName,
    // fatherName,
    mobile,
    main,
    state,
    city,
    zipCode,
    number,
    district,
    supplement,
    phoneNumber,
    rg,
    zipDelivery,
    mainDelivery,
    numberDelivery,
    supplementDelivery,
    districtDelivery,
    cityDelivery,
    stateDelivery,
  }) => {
    const { userData, requestCard } = this.props;
    const { isDeliveryResidence, addressDelivery } = this.state;

    const value = isDeliveryResidence ? requestCard.price : 0;
    const addressDeliveryResult = addressDelivery
      ? {
          main,
          state,
          city,
          zipCode,
          number,
          district,
          supplement,
        }
      : {
          zip: zipDelivery,
          main: mainDelivery,
          number: numberDelivery,
          supplement: supplementDelivery,
          district: districtDelivery,
          city: cityDelivery,
          state: stateDelivery,
        };

    const params = JSON.stringify({
      customer: addressDelivery
        ? {
            id: userData.id,
            motherName,
            fatherName: '',
            mobile,
            phone: phoneNumber,
            rg: rg
              .replace('.', '')
              .replace('.', '')
              .replace('-', ''),
            cpf: userData.cpf,
            email: userData.email,
          }
        : {
            id: userData.id,
            motherName,
            fatherName: '',
            mobile,
            phone: phoneNumber,
            rg: rg
              .replace('.', '')
              .replace('.', '')
              .replace('-', ''),
            email: userData.email,
          },
      address: {
        main,
        state,
        city,
        zipCode,
        number,
        district,
        supplement,
      },
      addressDelivery: addressDeliveryResult,
      value,
    });

    const { dispatch } = this.props;
    const localWithdrawal = true;
    const paymentData = {};

    if (isDeliveryResidence) {
      dispatch(navigateToRoute(routeNames.REQUEST_CARD_PAYMENT, { params }));
    } else {
      dispatch(fetchRegisterComplementaryData(JSON.parse(params)))
        .then(response => {
          if (parseInt(response.returnCode) === 201) {
            dispatch(
              navigateToRoute(routeNames.REQUEST_CARD_PAYMENT_SUCCESSFUL, {
                paymentData,
                localWithdrawal,
              })
            );
          } else {
            dispatch(showToast('Solicitação já realizada.', toastStyles.ERROR));
          }
        })
        .catch(error => {
          dispatch(showToast(error.message, toastStyles.ERROR));
        });
    }
  };

  _submit = () => {
    const { valid, ui, handleSubmit } = this.props;
    Keyboard.dismiss();

    if (valid) handleSubmit(this.handlerRequestCard)();
  };

  _onChangeZipCode = value => {
    const { change } = this.props;
    if (value.length == 9) {
      const promise = fetchViaCepService(value.replace('-', ''));
      promise.then(data => {
        change('state', data.state);
        change('city', data.city);
        change('district', data.neighborhood);
        change('main', data.street);
      });
    }
  };

  _onChangeZipCodeDelivery = value => {
    const { change } = this.props;
    if (value.length == 9) {
      const promise = fetchViaCepService(value.replace('-', ''));
      promise.then(data => {
        change('stateDelivery', data.state);
        change('cityDelivery', data.city);
        change('districtDelivery', data.neighborhood);
        change('mainDelivery', data.street);
      });
    }
  };

  _renderAddress = () => {
    return (
      <View style={styles.continerAddress}>
        <Field
          name="zipCode"
          style={styles.zipCodeAddress}
          props={{
            textFieldRef: el => (this.ZipCodeField = el),
            label: 'CEP*',
            maxLength: 9,
            keyboardType: 'numeric',
            returnKeyType: 'next',
            onSubmitEditing: e => {
              this.MainField.focus();
            },
          }}
          onChange={this._onChangeZipCode}
          format={formatCep}
          parse={parseCep}
          component={TextField}
          validate={[required, cepValidator]}
        />
        <Field
          name="main"
          style={styles.containerLabel}
          props={{
            textFieldRef: el => (this.MainField = el),
            label: 'Endereço (sem número)*',
            returnKeyType: 'next',
            maxLength: 100,
            onSubmitEditing: e => {
              this.NumberField.focus();
            },
          }}
          format={formatExcludeNumbers}
          parse={parseExcludeNumbers}
          component={TextField}
          validate={required}
        />
        <View style={styles.containerNumberSupplement}>
          <View style={styles.numberAddress}>
            <Field
              name="number"
              props={{
                textFieldRef: el => (this.NumberField = el),
                label: 'Número*',
                keyboardType: 'numeric',
                returnKeyType: 'next',
                onSubmitEditing: e => {
                  this.SupplementField.focus();
                },
              }}
              format={formatNumeric}
              parse={parseNumeric}
              component={TextField}
              validate={required}
            />
          </View>
          <View style={styles.containerSupplement}>
            <Field
              name="supplement"
              props={{
                textFieldRef: el => (this.SupplementField = el),
                label: 'Complemento (opcional)',
                returnKeyType: 'next',
                onSubmitEditing: e => {
                  this.DistrictField.focus();
                },
              }}
              component={TextField}
            />
          </View>
        </View>

        <Field
          name="district"
          style={styles.containerLabel}
          props={{
            textFieldRef: el => (this.DistrictField = el),
            label: 'Bairro*',
            returnKeyType: 'next',
            onSubmitEditing: e => {
              this.CityField.focus();
            },
          }}
          format={formatExcludeNumbers}
          parse={parseExcludeNumbers}
          component={TextField}
          validate={required}
        />
        <View style={styles.containerCityState}>
          <View style={styles.city}>
            <Field
              name="city"
              props={{
                textFieldRef: el => (this.CityField = el),
                label: 'Cidade*',
                returnKeyType: 'next',
                onSubmitEditing: e => {
                  Keyboard.dismiss();
                },
              }}
              format={formatExcludeNumbers}
              parse={parseExcludeNumbers}
              component={TextField}
              validate={required}
            />
          </View>
          <View style={styles.state}>
            <Field
              name="state"
              props={{
                label: 'Estado*',
                onPressOverlay: () => {
                  this.props.dispatch(
                    navigateToRoute(routeNames.SELECT_STATE_DIALOG, {
                      reduxFormName,
                    })
                  );
                },
                right: () => <Icon name="arrow-drop-down" size={24} color={colors.GRAY} />,
              }}
              component={TextField}
              validate={required}
            />
          </View>
        </View>
      </View>
    );
  };

  _renderAddressDelivery = () => {
    const { addressDelivery } = this.state;

    const selected = addressDelivery ? styles.isSelected : styles.isNotSelected;
    const labelValidationAddressDelivery = addressDelivery ? '' : '*';
    const validatitonZipDelivery = addressDelivery ? [] : [required, cepValidator];
    const requeredAddressDelivery = addressDelivery ? [] : [required];

    return (
      <View style={{ flex: 1 }}>
        <View style={StyleSheet.flatten([styles.zipCodeAddress, selected])}>
          <Field
            name="zipDelivery"
            props={{
              textFieldRef: el => (this.ZipCodeDeliveryField = el),
              label: `CEP${labelValidationAddressDelivery}`,
              maxLength: 9,
              keyboardType: 'numeric',
              returnKeyType: 'next',
              editable: !addressDelivery,
              onSubmitEditing: e => {
                this.MainDeliveryField.focus();
              },
            }}
            onChange={this._onChangeZipCodeDelivery}
            format={formatCep}
            parse={parseCep}
            component={TextField}
            validate={validatitonZipDelivery}
          />
        </View>
        <View style={StyleSheet.flatten([styles.containerLabel, selected])}>
          <Field
            name="mainDelivery"
            props={{
              textFieldRef: el => (this.MainDeliveryField = el),
              label: `Endereço (sem número)${labelValidationAddressDelivery}`,
              returnKeyType: 'next',
              maxLength: 100,
              editable: !addressDelivery,
              onSubmitEditing: e => {
                this.NumberDeliveryField.focus();
              },
            }}
            format={formatExcludeNumbers}
            parse={parseExcludeNumbers}
            component={TextField}
            validate={requeredAddressDelivery}
          />
        </View>
        <View style={styles.containerNumberDelivery}>
          <View style={StyleSheet.flatten([styles.containerDistrictAndSupplement, selected])}>
            <Field
              name="numberDelivery"
              props={{
                textFieldRef: el => (this.NumberDeliveryField = el),
                label: `Número${labelValidationAddressDelivery}`,
                keyboardType: 'numeric',
                returnKeyType: 'next',
                editable: !addressDelivery,
                onSubmitEditing: e => {
                  this.SupplementDeliveryField.focus();
                },
              }}
              format={formatNumeric}
              parse={parseNumeric}
              component={TextField}
              validate={requeredAddressDelivery}
            />
          </View>
          <View style={StyleSheet.flatten([styles.containerSupplement, selected])}>
            <Field
              name="supplementDelivery"
              props={{
                textFieldRef: el => (this.SupplementDeliveryField = el),
                label: `Complemento (opcional)`,
                returnKeyType: 'next',
                editable: !addressDelivery,
                onSubmitEditing: e => {
                  this.DistrictDeliveryField.focus();
                },
              }}
              component={TextField}
            />
          </View>
        </View>
        <View style={StyleSheet.flatten([styles.containerLabel, selected])}>
          <Field
            name="districtDelivery"
            props={{
              textFieldRef: el => (this.DistrictDeliveryField = el),
              label: `Bairro${labelValidationAddressDelivery}`,
              returnKeyType: 'next',
              editable: !addressDelivery,
              onSubmitEditing: e => {
                this.CityDeliveryField.focus();
              },
            }}
            format={formatExcludeNumbers}
            parse={parseExcludeNumbers}
            component={TextField}
            validate={requeredAddressDelivery}
          />
        </View>

        <View style={styles.containerCityState}>
          <View style={StyleSheet.flatten([styles.city, selected])}>
            <Field
              name="cityDelivery"
              props={{
                textFieldRef: el => (this.CityDeliveryField = el),
                label: `Cidade${labelValidationAddressDelivery}`,
                returnKeyType: 'next',
                editable: !addressDelivery,
                onSubmitEditing: e => {
                  Keyboard.dismiss();
                },
              }}
              format={formatExcludeNumbers}
              parse={parseExcludeNumbers}
              component={TextField}
              validate={requeredAddressDelivery}
            />
          </View>
          <View style={StyleSheet.flatten([styles.state, selected])}>
            <Field
              name="stateDelivery"
              props={{
                label: `Estado${labelValidationAddressDelivery}`,
                editable: !addressDelivery,
                onPressOverlay: () => {
                  this.props.dispatch(
                    navigateToRoute(routeNames.SELECT_STATE_DELIVERY_DIALOG, {
                      reduxFormName,
                    })
                  );
                },
                right: () => <Icon name="arrow-drop-down" size={24} color={colors.GRAY} />,
              }}
              component={TextField}
              validate={requeredAddressDelivery}
            />
          </View>
        </View>
      </View>
    );
  };

  validationAddressDelivery = () => {
    const { dispatch } = this.props;

    listField.map(item => {
      dispatch(change(reduxFormName, item, null));
      dispatch(touch(reduxFormName, item));
    });
  };

  clearFieldAddressDelivery = () => {
    const { dispatch } = this.props;

    listField.map(item => {
      dispatch(change(reduxFormName, item, null));
      dispatch(untouch(reduxFormName, item));
    });
  };

  _handlerAddressDelivery = () => {
    const { addressDelivery } = this.state;

    if (!addressDelivery) {
      this.PhoneNumberField.focus();
      this.scrollView.scrollToEnd({ animated: true });
    } else {
      this.MainDeliveryField.focus();
    }

    this.clearFieldAddressDelivery();
    this.setState({ addressDelivery: !addressDelivery });
  };

  render() {
    const { dispatch, valid, requestCard } = this.props;
    const { isDeliveryWithdrawal, addressDelivery, isDeliveryResidence } = this.state;
    const localWithdrawal = true;
    let styleDeliveryResidence = styles.deliveryOption;
    let styleTextDeliveryResidence = styles.textTitle;

    let styleDeliveryWithdrawal = styles.deliveryOption;
    let styleTextDeliveryWithdrawal = styles.textTitle;

    if (isDeliveryResidence) {
      styleDeliveryResidence = styles.deliveryOptionSelected;
      styleTextDeliveryResidence = styles.textTitleSelected;
    } else {
      styleDeliveryWithdrawal = styles.deliveryOptionSelected;
      styleTextDeliveryWithdrawal = styles.textTitleSelected;
    }

    return (
      <View style={styles.container}>
        {requestCard.isFetching && <LoadMask />}
        <Header
          title="Solicitar cartão"
          left={{
            type: headerActionTypes.CLOSE,
            onPress: () => dispatch(NavigationActions.back()),
          }}
          isRequestCard
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          ref={scrollView => {
            this.scrollView = scrollView;
          }}
        >
          <View style={{ backgroundColor: colors.BRAND_PRIMARY, height: 122 }} />
          <View style={styles.containerCard}>
            <Image source={cardImage} resizeMode="contain" />
          </View>

          <View style={styles.containerDescription}>
            <VoudText style={styles.description}>
              Confirme os dados abaixo para solicitar o seu cartão BOM:
            </VoudText>
          </View>
          <View style={styles.containerRegister}>
            <KeyboardDismissView>
              <View style={styles.containerDataPersonal}>
                <InfoListItem itemContent="Dados pessoais" isHeader badge={0} />
                <View style={styles.groupInfoContainer}>
                  <ProfileInfoItem
                    mainInfo={this._getPersonalDataInfo()}
                    mainTextStyle={styles.personalDataText}
                  />
                </View>
                <View>
                  <InfoListItem itemContent="Complete o cadastro" isHeader badge={0} />
                  <View>
                    <Field
                      name="motherName"
                      style={styles.containerLabel}
                      props={{
                        textFieldRef: el => (this.motherName = el),
                        label: 'Nome da mãe*',
                        maxLength: 60,
                        returnKeyType: 'next',
                        onSubmitEditing: () => {
                          this.userRG.focus();
                        },
                      }}
                      format={formatExcludeNumbers}
                      parse={parseExcludeNumbers}
                      component={TextField}
                      validate={required}
                    />
                    {/* <Field
                      name="fatherName"
                      style={styles.containerLabel}
                      props={{
                        textFieldRef: el => (this.fatherName = el),
                        label: "Nome do pai",
                        maxLength: 60,
                        returnKeyType: "next",
                        onSubmitEditing: () => {
                          this.userRG.focus();
                        }
                      }}
                      format={formatExcludeNumbers}
                      parse={parseExcludeNumbers}
                      component={TextField}
                    /> */}
                    <Field
                      name="rg"
                      style={styles.containerLabel}
                      props={{
                        textFieldRef: el => (this.userRG = el),
                        label: 'RG*',
                        returnKeyType: 'next',
                      }}
                      format={formatRg}
                      component={TextField}
                      validate={required}
                    />
                    {this._renderAddress()}
                    {isDeliveryResidence && (
                      <View style={styles.containerCheckBox}>
                        <CheckBox checked={addressDelivery} onPress={this._handlerAddressDelivery}>
                          Endereço de Entrega
                        </CheckBox>
                      </View>
                    )}
                    <View style={{ marginTop: 23 }}>
                      <InfoListItem itemContent="Endereço de entrega" isHeader badge={0} />
                      {this._renderAddressDelivery()}
                    </View>
                    <Field
                      name="phoneNumber"
                      style={styles.containerLabel}
                      props={{
                        textFieldRef: el => (this.PhoneNumberField = el),
                        label: 'Telefone residencial (com ddd)*',
                        placeholder: '(00) 9999 9999',
                        maxLength: 16,
                        keyboardType: 'phone-pad',
                        returnKeyType: 'next',
                        onSubmitEditing: e => {
                          this.MobileField.focus();
                        },
                      }}
                      format={formatMobile}
                      parse={parseMobile}
                      component={TextField}
                      validate={[required]}
                    />
                    <Field
                      name="mobile"
                      style={styles.containerLabel}
                      props={{
                        textFieldRef: el => (this.MobileField = el),
                        label: 'Telefone celular (com ddd)*',
                        placeholder: '(00) 9999 9999',
                        maxLength: 16,
                        keyboardType: 'phone-pad',
                      }}
                      format={formatMobile}
                      parse={parseMobile}
                      component={TextField}
                      validate={[required, mobileValidator]}
                    />
                    <View>
                      <View style={styles.containerInformation}>
                        <VoudText style={styles.textInformation}>
                          (*) Campos de preenchimento obrigatório.
                        </VoudText>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.containerHeaderDelivery}>
                  <InfoListItem itemContent="Opções de entrega" isHeader badge={0} />
                </View>
              </View>
              <View style={styles.containerDelivery}>
                <TouchableOpacity onPress={this._handlerDeliveryResidence}>
                  <View style={styleDeliveryResidence}>
                    <VoudText style={styleTextDeliveryResidence}>Entrega em domicílio</VoudText>
                    <VoudText style={styleTextDeliveryResidence}>
                      {`(R$ ${requestCard.price})`}
                    </VoudText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._handlerDeliveryWithdrawal}>
                  <View style={styleDeliveryWithdrawal}>
                    <VoudText style={styleTextDeliveryWithdrawal}>Retirada do cartão</VoudText>
                    <VoudText style={styleTextDeliveryWithdrawal}>(Gratuita)</VoudText>
                  </View>
                </TouchableOpacity>
              </View>
              {!isDeliveryResidence && isDeliveryWithdrawal && (
                <Animated.View style={{ opacity: this.animationDeliveryWithdrawal }}>
                  <Field
                    name="localWithdrawal"
                    style={{ marginHorizontal: 16 }}
                    props={{
                      editable: false,
                      label: 'Local de retirada',
                      onPressOverlay: () => {
                        this.props.dispatch(
                          navigateToRoute(routeNames.SELECT_STATE_DELIVERY_DIALOG, {
                            reduxFormName,
                            localWithdrawal,
                          })
                        );
                      },
                      right: () => <Icon name="arrow-drop-down" size={24} color={colors.GRAY} />,
                    }}
                    component={TextField}
                  />
                </Animated.View>
              )}
              {isDeliveryResidence && !isDeliveryWithdrawal && (
                <Animated.View
                  style={[
                    styles.containerAddressDelivery,
                    { opacity: this.animationDeliveryResidence },
                  ]}
                >
                  <VoudText style={styles.descriptionAddress}>
                    O cartão será enviado para o endereço de{' '}
                  </VoudText>
                  <VoudText style={styles.descriptionAddress}>entrega selecionado acima</VoudText>
                </Animated.View>
              )}
              <View
                style={{
                  marginTop: 23,
                  marginHorizontal: 16,
                  marginBottom: 14,
                }}
              >
                <Button buttonStyle={{ height: 36 }} onPress={this._submit} disabled={!valid}>
                  SOLICITAR CARTÃO BOM COMUM
                </Button>
              </View>
            </KeyboardDismissView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

// Redux
const mapStateToProps = state => {
  const mobileFormat = String(state.profile.data.mobile).substring(
    3,
    state.profile.data.mobile.length
  );

  let mainDelivery = '';
  let stateDelivery = '';
  let cityDelivery = '';
  let zipDelivery = '';
  let numberDelivery = '';
  let districtDelivery = '';
  let supplementDelivery = '';

  let main = '';
  let stateAddress = '';
  let city = '';
  let zipCode = '';
  let number = '';
  let district = '';
  let supplement = '';

  if (state.profile.data.shippingAddress) {
    mainDelivery = state.profile.data.shippingAddress.main;
    stateDelivery = state.profile.data.shippingAddress.state;
    cityDelivery = state.profile.data.shippingAddress.city;
    zipDelivery = state.profile.data.shippingAddress.zipCode;
    numberDelivery = state.profile.data.shippingAddress.number;
    districtDelivery = state.profile.data.shippingAddress.district;
    supplementDelivery = state.profile.data.shippingAddress.supplement;
  }
  if (state.profile.data.address) {
    main = state.profile.data.address.main;
    stateAddress = state.profile.data.address.state;
    city = state.profile.data.address.city;
    zipCode = state.profile.data.address.zipCode;
    number = state.profile.data.address.number;
    district = state.profile.data.address.district;
    supplement = state.profile.data.address.supplement;
  }

  return {
    initialValues: {
      motherName: state.profile.data.motherName,
      mobile: mobileFormat,
      main,
      state: stateAddress,
      city,
      zipCode,
      number,
      district,
      supplement,
      rg: null,
      phoneNumber: null,
      mainDelivery,
      stateDelivery,
      cityDelivery,
      zipDelivery,
      numberDelivery,
      districtDelivery,
      supplementDelivery,
    },
    userData: state.profile.data,
    personalDataAlertCount: getPersonalDataAlertCount(state),
    personalDataValidation: getPersonalDataValidation(state),
    hasProfileAlerts: getHasProfileAlerts(state),
    requestCard: state.requestCard,
  };
};

export const RequestCard = connect(mapStateToProps)(
  reduxForm({ form: reduxFormName, destroyOnUnmount: false })(RequestCardView)
);
