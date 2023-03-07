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
    emailEditingSteps,
    toEmailEdit,
    cancelEmailEdit,
    fetchEditEmail
} from '../../../redux/profile-edit';
import {
    fetchConfirmEmail,
    fetchResendEmailConfirmation
} from '../../../redux/register';
import {
    getEditEmailUI,
    getConfirmEmailUI,
    getResendEmailConfirmationUI
} from '../../../redux/selectors';

// Component imports
import EditEmailForm from './EditEmailForm';
import ConfirmationForm from './ConfirmationForm';
import EmailChecked from './EmailChecked';
import { showToast, toastStyles } from '../../../redux/toast';

// Screen component
class EditEmailView extends Component {

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this._backHandler);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
    }

    _backHandler = () => {        
        if (this.props.currentStep === emailEditingSteps.EDITING)
            this._cancelEdit();
        else
            this._close();
        
        return true;
    };

    _close = () => {
        const { dispatch } = this.props;
        dispatch(cancelEmailEdit());
        dispatch(NavigationActions.back());
    };

    _edit = () => {
        this.props.dispatch(toEmailEdit());
    };

    _editSubmit = ({ name, mobile, email, password }) => {
        this.props.dispatch(fetchEditEmail(name, mobile, email, password));
    };

    _cancelEdit = () => {
        this.props.dispatch(cancelEmailEdit());
    };

    _confirmCode = ({ verificationCode }) => {
        this.props.dispatch(fetchConfirmEmail(verificationCode));
    };

    _resendEmail = () => {
        const { dispatch } = this.props;
        dispatch(fetchResendEmailConfirmation())
            .catch((error) => { dispatch(showToast(error.message, toastStyles.ERROR )); });
    };

    _renderStep = () => {
        const { profileData, currentStep, confirmUi, editUi } = this.props;

        if (currentStep === emailEditingSteps.INITIAL && profileData.isValidEmail)
            return (
                <EmailChecked
                    onEdit={this._edit}
                    email={profileData.email}
                    style={styles.content}
                />
            );

        if (currentStep === emailEditingSteps.INITIAL && !profileData.isValidEmail)
            return (
                <ConfirmationForm
                    onSubmit={this._confirmCode}
                    onResend={this._resendEmail}
                    onEdit={this._edit}
                    email={profileData.email}
                    ui={confirmUi}
                    style={styles.content}
                />
            );

        return (
            <EditEmailForm
                onSubmit={this._editSubmit}
                onCancel={this._cancelEdit}
                ui={editUi}
                style={styles.content}
            />
        );
    }

    _getHeaderTitle = () => {
        const { profileData, currentStep } = this.props;

        if (currentStep === emailEditingSteps.INITIAL && profileData.isValidEmail)
            return 'E-mail';

        if (currentStep === emailEditingSteps.INITIAL && !profileData.isValidEmail)
            return 'Confirmação';

        return 'Editar e-mail';
    };

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
                { (confirmUi.isFetching || editUi.isFetching) && <LoadMask message={confirmUi.isFetching ? "Confirmando" : "Atualizando e-mail"} /> }
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
        confirmUi: getConfirmEmailUI(state),
        editUi: getEditEmailUI(state),
        resendUi: getResendEmailConfirmationUI(state),
        profileData: state.profile.data,
        currentStep: state.profileEdit.email.currentStep
    };
};

export const EditEmail = connect(mapStateToProps)(EditEmailView);
