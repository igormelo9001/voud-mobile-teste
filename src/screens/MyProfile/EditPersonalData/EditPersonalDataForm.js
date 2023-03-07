// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import {
  Keyboard,
  StyleSheet,
  View
} from 'react-native';
import Moment from 'moment';

// VouD imports
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import TextField from '../../../components/TextField';
import MessageBox from '../../../components/MessageBox';
import { colors } from '../../../styles';
import { required, createBirthDateValidator } from '../../../utils/validators';
import { formatCpf, formatDate, parseDate, formatExcludeNumbers, parseExcludeNumbers } from '../../../utils/parsers-formaters';
import { clearReduxForm } from '../../../utils/redux-form-util';

const reduxFormName = 'personalData';

// component
class EditPersonalDataForm extends Component {

  componentWillMount() {
    this._birthDateValidator = createBirthDateValidator('DDMMYYYY');
  }

  componentWillUnmount() {
    clearReduxForm(this.props.dispatch, reduxFormName);
  }

  _submit = () => {
    const { valid, ui, handleSubmit, onSubmit } = this.props;
    Keyboard.dismiss();

    if (valid && !ui.isFetching)
      handleSubmit(onSubmit)();
  };

  render() {
    const { style, valid, ui } = this.props;
    return (
      <View style={style}>
        <Field
          name="name"
          props={{
            label: 'Nome',
            maxLength: 20,
            returnKeyType: 'next',
            onSubmitEditing: () => { this.LastNameField.focus(); },
          }}
          format={formatExcludeNumbers}
          parse={parseExcludeNumbers}
          component={TextField}
          validate={[required]}
        />
        <Field
          name="lastName"
          props={{
            textFieldRef: el => this.LastNameField = el,
            label: 'Sobrenome',
            maxLength: 60,
            returnKeyType: 'next',
            onSubmitEditing: () => { this.BirthDateField.focus(); },
          }}
          format={formatExcludeNumbers}
          parse={parseExcludeNumbers}
          component={TextField}
          validate={[required]}
        />
        {/* <Field
          name="motherName"
          props={{
            textFieldRef: el => this.MotherName = el,
            label: 'Nome da mãe',
            maxLength: 60,
            returnKeyType: 'next',
            onSubmitEditing: () => { this.BirthDateField.focus(); },
          }}
          format={formatExcludeNumbers}
          parse={parseExcludeNumbers}
          component={TextField}
        /> */}
        <Field
          name="birthDate"
          props={{
            placeholder: 'dd/mm/aaaa',
            keyboardType: 'numeric',
            textFieldRef: el => this.BirthDateField = el,
            label: 'Data de nascimento',
            maxLength: 10,
            onSubmitEditing: () => { Keyboard.dismiss(); },
          }}
          format={formatDate}
          parse={parseDate}
          component={TextField}
          validate={[required, this._birthDateValidator]}
        />
        <Field
          name="cpf"
          props={{
            label: 'CPF',
            editable: false,
            isPrimary: false,
            right: () => (
              <Icon
                name='lock'
                size={24}
                color={colors.GRAY_LIGHT}
              />
            )
          }}
          format={formatCpf}
          component={TextField}
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
  text: {
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
    color: colors.GRAY
  },
  errorMessage: {
    marginTop: 16
  },
  button: {
    marginTop: 24
  }
});

// Redux
const mapStateToProps = (state) => {
  return {
    initialValues: {
      name: state.profile.data.name,
      lastName: state.profile.data.lastName,
      birthDate: state.profile.data.birthDate ? Moment(state.profile.data.birthDate).format('DDMMYYYY') : '',
      cpf: state.profile.data.cpf,
      mobile: state.profile.data.mobile,
      email: state.profile.data.email,
      motherName: state.profile.data.motherName
    }
  };
};

export default connect(mapStateToProps)(reduxForm({ form: reduxFormName, destroyOnUnmount: false })(EditPersonalDataForm));
