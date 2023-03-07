// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import {
  Keyboard,
  View,
  StyleSheet
} from 'react-native';

import Button from '../../../components/Button';
import TouchableText from '../../../components/TouchableText';
import MessageBox from '../../../components/MessageBox';
import TextField from '../../../components/TextField';
import { colors } from '../../../styles';
import { required } from '../../../utils/validators';
import { formatAlphanumeric, parseAlphanumeric } from '../../../utils/parsers-formaters';
import { getCurrentTransportCardNick } from '../../../redux/selectors';
import { clearReduxForm } from '../../../utils/redux-form-util';

const reduxFormName = 'editCard';

// component
class EditCardForm extends Component {

  componentWillUnmount() {
    clearReduxForm(this.props.dispatch, reduxFormName);
  }

  _submit = () => {
    const { handleSubmit, onSubmit, ui, valid } = this.props;
    Keyboard.dismiss();

    if (valid && !ui.isFetching)
      handleSubmit(onSubmit)();
  };

  render() {
    const { style, onRemove, ui, valid } = this.props;
    return (
      <View style={style}>
        <Field
          name="nick"
          props={{
            textFieldRef: el => this.NickField = el,
            label: 'Apelido do cartão',
            onSubmitEditing: () => { Keyboard.dismiss(); },
            maxLength: 40
          }}
          format={formatAlphanumeric}
          parse={parseAlphanumeric}
          component={TextField}
          validate={[required]}
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
        <TouchableText
          onPress={onRemove}
          style={styles.remove}
          color={colors.CARD_VT}
        >
          Remover cartão
        </TouchableText>
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  errorMessage: {
    marginTop: 16
  },
  button: {
    marginTop: 24
  },
  remove: {
    marginTop: 24
  }
});

// Redux
const mapStateToProps = (state) => {
  return {
    initialValues: {
      nick: getCurrentTransportCardNick(state)
    }
  };
};

export default connect(mapStateToProps)(reduxForm({ form: reduxFormName, destroyOnUnmount: false })(EditCardForm));
