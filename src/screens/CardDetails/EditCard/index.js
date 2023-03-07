// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import {
    Alert,
    View,
    ScrollView,
    StyleSheet
} from 'react-native';

// VouD imports
import Header, { headerActionTypes } from '../../../components/Header';
import KeyboardDismissView from '../../../components/KeyboardDismissView';
import LoadMask from '../../../components/LoadMask';
import { getEditTransportCardUI } from '../../../redux/selectors';
import {
    fetchRemoveCard,
    fetchUpdateCard,
    removeCardClear,
    updateCardClear
}  from '../../../redux/transport-card';

// Component imports
import EditCardForm from './EditCardForm';

// Screen component
class EditCardView extends Component {

    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(removeCardClear());
        dispatch(updateCardClear());
    }

    _editCard = ({ nick }) => {
        const { dispatch, cardId } = this.props;
        dispatch(fetchUpdateCard(cardId, nick ));
    }

    _removeCard = () => {
        const { dispatch, cardId } = this.props;
        dispatch(fetchRemoveCard(cardId));
    }

    _showRemoveCardAlert = () => {
        Alert.alert(
            'Remover cartão',
            'Você tem certeza que deseja remover este cartão?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => {}
                },
                {
                    text: 'Sim',
                    onPress: this._removeCard
                }
            ]
        );
    }

    render() {
        const { dispatch, ui } = this.props;

        return (
            <View style={styles.container}>
                <Header
                    title="Editar cartão"
                    left={{
                        type: headerActionTypes.CLOSE,
                        onPress: () => dispatch(NavigationActions.back())
                    }}
                />
                <ScrollView
                    style={styles.scrollView}
                    keyboardShouldPersistTaps="always"
                >
                    <KeyboardDismissView>
                        <EditCardForm
                            ui={ui}
                            onSubmit={this._editCard}
                            onRemove={this._showRemoveCardAlert}
                            style={styles.form}
                        />
                    </KeyboardDismissView>
                </ScrollView>
                { ui.isFetching && <LoadMask/> }
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
    form: {
        padding: 16
    }
});

// redux connect and export
const mapStateToProps = state => {
    return {
        cardId: state.transportCard.currentDetailId,
        ui: getEditTransportCardUI(state)
    };
};

export const EditCard = connect(mapStateToProps)(EditCardView);
