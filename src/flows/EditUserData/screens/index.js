// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { ScrollView, View, BackHandler, Image, TouchableOpacity } from 'react-native';

// VouD imports
import Header, { headerActionTypes } from '../../../components/Header';
import KeyboardDismissView from '../../../components/KeyboardDismissView';
import LoadMask from '../../../components/LoadMask';
import { getEditUserDataUI } from '../../../redux/selectors';
import BrandText from '../../../components/BrandText';
import { editPersonalDataClear, fetchEditPersonalData, setEditCountAttempt } from '../store';

import { GATrackEvent, GAEventParams } from '../../../shared/analytics';

import styles from './style';

// Component imports
import EditUserDataForm from '../components/EditUserDataForm';
import { logout } from '../../../redux/login';
import Icon from '../../../components/Icon';

import { removeAccent } from '../../../utils/parsers-formaters';

const imageVerify = require('../image/imageVerify.png');

// Component
class EditUserDataView extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(editPersonalDataClear());
    dispatch(setEditCountAttempt(1));
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    // dispatch(editPersonalDataClear());
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  _backHandler = () => {
    const { dispatch } = this.props;

    dispatch(logout());
  };

  back = () => {
    const { dispatch } = this.props;
    dispatch(logout());
  };

  submit = ({ name, lastName, birthDate, mobile, email, motherName }) => {
    const {
      categories: { FORM },
      actions: { SUBMIT },
      labels: { SUBMIT_FORCE_UPDATE_PROFILE },
    } = GAEventParams;
    GATrackEvent(FORM, SUBMIT, SUBMIT_FORCE_UPDATE_PROFILE);

    const {
      dispatch,
      ui: { countAttempt },
    } = this.props;

    dispatch(
      fetchEditPersonalData(
        removeAccent(name),
        lastName,
        birthDate,
        mobile,
        email,
        motherName,
        countAttempt
      )
    );
  };

  render() {
    const { ui } = this.props;
    return (
      <View style={styles.container}>
        <Header
          title="Atualize seus dados"
          left={{
            type: headerActionTypes.BACK,
            onPress: this.back,
          }}
          isRequestCard
        />
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always">
          <KeyboardDismissView>
            <View style={styles.headerContainer}>
              <Image source={imageVerify} />
            </View>
            <EditUserDataForm ui={ui} onSubmit={this.submit} style={styles.content} />
          </KeyboardDismissView>
        </ScrollView>
        {ui.isFetching && <LoadMask message="Atualizando dados pessoais" />}
      </View>
    );
  }
}

// Redux
const mapStateToProps = state => {
  return {
    ui: getEditUserDataUI(state),
    forceUpdateProfile: state.profile.data.forceUpdateProfile,
  };
};

export const EditUserData = connect(mapStateToProps)(EditUserDataView);
