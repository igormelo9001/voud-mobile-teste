import React, { Component, Fragment } from "react";
import { Animated, StyleSheet, View } from "react-native";

import CollapsibleCard from "../../../../components/CollapsibleCard";
import BrandText from "../../../../components/BrandText";
import TransportCardBadgesList from "../../../../components/TransportCardBadgesList";
import { colors } from "../../../../styles";
import PendingRegistration from "./PendingRegistration";
import GradientButton from "../../../../components/GradientButton";

class PurchaseCollapsibleCard extends Component {
  constructor(props) {
    super(props);
  }

  _purchaseButtonPress = toggle => {
    const { cardsData, onPurchaseCredit, hasAlert } = this.props;

    if (!hasAlert && cardsData && cardsData.length === 1) {
      onPurchaseCredit(cardsData[0]);
    } else {
      toggle();
    }
  };

  renderCollapsible = (animValue, toggle) => {
    const {
      cardsData,
      cardListUi,
      onPurchaseCredit,
      onAddCard,
      onRetryCardList,
      hasAlert,
      onCompleteRegistration
    } = this.props;

    const badgesAnimStyle = {
      opacity: animValue.interpolate({
        inputRange: [0, 0.5],
        outputRange: [1, 0],
        extrapolate: "clamp"
      })
    };

    const buttonAnimStyle = {
      opacity: animValue.interpolate({
        inputRange: [0.5, 1],
        outputRange: [0, 1],
        extrapolate: "clamp"
      }),
      transform: [
        {
          translateY: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [144, 0],
            extrapolate: "clamp"
          })
        }
      ]
    };

    return (
      <Fragment>
        {hasAlert ? (
          <PendingRegistration
            onCompleteRegistration={onCompleteRegistration}
          />
        ) : (
          <Fragment>
            <Animated.View
              style={StyleSheet.flatten([
                styles.collapsibleContent,
                badgesAnimStyle
              ])}
            >
              <BrandText
                style={styles.listTitle}
              >{`Escolha o cartão para comprar crédito`}</BrandText>
              <TransportCardBadgesList
                data={cardsData}
                ui={cardListUi}
                onCardPress={onPurchaseCredit}
                onAddPress={onAddCard}
                onRetry={onRetryCardList}
                style={styles.listContainer}
                contentStyle={styles.badgesListContent}
              />
            </Animated.View>
          </Fragment>
        )}
      </Fragment>
    );
  };

  renderFixedButton = toggle => {
    const { hasAlert } = this.props;

    return !hasAlert ? (
      <View style={styles.buyButtonContainer}>
        <GradientButton
          text="Comprar créditos"
          onPress={() => {
            this._purchaseButtonPress(toggle);
          }}
        />
      </View>
    ) : (
      <View />
    );
  };

  render() {
    return (
      <CollapsibleCard
        noHandle
        startCollapsed={!this.props.hasAlert}
        expandedHeight={142}
        collapseOffset={this.props.hasAlert ? 68 : 0}
        renderCollapsibleContent={this.renderCollapsible}
        renderFixedContent={this.props.renderStatic}
        style={this.props.style}
        onToggle={this.props.onToggle}
        showProgressBar={this.props.showProgressBar}
        isMenuService={this.props.isMenuService}
        renderFixedButtonContent={this.renderFixedButton}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    bottom: 0
  },
  collapsible: {
    alignSelf: "stretch"
  },
  collapsibleContent: {
    paddingVertical: 8
  },
  hr: {
    alignSelf: "stretch",
    height: 1,
    marginHorizontal: 16,
    backgroundColor: colors.GRAY_LIGHTER
  },
  listTitle: {
    marginHorizontal: 16,
    fontSize: 12,
    fontWeight: "bold",
    color: colors.GRAY_DARK
  },
  listContainer: {
    alignSelf: "stretch"
  },
  badgesListContent: {
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  listContainerContent: {
    flexGrow: 1,
    flexDirection: "row",
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 8
  },
  actionTile: {
    width: 90,
    height: 84,
    borderWidth: 1,
    borderColor: colors.BRAND_PRIMARY,
    borderRadius: 4,
    marginRight: 8
  },
  // buy button
  buyButtonContainer: {
    // position: 'absolute',
    // top: 0,
    // right: 0,
    // left: 0,
    padding: 16
  },
  buyButtonTouchable: {
    borderRadius: 18
  },
  buyButton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 18
  },
  buyButtonText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "white"
  }
});

export default PurchaseCollapsibleCard;
