// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Keyboard, View, Image } from 'react-native';
import Moment from 'moment';

// VouD imports
import Button from '../../../../components/Button';
import Icon from '../../../../components/Icon';
import TextField from '../../../../components/TextField';
import MessageBox from '../../../../components/MessageBox';
import { colors } from '../../../../styles';
import { required, createBirthDateValidator } from '../../../../utils/validators';
import {
  formatCpf,
  formatDate,
  parseDate,
  formatExcludeNumbers,
  parseExcludeNumbers,
} from '../../../../utils/parsers-formaters';
import { clearReduxForm } from '../../../../utils/redux-form-util';
import BrandText from '../../../../components/BrandText';
import styles from './style';

const reduxFormName = 'userData';

// component
class EditUserDataForm extends Component {
  componentWillMount() {
    this.birthDateValidator = createBirthDateValidator('DDMMYYYY');
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    clearReduxForm(dispatch, reduxFormName);
  }

  submit = () => {
    const { valid, ui, handleSubmit, onSubmit } = this.props;
    Keyboard.dismiss();

    if (valid && !ui.isFetching) handleSubmit(onSubmit)();
  };

  render() {
    const { style, valid, ui } = this.props;
    return (
      <View style={style}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 24,
            marginBottom: 24,
          }}
        >
          <BrandText style={{ fontSize: 14, color: '#393939' }}>
            Precisamos que atualize os seus dados
          </BrandText>
          <BrandText style={{ fontSize: 14, color: '#393939' }}>
            cadastrais. Verifique as informações abaixo.
          </BrandText>
        </View>
        <Field
          name="cpf"
          props={{
            label: 'CPF',
            editable: false,
            isPrimary: false,
            right: () => <Icon name="lock" size={24} color={colors.GRAY_LIGHT} />,
          }}
          format={formatCpf}
          component={TextField}
        />
        <Field
          name="name"
          props={{
            label: 'Nome',
            maxLength: 20,
            returnKeyType: 'next',
            onSubmitEditing: () => {
              this.LastNameField.focus();
            },
          }}
          format={formatExcludeNumbers}
          parse={parseExcludeNumbers}
          component={TextField}
          validate={[required]}
        />
        <Field
          name="lastName"
          props={{
            textFieldRef: el => (this.LastNameField = el),
            label: 'Sobrenome',
            maxLength: 60,
            returnKeyType: 'next',
            onSubmitEditing: () => {
              this.BirthDateField.focus();
            },
          }}
          format={formatExcludeNumbers}
          parse={parseExcludeNumbers}
          component={TextField}
          validate={[required]}
        />
        <Field
          name="birthDate"
          props={{
            placeholder: 'dd/mm/aaaa',
            keyboardType: 'numeric',
            textFieldRef: el => (this.BirthDateField = el),
            label: 'Data de nascimento',
            maxLength: 10,
            onSubmitEditing: () => {
              Keyboard.dismiss();
            },
          }}
          format={formatDate}
          parse={parseDate}
          component={TextField}
          validate={[required, this.birthDateValidator]}
        />

        {ui.error ? <MessageBox message={ui.error} style={styles.errorMessage} /> : null}
        <Button onPress={this.submit} style={styles.button} disabled={!valid || ui.isFetching}>
          Confirmar
        </Button>
      </View>
    );
  }
}

// Redux
const mapStateToProps = state => {
  return {
    initialValues: {
      name: state.profile.data.name,
      lastName: state.profile.data.lastName,
      birthDate: state.profile.data.birthDate
        ? Moment(state.profile.data.birthDate).format('DDMMYYYY')
        : '',
      // name: '',
      // lastName: '',
      // birthDate: '',
      cpf: state.profile.data.cpf,
      mobile: state.profile.data.mobile,
      email: state.profile.data.email,
      motherName: state.profile.data.motherName,
    },
  };
};

export default connect(mapStateToProps)(
  reduxForm({ form: reduxFormName, destroyOnUnmount: false })(EditUserDataForm)
);
