import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";

import Header, { headerActionTypes } from "../../components/Header";
import TransportCardSm from "../../components/TransportCardSm";
import { getTransportCards } from "../../redux/selectors";
import { setPurchaseTransportCard } from "../../redux/financial";

import { getCurrentTransportCard } from "../../redux/selectors";
import { routeNames } from "../../shared/route-names";
import { navigateToRoute } from "../../redux/nav";

class CardListSelectView extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: headerProps => {
        return (
          <Header
            title="Selecionar cartão"
            left={{
              type: headerActionTypes.CLOSE,
              onPress: () => navigation.dispatch(NavigationActions.back())
            }}
          />
        );
      }
    };
  };

  _handleCardSelect = id => {
    const { dispatch } = this.props;
    dispatch(setPurchaseTransportCard(id));
    this.props.dispatch(NavigationActions.back());
  };

  render() {
    return (
      <FlatList
        style={styles.container}
        data={this.props.cardsList}
        keyExtractor={cardData => cardData.uuid}
        renderItem={({ item }) => {
          return (
            <TransportCardSm
              style={styles.transportCard}
              cardName={item.nick}
              cardNumber={item.cardNumber}
              layoutType={item.layoutType}
              onPress={() => this._handleCardSelect(item.uuid)}
            />
          );
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  transportCard: {
    marginTop: 16,
    marginHorizontal: 16
  }
});

// redux connect and export
const mapStateToProps = state => {
  return {
    cardsList: getTransportCards(state),
    cardData: getCurrentTransportCard(state)
  };
};

export const CardListSelect = connect(mapStateToProps)(CardListSelectView);
