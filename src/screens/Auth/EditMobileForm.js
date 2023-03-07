// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Keyboard, StyleSheet } from 'react-native';

// VouD imports
import Button from '../../components/Button';
import BrandText from '../../components/BrandText';
import TextField from '../../components/TextField';
import MessageBox from '../../components/MessageBox';
import TouchableText from '../../components/TouchableText';
import { colors } from '../../styles';
import FadeInView from '../../components/FadeInView';
import { formatMobile, parseMobile, formatMobileNoIntl } from '../../utils/parsers-formaters';
import { required, mobileValidator } from '../../utils/validators';
import { editMobileClear } from '../../redux/profile-edit';
import { clearReduxForm } from '../../utils/redux-form-util';

// consts
const reduxFormName = 'editMobile';

// component
class EditMobile extends Component {

  componentWillUnmount() {
    this.props.dispatch(editMobileClear());

    clearReduxForm(this.props.dispatch, reduxFormName);
  }

  _submit = () => {
    const { handleSubmit, onSubmit, ui, valid } = this.props;

    Keyboard.dismiss();

    if (valid && !ui.isFetching)
      handleSubmit(onSubmit)();
  };

  render() {
    const { style, ui, valid } = this.props;

    return (
      <FadeInView style={style}>
        <BrandText style={styles.title}>
          Digite um telefone válido para confirmação.
        </BrandText>
        <Field
          name="mobile"
          props={{
            isPrimary: true,
            label: 'Celular (com ddd)*',
            placeholder: '(00) 9999 9999',
            keyboardType: 'phone-pad',
          }}
          component={TextField}
          parse={parseMobile}
          format={formatMobile}
          validate={[required, mobileValidator]}
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
          Alterar
        </Button>
        <TouchableText
          onPress={this.props.onCancel}
          style={styles.button}
          color={colors.BRAND_SECONDARY}
        >
          Cancelar
        </TouchableText>
      </FadeInView>
    )
  }
}

// Styles
const styles = StyleSheet.create({
  title: {
    marginTop: 40,
    marginBottom: 24,
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    color: 'white',
  },
  text: {
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: 'white'
  },
  button: {
    marginTop: 16
  },
  errorMessage: {
    marginTop: 16,
  },
});

// Redux
const mapStateToProps = (state) => {
  return {
    initialValues: {
      name: state.profile.data.name,
      mobile: parseMobile(formatMobileNoIntl(state.profile.data.mobile)),
      email: state.profile.data.email,
    }
  };
};

export default connect(mapStateToProps)(reduxForm({ form: reduxFormName, destroyOnUnmount: false })(EditMobile));
