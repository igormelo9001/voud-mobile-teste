// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import {
  Keyboard,
  StyleSheet,
  View
} from 'react-native';

// VouD imports
import Button from '../../../components/Button';
import TextField from '../../../components/TextField';
import MessageBox from '../../../components/MessageBox';
import Icon from '../../../components/Icon';
import { required, cepValidator } from '../../../utils/validators';
import { formatCep, parseCep, formatNumeric, parseNumeric, formatExcludeNumbers, parseExcludeNumbers } from '../../../utils/parsers-formaters';
import { colors } from '../../../styles';
import { navigateToRoute } from '../../../redux/nav';
import { routeNames } from '../../../shared/route-names';
import { clearReduxForm } from '../../../utils/redux-form-util';

import fetchViaCepService from "../../../utils/via_cpf";


export const reduxFormName = 'editAddress';

// component
class EditShippingAddressForm extends Component {

  componentWillUnmount() {
    clearReduxForm(this.props.dispatch, reduxFormName);
  }

  _submit = () => {
    const { valid, ui, handleSubmit, onSubmit } = this.props;
    Keyboard.dismiss();

    if (valid && !ui.isFetching)
      handleSubmit(onSubmit)();
  };

  _onSubmitEditZipCode = () => {
    this.MainField.focus();
  }

  _onChangeZipCode = (value) =>
  {
    const { change } = this.props;
    if (value.length == 9) {
      var promise = fetchViaCepService(value.replace('-',''));
      promise.then(data => {
        change('state', data.state);
        change('city', data.city);
        change('district', data.neighborhood);
        change('main', data.street);
      });

    }
  }

  render() {
    const { style, ui, valid } = this.props;
    return (
      <View style={style}>
        <View style={styles.row}>
          <View style={styles.firstCol}>
            <Field
              name="zipCode"
              props={{
                textFieldRef: el => this.ZipCodeField = el,
                label: 'CEP',
                maxLength: 9,
                keyboardType: 'numeric',
                returnKeyType: 'next',
                onSubmitEditing: this._onSubmitEditZipCode
              }}
              onChange={this._onChangeZipCode}
              format={formatCep}
              parse={parseCep}
              component={TextField}
              validate={[required, cepValidator]}
            />
          </View>
          <View style={styles.col} />
        </View>
        <Field
          name="main"
          props={{
            textFieldRef: el => this.MainField = el,
            label: 'Endereço (sem número)',
            returnKeyType: 'next',
            maxLength: 100,
            onSubmitEditing: (e) => {
              this.NumberField.focus();
            }
          }}
          format={formatExcludeNumbers}
          parse={parseExcludeNumbers}
          component={TextField}
          validate={required}
        />
        <View style={styles.row}>
          <View style={styles.firstCol}>
            <Field
              name="number"
              props={{
                textFieldRef: el => this.NumberField = el,
                label: 'Número',
                keyboardType: 'numeric',
                returnKeyType: 'next',
                onSubmitEditing: (e) => {
                  this.SupplementField.focus();
                }
              }}
              format={formatNumeric}
              parse={parseNumeric}
              component={TextField}
              validate={required}
            />
          </View>
          <View style={styles.col}>
            <Field
              name="supplement"
              props={{
                textFieldRef: el => this.SupplementField = el,
                label: 'Complemento (opcional)',
                returnKeyType: 'next',
                onSubmitEditing: (e) => {
                  this.DistrictField.focus();
                }
              }}
              component={TextField}
            />
          </View>
        </View>
        <Field
          name="district"
          props={{
            textFieldRef: el => this.DistrictField = el,
            label: 'Bairro',
            returnKeyType: 'next',
            onSubmitEditing: (e) => {
              this.CityField.focus();
            }
          }}
          format={formatExcludeNumbers}
          parse={parseExcludeNumbers}
          component={TextField}
          validate={required}
        />
        <Field
          name="city"
          props={{
            textFieldRef: el => this.CityField = el,
            label: 'Cidade',
            returnKeyType: 'next',
            onSubmitEditing: (e) => { Keyboard.dismiss(); },
          }}
          format={formatExcludeNumbers}
          parse={parseExcludeNumbers}
          component={TextField}
          validate={required}
        />
        <Field
          name="state"
          props={{
            editable: false,
            label: 'Estado',
            onPressOverlay: () => {
              this.props.dispatch(
                navigateToRoute(routeNames.SELECT_STATE_DIALOG, { reduxFormName })
              );
            },
            right: () => (
              <Icon
                name='arrow-drop-down'
                size={24}
                color={colors.GRAY}
              />
            )
          }}
          component={TextField}
          validate={required}
        />
        {ui.error ?
          <MessageBox
            message={ui.error}
            style={styles.errorMessage}
          /> :
          null
        }
        <Button
          onPress={this._submit}
          style={styles.button}
          disabled={!valid || ui.isFetching}
        >
          Salvar
        </Button>
      </View>
    );
  }
}

// styles
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  col: {
    flex: 1
  },
  firstCol: {
    flex: 1,
    marginRight: 16
  },
  errorMessage: {
    marginTop: 16
  },
  button: {
    marginTop: 24
  },
  cancel: {
    marginTop: 16
  }
});

// Redux
const mapStateToProps = (state) => {
  return {
    initialValues: {
      name: state.profile.data.name,
      mobile: state.profile.data.mobile,
      email: state.profile.data.email,
      main: state.profile.data.shippingAddress ?  state.profile.data.shippingAddress.main : "",
      state: state.profile.data.shippingAddress ? state.profile.data.shippingAddress.state : "",
      city: state.profile.data.shippingAddress ? state.profile.data.shippingAddress.city : "",
      zipCode: state.profile.data.shippingAddress ? state.profile.data.shippingAddress.zipCode : "",
      number: state.profile.data.shippingAddress ? state.profile.data.shippingAddress.number : "",
      district: state.profile.data.shippingAddress ? state.profile.data.shippingAddress.district : "",
      supplement: state.profile.data.shippingAddress ? state.profile.data.shippingAddress.supplement : "",
    }
  };
};

export default connect(mapStateToProps)(reduxForm({ form: reduxFormName, destroyOnUnmount: false })(EditShippingAddressForm));
