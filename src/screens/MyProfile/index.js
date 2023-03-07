// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Moment from 'moment';

import { View, ScrollView, StyleSheet } from 'react-native';

// VouD imports
import Header, { headerActionTypes } from '../../components/Header';
import { navigateToRoute } from '../../redux/nav';
import InfoListItem from '../../components/InfoList/InfoListItem';
import CheckBox from '../../components/CheckBox';
import BrandText from '../../components/BrandText';
import Icon from '../../components/Icon';
import { colors } from '../../styles/constants';
import ProfileInfoItem from './ProfileInfoItem';
import {
  getHasProfileAlerts,
  getSecurityDataAlertCount,
  getPersonalDataAlertCount,
  getPersonalDataValidation,
} from '../../redux/selectors';
import { fetchEditEmailPreferences } from '../../redux/profile-edit';
import { formatCep, formatCpf } from '../../utils/parsers-formaters';
import { routeNames } from '../../shared/route-names';
import { formatMobileNoIntl } from '../../utils/parsers-formaters';
import { capitalizeFirstLetter } from '../../utils/string-util';
import TouchableListItem from '../../components/TouchableListItem';
import { viewTerms, viewPrivacyPolicy } from '../../flows/usage-terms/utils';
import { getPaddingForNotch } from '../../utils/is-iphone-with-notch';

const requiredPersonalDataFields = ['sobrenome', 'data de nascimento'];
const aboutItems = {
  USAGE_TERMS: { name: 'Termos de uso' },
  PRIVACY_POLICY: { name: 'Política de privacidade' },
};

