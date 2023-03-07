// NPM imports
import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { ScrollView, StyleSheet, View } from "react-native";

// VouD imports
import Header, { headerActionTypes } from "../../components/Header";
import KeyboardDismissView from "../../components/KeyboardDismissView";
import LoadMask from "../../components/LoadMask";
import { fetchAddCard, addCardClear } from "../../redux/transport-card";
import { getAddCardUI } from "../../redux/selectors";

// Group imports
import AddCardForm from "./AddCardForm";

// Screen component
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  ui: PropTypes.object.isRequired
};

class AddCardView extends Component {
  componentWillUnmount() {
    this.props.dispatch(addCardClear());
  }

  _addCard = ({ cardNumber, nick, issuerType }) => {
    this.props.dispatch(fetchAddCard(cardNumber, nick, issuerType));
  };

  _close = () => {
    this.props.dispatch(NavigationActions.back());
  };

  render() {
    const {
      ui,
      navigation: {
        state: {
          params: { issuerType }
        }
      }
    } = this.props;

    return (
      <View style={styles.container}>
        <Header
          title="Adicionar cartão"
          left={{
            type: headerActionTypes.CLOSE,
            onPress: this._close
          }}
        />
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="always"
        >
          <KeyboardDismissView>
            <AddCardForm
              issuerType={issuerType}
              onSubmit={this._addCard}
              ui={this.props.ui}
              style={styles.content}
            />
          </KeyboardDismissView>
        </ScrollView>
        {ui.isFetching && <LoadMask message="Adicionando cartão" />}
      </View>
    );
  }
}

AddCardView.propTypes = propTypes;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  scrollView: {
    flex: 1
  },
  content: {
    paddingVertical: 24,
    paddingHorizontal: 16
  }
});

// Redux
const mapStateToProps = state => {
  return {
    ui: getAddCardUI(state)
  };
};

export const AddCard = connect(mapStateToProps)(AddCardView);

export * from "./AddCardHelperDialog";
