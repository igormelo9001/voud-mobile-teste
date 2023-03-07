// NPM imports
import React, { Component } from "react";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";

import { View, ScrollView, StyleSheet } from "react-native";

// VouD imports
import Header, { headerActionTypes } from "../../../components/Header";
import KeyboardDismissView from "../../../components/KeyboardDismissView";
import LoadMask from "../../../components/LoadMask";
import { getEditAddressUI } from "../../../redux/selectors";
import {
  fetchEditAddress,
  editAddressClear
} from "../../../redux/profile-edit";

// Component imports
import EditAddressForm from "./EditAddressForm";
import EditShippingAddressForm from "./EditShippingAddressForm";

// Screen component
class EditAddressView extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.dispatch(editAddressClear());
  }

  _back = () => {
    this.props.dispatch(NavigationActions.back());
  };

  _submit = ({
    name,
    mobile,
    email,
    main,
    number,
    state,
    city,
    zipCode,
    district,
    supplement
  }) => {
    const {
      navigation: {
        state: { params }
      }
    } = this.props;

    let addressFields = undefined;
    let addressShippingFields = undefined;

    if (params === "shippingAddress") {
      addressShippingFields = { main, number };

      // send only properties with some value
      if (state) addressShippingFields.state = state;
      if (city) addressShippingFields.city = city;
      if (zipCode) addressShippingFields.zipCode = zipCode;
      if (district) addressShippingFields.district = district;
      if (supplement) addressShippingFields.supplement = supplement;
    } else {
      addressFields = { main, number };

      // send only properties with some value
      if (state) addressFields.state = state;
      if (city) addressFields.city = city;
      if (zipCode) addressFields.zipCode = zipCode;
      if (district) addressFields.district = district;
      if (supplement) addressFields.supplement = supplement;
    }

    this.props.dispatch(
      fetchEditAddress(
        name,
        mobile,
        email,
        addressFields,
        addressShippingFields
      )
    );
  };

  render() {
    const {
      ui,
      navigation: {
        state: { params }
      }
    } = this.props;

    return (
      <View style={styles.container}>
        <Header
          title="Endereço"
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
            {params === "shippingAddress" && (
              <EditShippingAddressForm
                ui={ui}
                onSubmit={this._submit}
                style={styles.content}
              />
            )}

            {params === "address" && (
              <EditAddressForm
                ui={ui}
                onSubmit={this._submit}
                style={styles.content}
              />
            )}
          </KeyboardDismissView>
        </ScrollView>
        {ui.isFetching && <LoadMask message="Salvando endereço" />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  scrollView: {
    flex: 1
  },
  content: {
    padding: 16
  }
});

// Redux
const mapStateToProps = state => {
  return {
    ui: getEditAddressUI(state)
  };
};

export const EditAddress = connect(mapStateToProps)(EditAddressView);
