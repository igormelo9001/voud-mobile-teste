// NPM imports
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import {
    BackHandler,
    View,
    ScrollView,
    StyleSheet
} from 'react-native';

// VouD imports
import Header, { headerActionTypes } from '../../../components/Header';
import KeyboardDismissView from '../../../components/KeyboardDismissView';
import Progress from '../../../components/Progress';
import LoadMask from '../../../components/LoadMask';
import {
    mobileEditingSteps,
    toMobileEdit,
    cancelMobileEdit,
    fetchEditMobile
} from '../../../redux/profile-edit';
import {
    fetchConfirmMobile,
    fetchResendMobileConfirmation
} from '../../../redux/register';
import {
    getEditMobileUI,
    getConfirmMobileUI,
    getResendMobileConfirmationUI
} from '../../../redux/selectors';

// Component imports
import EditMobileForm from './EditMobileForm';
import ConfirmationForm from './ConfirmationForm';
import MobileChecked from './MobileChecked';
import { showToast, toastStyles } from '../../../redux/toast';

// Screen component
class EditMobileView extends Component {

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this._backHandler);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
    }

    _backHandler = () => {        
        if (this.props.currentStep === mobileEditingSteps.EDITING)
            this._cancelEdit();
        else
            this._close();
        
        return true;
    };
    
    _close = () => {
        const { dispatch } = this.props;
        dispatch(cancelMobileEdit());
        dispatch(NavigationActions.back());
    };

    _edit = () => {
        this.props.dispatch(toMobileEdit());
    };

    _editSubmit = ({ name, mobile, email, password }) => {
        this.props.dispatch(fetchEditMobile(name, mobile, email, password));
    };

    _cancelEdit = () => {
        this.props.dispatch(cancelMobileEdit());
    };

    _confirmCode = ({ verificationCode }) => {
        this.props.dispatch(fetchConfirmMobile(verificationCode));
    };

    _resendSMS= () => {
        const { dispatch, profileData: { mobile } } = this.props;

        dispatch(fetchResendMobileConfirmation(mobile))
            .catch((error) => { dispatch(showToast(error.message, toastStyles.ERROR )); });
    };

    _renderStep = () => {
        const { profileData, currentStep, confirmUi, editUi } = this.props;

        if (currentStep === mobileEditingSteps.INITIAL && profileData.isValidMobile)
            return (
                <MobileChecked
                    onEdit={this._edit}
                    mobile={profileData.mobile}
                    style={styles.content}
                />
            );

        if (currentStep === mobileEditingSteps.INITIAL && !profileData.isValidMobile)
            return (
                <ConfirmationForm
                    onSubmit={this._confirmCode}
                    onResend={this._resendSMS}
                    onEdit={this._edit}
                    mobile={profileData.mobile}
                    ui={confirmUi}
                    style={styles.content}
                />
            );

        return (
            <EditMobileForm
                onSubmit={this._editSubmit}
                onCancel={this._cancelEdit}
                ui={editUi}
                style={styles.content}
            />
        );
    }

    _getHeaderTitle = () => {
        const { profileData, currentStep } = this.props;
        
        if (currentStep === mobileEditingSteps.INITIAL && profileData.isValidMobile)
            return 'Celular';

        if (currentStep === mobileEditingSteps.INITIAL && !profileData.isValidMobile)
            return 'Confirmação';

        return 'Editar número';
    }

    render() {
        const { confirmUi, editUi, resendUi } = this.props;

        return (
            <View style={styles.container}>
                <Header
                    title={this._getHeaderTitle()}
                    left={{
                        type: headerActionTypes.CLOSE,
                        onPress: this._close
                    }}
                />
                { resendUi.isFetching && <Progress/> }
                <ScrollView
                    style={styles.scrollView}
                    keyboardShouldPersistTaps="always"
                >
                    <KeyboardDismissView>
                        {this._renderStep()}
                    </KeyboardDismissView>
                </ScrollView>
                { (confirmUi.isFetching || editUi.isFetching) && <LoadMask message={confirmUi.isFetching ? "Confirmando" : "Atualizando número do celular"} /> }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    scrollView: {
        flex: 1
    },
    content: {
        padding: 16
    }
});

// redux and connect
const mapStateToProps = (state) => {
    return {
        confirmUi: getConfirmMobileUI(state),
        editUi: getEditMobileUI(state),
        resendUi: getResendMobileConfirmationUI(state),
        profileData: state.profile.data,
        currentStep: state.profileEdit.mobile.currentStep,
    };
};

export const EditMobile = connect(mapStateToProps)(EditMobileView);
