// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { formValueSelector, change } from 'redux-form';

// VouD Imports
import TouchableText from '../../components/TouchableText';
import Dialog from '../../components/Dialog';
import SystemText from '../../components/SystemText';
import { colors } from '../../styles';
import { formatMobile } from '../../utils/parsers-formaters';
import { reduxFormName } from './RechargeForm';
import { fetchCarriers } from '../../redux/phone-recharge';

class ConfirmPhoneDialogView extends Component {
  _dismiss = () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.back());
  };

  _confirmPhone = () => {
    const { dispatch, phoneNumber } = this.props;

    dispatch(change(reduxFormName, 'phoneIsConfirmed', true));
    dispatch(fetchCarriers(phoneNumber));
    this._dismiss();
  }

  render() {
    return (
      <View style={styles.container}>
        <Dialog noPadding onDismiss={this._dismiss}>
          <View style={styles.textContainer}>
            <SystemText style={styles.phoneConfirmationText}>Confirme o telefone que você gostaria de fazer recarga:</SystemText>
            <SystemText style={styles.phoneNumber}>
              {formatMobile(this.props.phoneNumber)}
            </SystemText>
          </View>

          <View style={styles.actions}>
            <TouchableText
              onPress={this._dismiss}
              color={colors.GRAY}
            >
              Cancelar
            </TouchableText>
            <TouchableText
              style={styles.confirmText}
              onPress={this._confirmPhone}
              color={colors.BRAND_PRIMARY}
            >
              Confirmar
            </TouchableText>
          </View>
        </Dialog>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    padding: 24,
  },
  phoneConfirmationText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.GRAY,
  },
  phoneNumber: {
    fontSize: 30,
    marginTop: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: colors.GRAY_LIGHTER,
  },
  confirmText: {
    marginLeft: 16,
  },
})

function mapStateToProps(state) {
  return {
    phoneNumber: rechargePhoneFormValueSelector(state, 'phoneNumber'),
  };
}

const rechargePhoneFormValueSelector = formValueSelector(reduxFormName);

export const ConfirmPhoneDialog = connect(mapStateToProps)(ConfirmPhoneDialogView);