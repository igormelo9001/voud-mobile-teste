// NPM imports
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

// VouD imports
import Dialog from '../../../../components/Dialog';
import ScooConfirmationForm from '../ScooConfimationForm';
import KeyboardDismissView from '../../../../components/KeyboardDismissView';

class ConfirmationDialogView extends Component {

    _submit = ({ creditCardSecurityCode }) => {
        this.props.onPressSubmit(creditCardSecurityCode);
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <Dialog
                    noPadding
                >
                    <KeyboardDismissView style={styles.dialogContent}>
                        <ScooConfirmationForm
                            onPressBack={this.props.onPressBack}
                            onSubmit={this._submit}
                        />
                    </KeyboardDismissView>
                </Dialog>
            </View>
        );
    }
}

// Styles
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    dialogContent: {
        flex: 0
    },
});

export default ConfirmationDialogView;