// Screen component
class MyProfileView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allowSendMail: props.userData.isAllowSendEmail,
    };
  }

  componentWillUnmount() {
    const { userData } = this.props;

    // clear timeout if it exists
    if (this.changeEmailPreferencesDelay) clearTimeout(this.changeEmailPreferencesDelay);

    // update email preferences if needed
    if (userData.allowSendMail && this.state.allowSendMail !== userData.allowSendMail)
      this._fetchEmailPreferences(this.state.allowSendMail);
  }

  _close = () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.back());
  };

  _navigate = (route, params) => {
    this.props.dispatch(navigateToRoute(route, params));
  };

  _changeEmailPreferences = () => {
    this.setState({
      allowSendMail: !this.state.allowSendMail,
    });

    // wait 2s before actually request the update
    this.changeEmailPreferencesDelay = setTimeout(() => {
      this._fetchEmailPreferences(this.state.allowSendMail);
    }, 2000);
  };

  _fetchEmailPreferences = isAllowSendEmail => {
    const { name, mobile, email } = this.props.userData;
    this.props.dispatch(fetchEditEmailPreferences(name, mobile, email, isAllowSendEmail));
  };

  _getAddressInfo = () => {
    const { address } = this.props.userData;

    if (address && address.main) {
      const addressInfo = [address.main];
      if (address.number) addressInfo[0] += `, ${  address.number}`;
      if (address.supplement) addressInfo[0] += `, ${  address.supplement}`;

      let line2;
      if (address.district) line2 = address.district;
      if (address.zipCode)
        line2 = line2 ? `${line2  }   ${  formatCep(address.zipCode)}` : formatCep(address.zipCode);
      if (line2) addressInfo.push(line2);

      let line3;
      if (address.city) line3 = address.city;
      if (address.state) line3 = line3 ? `${line3  } - ${  address.state}` : address.state;
      if (line3) addressInfo.push(line3);

      return addressInfo;
    }
    return 'Não informado';
  };

  _getPersonalDataInfo = () => {
    const {
      userData: { name, lastName, birthDate, cpf, motherName },
      personalDataValidation,
    } = this.props;
    const personalDataInfo = [
      `${name}${personalDataValidation.isValidLastName ? ` ${lastName}` : ''}`,
    ];

    // if (motherName) personalDataInfo.push(`Nome da mãe: ${motherName}`);
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

  _getShippingAddressInfo = () => {
    const { shippingAddress } = this.props.userData;

    if (shippingAddress && shippingAddress.main) {
      const shippingAddressInfo = [shippingAddress.main];
      if (shippingAddress.number) shippingAddressInfo[0] += `, ${  shippingAddress.number}`;
      if (shippingAddress.supplement) shippingAddressInfo[0] += `, ${  shippingAddress.supplement}`;

      let line2;
      if (shippingAddress.district) line2 = shippingAddress.district;
      if (shippingAddress.zipCode)
        line2 = line2
          ? `${line2  }   ${  formatCep(shippingAddress.zipCode)}`
          : formatCep(shippingAddress.zipCode);
      if (line2) shippingAddressInfo.push(line2);

      let line3;
      if (shippingAddress.city) line3 = shippingAddress.city;
      if (shippingAddress.state)
        line3 = line3 ? `${line3  } - ${  shippingAddress.state}` : shippingAddress.state;
      if (line3) shippingAddressInfo.push(line3);

      return shippingAddressInfo;
    }
    return 'Não informado';
  };

  render() {
    const {
      dispatch,
      userData,
      securityDataAlertCount,
      personalDataAlertCount,
      hasProfileAlerts,
    } = this.props;

    return (
      <View style={styles.mainContainer}>
        <Header
          title="Meu perfil"
          left={{
            type: headerActionTypes.CLOSE,
            onPress: this._close,
          }}
        />
        <ScrollView>
          {hasProfileAlerts && (
            <View style={styles.securityAlert}>
              <BrandText style={styles.alertText}>
                Você possui pendências no seu cadastro. Verifique seus dados para poder realizar a
                compra de créditos no VouD.
              </BrandText>
            </View>
          )}
          <InfoListItem
            itemContent="Para sua segurança"
            isHeader
            badge={securityDataAlertCount}
          />
          <View style={styles.groupInfoContainer}>
            <ProfileInfoItem
              mainInfo="Senha cadastrada"
              subInfo="Toque para alterar"
              onPress={() => this._navigate(routeNames.EDIT_PASSWORD)}
              left={() => <Icon style={styles.itemIcon} name="lock" color={colors.BRAND_PRIMARY} />}
              right={() => (
                <Icon
                  style={styles.itemIcon}
                  name="checkmark-circle-outline"
                  color={colors.BRAND_SUCCESS}
                />
              )}
            />
            <ProfileInfoItem
              mainInfo={userData.email}
              subInfo={userData.isValidEmail ? 'E-mail confirmado' : 'Aguardando confirmação'}
              onPress={() => this._navigate(routeNames.EDIT_EMAIL)}
              left={() => <Icon style={styles.itemIcon} name="mail" color={colors.BRAND_PRIMARY} />}
              right={() =>
                userData.isValidEmail ? (
                  <Icon
                    style={styles.itemIcon}
                    name="checkmark-circle-outline"
                    color={colors.BRAND_SUCCESS}
                  />
                ) : (
                  <Icon style={styles.itemIcon} name="alert" color={colors.BRAND_ERROR} />
                )
              }
            />
            <ProfileInfoItem
              mainInfo={formatMobileNoIntl(userData.mobile)}
              subInfo={userData.isValidMobile ? 'Celular confirmado' : 'Aguardando confirmação'}
              onPress={() => this._navigate(routeNames.EDIT_MOBILE)}
              left={() => (
                <Icon style={styles.itemIcon} name="mobile" color={colors.BRAND_PRIMARY} />
              )}
              right={() =>
                userData.isValidMobile ? (
                  <Icon
                    style={styles.itemIcon}
                    name="checkmark-circle-outline"
                    color={colors.BRAND_SUCCESS}
                  />
                ) : (
                  <Icon style={styles.itemIcon} name="alert" color={colors.BRAND_ERROR} />
                )
              }
            />
          </View>
          <InfoListItem itemContent="Dados pessoais" isHeader badge={personalDataAlertCount} />
          <View style={styles.groupInfoContainer}>
            <ProfileInfoItem
              mainInfo={this._getPersonalDataInfo()}
              mainTextStyle={styles.personalDataText}
              onPress={() => {}}
              // onPress={() => this._navigate(routeNames.EDIT_PERSONAL_DATA)}
              // right={() =>
              //   <Icon
              //       name='md-edit'
              //       size={24}
              //       color={colors.GRAY_LIGHT}
              //   />
              // }
            />
            {personalDataAlertCount > 0 && (
              <BrandText style={styles.personalDataErrorText}>
                {this._getPersonalDataErrorText()}
              </BrandText>
            )}
          </View>
          <InfoListItem itemContent="Conteúdo VouD" isHeader />
          <View style={styles.groupInfoContainer}>
            <View style={styles.checkboxWrapper}>
              <CheckBox checked={this.state.allowSendMail} onPress={this._changeEmailPreferences}>
                Desejo receber informações sobre as novidades do VouD por email
              </CheckBox>
            </View>
          </View>
          <InfoListItem itemContent="Endereço" isHeader />
          <View style={styles.groupInfoContainer}>
            <ProfileInfoItem
              mainInfo={this._getAddressInfo()}
              onPress={() => this._navigate(routeNames.EDIT_ADDRESS, 'address')}
              right={() => <Icon name="md-edit" size={24} color={colors.GRAY_LIGHT} />}
            />
          </View>
          <InfoListItem itemContent="Endereço de entrega" isHeader />
          <View style={styles.groupInfoContainer}>
            <ProfileInfoItem
              mainInfo={this._getShippingAddressInfo()}
              onPress={() => this._navigate(routeNames.EDIT_ADDRESS, 'shippingAddress')}
              right={() => <Icon name="md-edit" size={24} color={colors.GRAY_LIGHT} />}
            />
          </View>

          <InfoListItem itemContent="Sobre" isHeader />
          {/* <View style={styles.groupInfoContainer}>
          <ProfileInfoItem
              mainInfo={'Informações do App'}
              onPress={() => this._navigate(routeNames.ABOUT)}
            />
          </View> */}
          <TouchableListItem item={aboutItems.USAGE_TERMS} onPress={() => viewTerms(dispatch)} />
          <TouchableListItem
            item={aboutItems.PRIVACY_POLICY}
            onPress={() => viewPrivacyPolicy(dispatch)}
          />
        </ScrollView>
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: getPaddingForNotch(),
  },
  groupInfoContainer: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  checkboxWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  securityAlert: {
    padding: 16,
    backgroundColor: colors.BRAND_ERROR,
  },
  alertText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
  },
  itemIcon: {
    width: 24,
    fontSize: 24,
    textAlign: 'center',
  },
  personalDataText: {
    lineHeight: 24,
  },
  personalDataErrorText: {
    paddingHorizontal: 16,
    color: colors.BRAND_ERROR,
    fontSize: 14,
    lineHeight: 20,
  },
});

// Redux
const mapStateToProps = state => {
  return {
    userData: state.profile.data,
    securityDataAlertCount: getSecurityDataAlertCount(state),
    personalDataAlertCount: getPersonalDataAlertCount(state),
    personalDataValidation: getPersonalDataValidation(state),
    hasProfileAlerts: getHasProfileAlerts(state),
  };
};

export const MyProfile = connect(mapStateToProps)(MyProfileView);

// export other screens from group
export * from './EditPersonalData';
export * from './EditPassword';
export * from './EditEmail';
export * from './EditMobile';
export * from './EditAddress';
