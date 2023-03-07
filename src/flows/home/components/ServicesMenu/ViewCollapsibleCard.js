import React, { Component, Fragment } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import CollapsibleCard from "../../../../components/CollapsibleCard";
import TransportCardBadgesList from "../../../../components/TransportCardBadgesList";
import TransportCardBadge from "../../../../components/TransportCardBadgesList/TransportCardBadge";

import { colors } from "../../../../styles";
import PendingRegistration from "./PendingRegistration";
import ScooterMenu from "../../../../home/components/ServicesMenu/ScooterMenu";
import VoudText from "../../../../components/VoudText";
import IconButton from "../../../../components/IconButton";
import RequestError from "../../../../components/RequestError";

class ViewCollapsibleCard extends Component {
  static propTypes = {
    cardsData: PropTypes.array,
    cardListUi: PropTypes.object,
    onViewCardDetails: PropTypes.func,
    onAddCard: PropTypes.func,
    onRetryCardList: PropTypes.func,
    hasAlert: PropTypes.bool,
    isZazcar: PropTypes.bool,
    onCompleteRegistration: PropTypes.func,
    style: PropTypes.object,
    renderStatic: PropTypes.func,
    onToggle: PropTypes.func,
    isServiceMenuCollapsed: PropTypes.bool,
    showProgressBar: PropTypes.bool,
    onNavigateToTaxi: PropTypes.func,
    onNavigateToCarro: PropTypes.func,
    serviceMenuType: PropTypes.string,
    animStyle: PropTypes.func,
    onScooterHelp: PropTypes.func,
    onScooterReport: PropTypes.func,
    onScooterBegin: PropTypes.func
  };

  _renderRequestCard = () => {
    const {
      requestCard,
      profileData: { cpf },
      onRetryRequestCard
    } = this.props;
    if (requestCard.register) {
      return (
        <Fragment>
          <VoudText style={styles.listTitle}>Solicitar cartão BOM</VoudText>
          <View style={styles.containerDescriptionRequestCard}>
            <VoudText style={styles.descriptionRequestCard}>
              {`Já existe um Cartão BOM Comum vinculado ao CPF ${cpf}. Em caso de perda, furto, roubo ou extravio do cartão, entre em contato o mais rápido possível com a Central de Atendimento do no telefone 0800 77 11 800 ou através do site.`}
            </VoudText>
          </View>
        </Fragment>
      );
    }
    if (requestCard.consultingError) {
      return (
        <Fragment>
          <VoudText style={styles.listTitle}>Solicitar cartão BOM</VoudText>
          <View style={styles.containerDescriptionRequestCard}>
            <RequestError
              error="Ocorreu um erro no processamento."
              onRetry={onRetryRequestCard}
            />
          </View>
        </Fragment>
      );
    }
    return null;
  };

