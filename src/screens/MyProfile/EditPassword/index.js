// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import {
    ScrollView,
    StyleSheet,
    View
} from 'react-native';

// VouD imports
import Header, { headerActionTypes } from '../../../components/Header';
import KeyboardDismissView from '../../../components/KeyboardDismissView';
import LoadMask from '../../../components/LoadMask';
import { getEditPasswordUI } from '../../../redux/selectors';
import { fetchEditPassword, editPasswordClear } from '../../../redux/profile-edit';

// Component imports
import EditPasswordForm from './EditPasswordForm';

// Component
class EditPasswordView extends Component {

    componentWillUnmount() {
        this.props.dispatch(editPasswordClear());
    }

    _back = () => {
        this.props.dispatch(NavigationActions.back());
    };

    _submit = ({ password, newPassword }) => {
        this.props.dispatch(fetchEditPassword(password, newPassword));
    };

    render() {
        const { ui } = this.props;

        return (
            <View style={styles.container}>
                <Header
                    title="Alterar senha"
                    left={{
                        type: headerActionTypes.CLOSE,
                        onPress: this._back
                    }}
                />
                <ScrollView
                    style={styles.scrollView}
                    keyboardShouldPersistTaps="always"
                >
                    <KeyboardDismissView>
                        <EditPasswordForm
                            ui={ui}
                            onSubmit={this._submit}
                            style={styles.content}
                        />
                    </KeyboardDismissView>
                </ScrollView>
                { ui.isFetching && <LoadMask message="Alterando senha"/> }
            </View>
        );
    }
}

// Styles
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

// Redux
const mapStateToProps = (state) => {
    return {
        ui: getEditPasswordUI(state)
    }
};

export const EditPassword = connect(mapStateToProps)(EditPasswordView);
