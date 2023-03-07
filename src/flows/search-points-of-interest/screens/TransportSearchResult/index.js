import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';

// VouD imports
import { colors } from '../../../../styles';

// Module imports
import TransportSearchMap from './TransportSearchMap';
import ServicesMenu from '../../../../flows/home/components/ServicesMenu';
import { TYPES } from '../../components/SwitchTypeSearch';
import { fetchNextPointClear, fetchNextPoint, fetchArrivalForecastClear, fetchArrivalForecast, fetchBusLine, fetchBusLineSearchClear } from '../../actions';
import { mergeRequestUI } from '../../../../redux/utils';
import { getHasProfileAlerts } from '../../../../redux/selectors';
import { navigateToRoute } from '../../../../redux/nav';
import { routeNames } from '../../../../shared/route-names';
import { voudCapitalizeLetters } from '../../../../utils/string-util';
import SearchResultHeader from './SearchResultHeader';

export const routeTypes = {
  SUBWAY: '1',
  TRAIN: '2',
  BUS: '3'
};

export const companies = {
  EMTU: 'EMTU',
  SPTRANS: 'SPTRANS',
}

const ARRIVAL_FORECAST_INTERVAL = 60 * 1000; // 1 min

// Component
class TransportSearchResultScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isServiceMenuCollapsed: true
    }

    this._mapRef = null;
    this._centerDelay = null;
    this._arrivalForecastTimer = null;
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(fetchNextPointClear());
    dispatch(fetchArrivalForecastClear());
    dispatch(fetchBusLineSearchClear());
    clearInterval(this._centerDelay);
    clearInterval(this._arrivalForecastTimer);
  }

  _back = () => {
    this.props.dispatch(NavigationActions.back());
  };

  _edit = () => {
    const {
      dispatch,
      navigation: { state: { params: { onEdit } } },
    } = this.props;
    this._back();
    onEdit();
  };

  _clearSearch = () => {
    const {
      dispatch,
      navigation: { state: { params: { onClear } } },
    } = this.props;
    dispatch(NavigationActions.back());
    onClear();
  };

  _centerLocation = () => {
    if (this._mapRef && this._mapRef.centerLocation) {
      this._mapRef.centerLocation();
    }
  };

  _centerWithDelay = () => {
    clearInterval(this._centerDelay);
    this._centerDelay = setTimeout(() => {
      this._centerLocation();
    }, 750);
  }

  _hasNextPoint = () => Object.keys(this.props.nextPoint.data).length > 0;

  _hasBusLine = () => Object.keys(this.props.busLineSearch.data).length > 0;

  // Forecast

  _scheduleFetchBusLineAndArrivalForecast = async (externalId, lineNumber) => {
    clearInterval(this._arrivalForecastTimer);

    await this._fetchBusLine(lineNumber);
    await this._fetchArrivalForecast(externalId);

    this._arrivalForecastTimer = setTimeout(async () => {
      this._scheduleFetchBusLineAndArrivalForecast(externalId, lineNumber);
    }, ARRIVAL_FORECAST_INTERVAL);
  }

  _fetchBusLine = async (lineNumber) => {
    try {
      this.props.dispatch(fetchBusLine(lineNumber));
    } catch (error) {
      if (__DEV__) console.tron.log(error.message);
    }
  }

  _fetchArrivalForecast = async (externalId) => {
    const {
      dispatch,
      navigation: { state: { params: { searchItem } } },
    } = this.props;

    try {
      await dispatch(fetchArrivalForecast(searchItem.lineNumber, externalId));
    } catch (error) {
      if (__DEV__) console.tron.log(error.message);
    }
    
    this._centerWithDelay();
  }

  // Transport Details

  _fetchTransportDetails = async () => {
    const {
      dispatch,
      navigation: { state: { params: { searchType, searchItem } } },
    } = this.props;

    if (searchType === TYPES.POINTS) return;

    const response = await dispatch(fetchNextPoint(searchItem.id));

    if (response && response.payload && searchItem.routeType === routeTypes.BUS &&
      searchItem.company === companies.SPTRANS) {
      const nearestStation = response.payload.points.find(el => el.isNearPoint);

      this._scheduleFetchBusLineAndArrivalForecast(nearestStation.externalId, searchItem.lineNumber);
    } else {
      this._centerWithDelay();
    }
  }

  _retryFetchTransportDetails = () => {
    const {
      dispatch,
      arrivalForecast,
      busLineSearch,
      nextPoint,
      navigation: { state: { params: { searchType, searchItem } } },
    } = this.props;

    if (searchType !== TYPES.TRANSPORT) return;

    if (nextPoint.error !== '') {
      this._fetchTransportDetails();
      return;
    }

    if (busLineSearch.error !== '') {
      dispatch(fetchBusLine(searchItem.lineNumber));
    }

    // Retry flow if only Arrival Forecast request failed
    if (arrivalForecast.error !== '' && this._hasNextPoint()) {
      const points = this.props.nextPoint.data.points ? this.props.nextPoint.data.points : [];
      const nearestStation = points.find(el => el.isNearPoint);
      if (nearestStation) this._fetchArrivalForecast(nearestStation.externalId);
    }
  }

  _handleServiceMenuToggle = toggle => {
    this.setState({ isServiceMenuCollapsed: toggle });
  }

  _navigateToMyProfile = () => {
    this.props.dispatch(navigateToRoute(routeNames.MY_PROFILE));
  }

  render() {
    const { 
      navigation: { state: { params: { searchType, searchItem } } },
      userPosition,
      nextPoint,
      arrivalForecast,
      busLineSearch,
      screenRequestsUi,
      hasAlert,
    } = this.props;
    const searchText = searchType === TYPES.TRANSPORT ?
      `${searchItem.lineNumber} ${voudCapitalizeLetters(searchItem.description)}` :
        voudCapitalizeLetters(searchItem.name);

    return (
      <Fragment>
        <View style={styles.container}>
          <TransportSearchMap
            onMapReady={this._fetchTransportDetails}
            userPosition={userPosition}
            nextPoint={nextPoint}
            arrivalForecast={arrivalForecast}
            busLineSearch={busLineSearch}
            searchItem={searchItem}
            searchType={searchType}
            onRef={el => { this._mapRef = el; }}
            isServiceMenuCollapsed={this.state.isServiceMenuCollapsed}
          />
          <SearchResultHeader
            searchText={searchText}
            onBack={this._back}
            onEdit={this._edit}
            onClear={this._clearSearch}
          />
        </View>
        <ServicesMenu
          parentRequestsUi={screenRequestsUi}
          onParentRequestsRetry={this._retryFetchTransportDetails}
          onCenterLocation={this._centerLocation}
          purchaseCredit
          onToggle={this._handleServiceMenuToggle}
          hasAlert={hasAlert}
          onCompleteRegistration={this._navigateToMyProfile}
          isMenuService={false}
        />
      </Fragment>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginBottom: 162,
    backgroundColor: 'white',
  },
  containerModal: {
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    margin: 0,
    marginLeft: 48
  },
  loaderContainer: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: colors.BRAND_PRIMARY
  }
});

const mapStateToProps = (state) => (
  {
    userPosition: state.profile.position,
    nextPoint: state.searchPointsOfInterest.nextPoint,
    arrivalForecast: state.searchPointsOfInterest.arrivalForecast,
    busLineSearch: state.searchPointsOfInterest.busLineSearch,
    screenRequestsUi: mergeRequestUI([
      state.searchPointsOfInterest.nextPoint,
      {
        ...state.searchPointsOfInterest.arrivalForecast,
        error: '', // Note - In case of error, it was silenced due to intermittent SPTrans service
      },
      {
        ...state.searchPointsOfInterest.busLineSearch,
        error: '', // Note - In case of error, it was silenced due to intermittent SPTrans service
      }
    ]),
    hasAlert: getHasProfileAlerts(state),
  }
)

export const TransportSearchResult = connect(mapStateToProps)(TransportSearchResultScreen);