  renderContent = animValue => {
    const {
      cardsData,
      cardListUi,
      onViewCardDetails,
      onAddCard,
      onRetryCardList,
      hasAlert,
      onCompleteRegistration,
      onNavigateToTaxi,
      onNavigateToCarro,
      serviceMenuType,
      onScooterHelp,
      onScooterReport,
      onScooterBegin,
      onScooterPaymentPending,
      listTicket,
      ticketUnitaryAvailable
    } = this.props;

    const animStyle = {
      opacity: animValue.interpolate(
        {
          inputRange: [0, 1],
          outputRange: [1, 0],
          extrapolate: "clamp"
        },
        {
          useNativeDriver: true
        }
      )
    };

    let content = null;

    if (serviceMenuType === "scooter") {
      content = (
        <Animated.View style={StyleSheet.flatten([animStyle])}>
          <Fragment>
            <View style={[styles.containerPatinete, { height: 30 }]}>
              <VoudText style={styles.listTitle}> {"VouD Patinete"}</VoudText>
              <IconButton
                iconName="help-outline"
                style={{ padding: 20 }}
                iconStyle={{ marginTop: -20 }}
                onPress={onScooterHelp}
              />
            </View>
            <ScooterMenu
              onScooterHelp={onScooterHelp}
              onScooterReport={onScooterReport}
              onScooterBegin={onScooterBegin}
              onScooterPaymentPending={onScooterPaymentPending}
            />
          </Fragment>
        </Animated.View>
      );
    } else if (serviceMenuType === "requestCard") {
      content = (
        <Animated.View
          style={StyleSheet.flatten([styles.collapsibleContent, animStyle])}
        >
          {this._renderRequestCard()}
        </Animated.View>
      );
    } else if (serviceMenuType === "card") {
      content = (
        <Animated.View
          style={StyleSheet.flatten([styles.collapsibleContent, animStyle])}
        >
          <Fragment>
            <VoudText style={styles.listTitle}>Transporte público</VoudText>
            <TransportCardBadgesList
              data={cardsData}
              ui={cardListUi}
              onCardPress={onViewCardDetails}
              onAddPress={onAddCard}
              onRetry={onRetryCardList}
              style={styles.listContainer}
              contentStyle={styles.badgesListContent}
              listTicket={listTicket}
              ticketUnitaryAvailable={ticketUnitaryAvailable}
            />
          </Fragment>
        </Animated.View>
      );
    } else if (serviceMenuType === "requestCard") {
      return (
        <Animated.View
          style={StyleSheet.flatten([styles.collapsibleContent, animStyle])}
        >
          {this._renderRequestCard()}
        </Animated.View>
      );
    } else if (serviceMenuType === "rentCar") {
      content = (
        <Fragment>
          <VoudText style={styles.listTitle}>Voud Carro</VoudText>
          <View style={styles.containerVoudCarro}>
            <View style={styles.innerContainerVoudCarro}>
              <View style={styles.collumnContainerVoudCarro}>
                <TransportCardBadge type="TAXI" onPress={onNavigateToTaxi} />
                <VoudText style={styles.voudCarroText}>
                  Pedir um carro/táxi
                </VoudText>
              </View>
              <View style={styles.collumnContainerVoudCarro}>
                <TransportCardBadge type="CARRO" onPress={onNavigateToCarro} />
                <VoudText style={styles.voudCarroText}>
                  Alugar um carro
                </VoudText>
              </View>
            </View>
          </View>
        </Fragment>
      );
    }

    const viewCardContent = hasAlert ? (
      <PendingRegistration onCompleteRegistration={onCompleteRegistration} />
    ) : (
      content
    );

    return viewCardContent;
  };

  renderCollapsible = animValue => {
    const animStyle = {
      opacity: animValue.interpolate(
        {
          inputRange: [0, 1],
          outputRange: [1, 0],
          extrapolate: "clamp"
        },
        {
          useNativeDriver: true
        }
      )
    };

    return (
      <Animated.View
        style={StyleSheet.flatten([styles.collapsibleContent, animStyle])}
      >
        {this.renderContent(animValue)}
      </Animated.View>
    );
  };

  render() {
    const {
      style,
      renderStatic,
      onToggle,
      isServiceMenuCollapsed,
      serviceMenuType,
      showProgressBar
    } = this.props;
    return (
      <CollapsibleCard
        startCollapsed={isServiceMenuCollapsed}
        renderCollapsibleContent={this.renderCollapsible}
        renderFixedContent={renderStatic}
        type={serviceMenuType}
        style={style}
        onToggle={onToggle}
        showProgressBar={showProgressBar}
      />
    );
  }
}

const styles = StyleSheet.create({
  collapsibleContent: {
    paddingVertical: 8
  },
  staticContent: {
    paddingTop: 16,
    paddingBottom: 8,
    height: 142
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
  containerVoudCarro: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  innerContainerVoudCarro: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  collumnContainerVoudCarro: {
    width: 64,
    height: 96,
    marginLeft: 8,
    justifyContent: "center",
    backgroundColor: "white"
  },
  voudCarroText: {
    marginLeft: 8,
    fontSize: 10,
    fontWeight: "bold",
    color: colors.BRAND_PRIMARY_LIGHT
  },
  containerPatinete: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginRight: 0
  },
  containerDescriptionRequestCard: {
    marginHorizontal: 16,
    marginVertical: 16
  },
  descriptionRequestCard: {
    fontSize: 12,
    color: "#4B4B4B"
  }
});

function mapStateToProps(state) {
  return {
    profileData: state.profile.data,
    requestCard: state.requestCard,
    listTicket: state.ticketUnitary,
    ticketUnitaryAvailable: state.ticketUnitaryAvailable
  };
}

export default connect(mapStateToProps)(ViewCollapsibleCard);
