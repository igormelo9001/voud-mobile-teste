// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { StyleSheet, View } from 'react-native';

// Component imports
import SearchField from './SearchField';
import { colors } from '../../../../styles';
import { clearReduxForm } from '../../../../utils/redux-form-util';

// consts
const reduxFormName = 'searchForm';

// Component
class SearchAddressForm extends Component {

  componentDidMount() {
    const { onChangeText } = this.props;
    const searchTerm = searchTerm ? searchTerm : '';

    if (searchTerm !== '') {
      onChangeText(searchTerm);
    }
  }

  componentWillUnmount() {
    clearReduxForm(this.props.dispatch, reduxFormName);
  }

  render() {
    const { style, isOrigin, textFieldRef, onChangeText, onMyLocationPress } = this.props;
    return (
      <View style={StyleSheet.flatten([styles.container, style])}>
        <Field
          name="searchTerm"
          onChange={onChangeText}
          props={{
            isOrigin,
            textFieldRef,
            onMyLocationPress,
            style: styles.searchField
          }}
          component={SearchField}
        />
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {},
  searchField: {
    padding: 16,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderColor: colors.GRAY_LIGHT,
  },
});

// Redux
const mapStateToProps = state => ({
  initialValues: {
    searchTerm: '',
  },
  searchTerm: formValueSelector(reduxFormName)(state, 'searchTerm'),
});

export default connect(mapStateToProps)(reduxForm({ form: reduxFormName, destroyOnUnmount: false })(SearchAddressForm));
