// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { ScrollView, StyleSheet, View } from 'react-native';

// VouD imports
import Header, { headerActionTypes } from '../../../components/Header';
import KeyboardDismissView from '../../../components/KeyboardDismissView';
import LoadMask from '../../../components/LoadMask';
import { getEditPersonalDataUI } from '../../../redux/selectors';
import { editPersonalDataClear, fetchEditPersonalData } from '../../../redux/profile-edit';

// Component imports
import EditPersonalDataForm from './EditPersonalDataForm';

// Component
class EditPersonalDataView extends Component {
  componentWillUnmount() {
    this.props.dispatch(editPersonalDataClear());
  }

  _back = () => {
    this.props.dispatch(NavigationActions.back());
  };

  _submit = ({ name, lastName, birthDate, mobile, email, motherName }) => {
    this.props.dispatch(
      fetchEditPersonalData(name, lastName, birthDate, mobile, email, motherName)
    );
  };

  render() {
    const { ui } = this.props;

    return (
      <View style={styles.container}>
        <Header
          title="Dados pessoais"
          left={{
            type: headerActionTypes.CLOSE,
            onPress: this._back,
          }}
        />
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always">
          <KeyboardDismissView>
            <EditPersonalDataForm ui={ui} onSubmit={this._submit} style={styles.content} />
          </KeyboardDismissView>
        </ScrollView>
        {ui.isFetching && <LoadMask message="Atualizando dados pessoais" />}
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});

// Redux
const mapStateToProps = state => {
  return {
    ui: getEditPersonalDataUI(state),
  };
};

export const EditPersonalData = connect(mapStateToProps)(EditPersonalDataView);
