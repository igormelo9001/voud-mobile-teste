// NPM imports
import React, { Component } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";

// VouD imports
import Header, { headerActionTypes } from "../../../components/Header";
import BrandText from "../../../components/BrandText";
import SystemText from "../../../components/SystemText";
import RequestFeedback from "../../../components/RequestFeedback";
import { colors } from "../../../styles";
import { navigateToRoute } from "../../../redux/nav";

// Module imports
import {
  fetchEstimates,
  selectMobilityService,
  clearEstimates
} from "../actions";
import { getEstimatesUi } from "../reducer";
import routeNames from "../route-names";
import EstimateItem from "../components/EstimateItem";
import OriginDestination from "../components/OriginDestination";
import { getPaddingForNotch } from "../../../utils/is-iphone-with-notch";

// Screen component
class MobilityServicesEstimatesView extends Component {
  componentDidMount() {
    this.getEstimates();
  }

  componentWillUnmount() {
    this.props.dispatch(clearEstimates());
  }

  getEstimates = () => {
    const { dispatch, origin, destination } = this.props;
    dispatch(fetchEstimates(origin, destination));
  };

  renderEstimates = () => {
    const { dispatch, estimates, ui } = this.props;
    const { error, isFetching } = ui;

    if (estimates.list && estimates.list[0]) {
      const {
        trip: { distance, duration }
      } = estimates;
      return (
        <React.Fragment>
          <View style={styles.tripInfo}>
            <View style={styles.tripInfoBlock}>
              <SystemText style={styles.tripInfoValue}>
                {distance} Km
              </SystemText>
              <BrandText style={styles.tripInfoLabel}>Distância</BrandText>
            </View>
            <View style={styles.tripInfoBlock}>
              <SystemText style={styles.tripInfoValue}>
                {Math.round(duration / 60)} minutos
              </SystemText>
              <BrandText style={styles.tripInfoLabel}>Duração</BrandText>
            </View>
          </View>
          <FlatList
            data={estimates.list}
            keyExtractor={item => item.urban_result_id.toString()}
            renderItem={({ item, index }) => (
              <EstimateItem
                data={item}
                imageUri={estimates.players[item.player].icon}
                onPress={() => {
                  dispatch(selectMobilityService(item.urban_result_id));
                  dispatch(
                    navigateToRoute(routeNames.MOBILITY_SERVICES_CONFIRMATION)
                  );
                }}
                style={StyleSheet.flatten([
                  styles.estimateItem,
                  index === 0 ? styles.estimateItemNoBorder : {}
                ])}
              />
            )}
          />
          <View style={styles.list} />
        </React.Fragment>
      );
    }

    return (
      <View style={styles.requestFeedbackContainer}>
        <RequestFeedback
          loadingMessage="Estimando valores..."
          errorMessage={error}
          emptyMessage="Nenhuma estimativa encontrada"
          retryMessage="Tentar novamente"
          isFetching={isFetching}
          onRetry={this.getEstimates}
        />
      </View>
    );
  };

  render() {
    const { dispatch, origin, destination } = this.props;

    return (
      <View style={styles.container}>
        <Header
          title="Sua rota"
          left={{
            type: headerActionTypes.CLOSE,
            onPress: () => {
              dispatch(NavigationActions.back());
            }
          }}
        />
        <OriginDestination
          originText={origin.formatted_address}
          destinationText={destination.formatted_address}
          style={styles.originDestination}
        />
        {this.renderEstimates()}
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: getPaddingForNotch(),
    backgroundColor: "white"
  },
  originDestination: {
    borderBottomWidth: 1,
    borderColor: colors.GRAY_LIGHTER
  },
  tripInfo: {
    flexDirection: "row",
    alignItems: "stretch",
    padding: 16,
    backgroundColor: colors.GRAY_LIGHTER
  },
  tripInfoBlock: {
    flex: 1
  },
  tripInfoValue: {
    marginBottom: 4,
    fontSize: 16,
    lineHeight: 20,
    color: colors.GRAY_DARKER
  },
  tripInfoLabel: {
    fontSize: 14,
    color: colors.GRAY
  },
  list: {
    flex: 1
  },
  estimateItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: colors.GRAY_LIGHTER
  },
  estimateItemNoBorder: {
    borderTopWidth: 0
  },
  requestFeedbackContainer: {
    flex: 1,
    justifyContent: "center"
  }
});

// Redux
const mapStateToProps = state => ({
  origin: state.mobilityServices.placeDetails.data.origin,
  destination: state.mobilityServices.placeDetails.data.destination,
  estimates: state.mobilityServices.estimates.data,
  ui: getEstimatesUi(state)
});

export const MobilityServicesEstimates = connect(mapStateToProps)(
  MobilityServicesEstimatesView
);
