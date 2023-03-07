// NPM imports
import React, { Component } from 'react';
import { TextInput } from 'react-native';

import {
    Keyboard,
    StyleSheet,
    View
} from 'react-native';

// component
class SearchForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
        };
    }

    onChangeText = (newValue) => {
        this.setState({ searchTerm: newValue });
        if (!!this.props.onChangeText) this.props.onChangeText(newValue);
    }

    render() {
        const { dismissKeyboard } = this.props;
        if (dismissKeyboard) Keyboard.dismiss();

        return (
            <View style={StyleSheet.flatten([styles.mainContainer, this.props.styles])}>
                <TextInput
                    style={styles.textInput}
                    selectionColor={'white'}
                    placeholderTextColor={'white'}
                    placeholder="Digite"
                    underlineColorAndroid={'transparent'}
                    autoFocus={true}
                    onChangeText={this.onChangeText}
                />
            </View>
        );
    }
}

// styles
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    textInput: {
        color:'white'
    }
});

export default SearchForm;
