// NPM imports
import React, { Component, Fragment } from 'react';
import { View, StyleSheet, Keyboard, FlatList, BackHandler, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { formValueSelector, change } from 'redux-form';
import { NavigationActions } from 'react-navigation';
import debounce from 'lodash.debounce';

// VouD Imports
import VoudText from '../../../components/VoudText';
import SwitchTypeSearch, { TYPES } from '../components/SwitchTypeSearch';
import Suggestions from '../components/Suggestions';
import SearchForm, { searchInputs } from '../components/SearchForm';
import Icon from '../../../components/Icon';
import { reduxFormName } from '../components/SearchForm';
import { colors } from '../../../styles';
import { fetchPredictions, clearPredictions } from '../../../flows/mobility-services/actions';
import PredictionItem from '../../../components/PredictionItem';
import ContentPlaceholder from '../../../components/ContentPlaceholder';
import {
	fetchTransportLineSearchClear,
	fetchRechargePointsSearchClear,
	fetchTransportLineSearch,
	fetchRechargePointsSearch,
	fetchServicePoints
} from '../actions';
import { navigateToRoute, waitAndNavigateToRoute } from '../../../redux/nav';
import { routeNames } from '../../../shared/route-names';
import ResultSearchList from '../components/ResultSearchList';
import RequestError from '../../../components/RequestError';
import KeyboardDismissView from '../../../components/KeyboardDismissView';
import { getStateCurrentRouteName } from '../../../utils/nav-util';


class SearchPointsOfInterestView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activeSearchInput: searchInputs.DESTINATION_INPUT,
			selectedSearchType: '',
			gMapsAutoCompleteHasZeroResults: false,
			gMapsAutoCompleteHasError: false
		};
		this._debounceFetchTransportOrRechargePoint = debounce(this._fetchTransportOrRechargePoint, 750);
		this._debounceFetchPredictions = debounce(this.fetchPredictions, 750);
		this._searchFormRef = null;
	}

	componentDidMount() {
    const { navigation :{state : {params}} } = this.props;

		this._focusDestinationField();
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
    
    if(params.isTransportCardRecharge)
        this._handleSearchTypeChange("points");
    
	}

	componentDidUpdate(prevProps) {
		const { hasSelectedUserLocation, hasSelectedDestination } = this.props;
		const isPendingSelectionPrev = !prevProps.hasSelectedUserLocation || !prevProps.hasSelectedDestination;
		if (isPendingSelectionPrev && hasSelectedUserLocation && hasSelectedDestination) {
			this._goToSearchRoutes();
		}
	}

	componentWillUnmount() {
		const { dispatch } = this.props;
		dispatch(fetchTransportLineSearchClear());
		dispatch(fetchRechargePointsSearchClear());
		BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
	}

	_close = () => {
		Keyboard.dismiss();
		this.props.dispatch(NavigationActions.back());
	};

	_backHandler = () => {
		const { nav } = this.props;
		const currentRouteName = getStateCurrentRouteName(nav);

		if (currentRouteName === routeNames.TRACE_ROUTES) {
			this._back();
			return true;
		}
		return false;
	};

	_back = () => {
		this.props.dispatch(NavigationActions.back());
	};

	returnSearchterm() {
		const { originLocationAddress, destinationLocationAddress } = this.props;
		const { activeSearchInput } = this.state;

		let searchTerm = undefined;

		if (activeSearchInput === searchInputs.ORIGIN_INPUT) {
			searchTerm = originLocationAddress;
		}
		if (activeSearchInput === searchInputs.DESTINATION_INPUT) {
			searchTerm = destinationLocationAddress;
		}

		return searchTerm;
	}

	// ============================
	// Switch Search Type
	// ============================
	_handleSearchTypeChange = (selectedSearchType) => {
 		var searchTerm = this.returnSearchterm();
		this.setState(
			{
				selectedSearchType
			},
			() => {
				if (this._isTransportOrRechargePointSelected()) {
					this.props.dispatch(
						this._isTransportLinesSearchSelected()
							? fetchRechargePointsSearchClear()
							: fetchTransportLineSearchClear()
					);

					this._fetchTransportOrRechargePoint();
				} else {
					this.fetchPredictions(searchTerm);
				}
			}
		);
	};

	_isRoutesSelected = () => this.state.selectedSearchType === TYPES.ROUTES;

	_isTransportLinesSearchSelected = () => this.state.selectedSearchType === TYPES.TRANSPORT;

	_isTransportOrRechargePointSelected = () =>
		this.state.selectedSearchType === TYPES.TRANSPORT || this.state.selectedSearchType === TYPES.POINTS;

	// ============================
	// Search Points
	// ============================
	_fetchTransportOrRechargePoint = (value = '') => {
		const { dispatch, position } = this.props;
		const { selectedSearchType } = this.state;

		var searchTerm = this.returnSearchterm();

		const trimSearchTerm = value === '' ? (searchTerm ? searchTerm.trim() : '') : value.trim();
		const hasMinimumLength = trimSearchTerm.length > 2;
		const hasSelectedSearchType = selectedSearchType !== '';
		const isTransportLinesSearchSelected = this._isTransportLinesSearchSelected();

		if (hasSelectedSearchType && position && searchTerm === undefined) {
			dispatch(fetchServicePoints(position));
			return;
		}

		if (hasSelectedSearchType && !hasMinimumLength) {
			dispatch(
				isTransportLinesSearchSelected ? fetchTransportLineSearchClear() : fetchRechargePointsSearchClear()
			);
			return;
		}

		if (hasSelectedSearchType) {
			dispatch(
				isTransportLinesSearchSelected
					? fetchTransportLineSearch(trimSearchTerm)
					: fetchRechargePointsSearch(trimSearchTerm)
			);
		}
	};

	// Autocomplete GMaps
	// ============================
	onChangeStartLocation = (value) => {
		const { dispatch } = this.props;
		dispatch(change(reduxFormName, 'hasSelectedUserLocation', false));
		this.clearPredictions();
		this._startFetchPredictions(value);
	};

	onChangeDestinationLocation = (value) => {
		const { dispatch } = this.props;
		if (this._isTransportOrRechargePointSelected()) {
			this._debounceFetchTransportOrRechargePoint(value);
		}
		/*else{
      dispatch(change(reduxFormName, 'hasSelectedDestination', false));
      this.clearPredictions();
      this._startFetchPredictions(value);
    }*/
		if (this._isRoutesSelected()) {
			dispatch(change(reduxFormName, 'hasSelectedDestination', false));
			this.clearPredictions();
			this._startFetchPredictions(value);
		}
	};

	clearPredictions = () => {
		this.props.dispatch(clearPredictions());
	};

	_startFetchPredictions = (input = '') => {
		// reset state
		this.setState({
			gMapsAutoCompleteHasZeroResults: false,
			gMapsAutoCompleteHasError: false
		});
		this._debounceFetchPredictions(input);
	};

	fetchPredictions = (input = '') => {
		if (input.length > 3) {
			this.props.dispatch(fetchPredictions(input)).then(
				() => {},
				// err
				(error) => {
					if (error.response && error.response.status === 200) {
						this.setState({
							gMapsAutoCompleteHasZeroResults: true
						});
					} else {
						this.setState({
							gMapsAutoCompleteHasError: true
						});
					}
				}
			);
		}
	};

	_onRetryFetchPredictions = () => {
		var searchTerm = this.returnSearchterm();
		this.fetchPredictions(searchTerm);
	};

	updateFocusedField = (fieldName) => {
  	this.setState({
			activeSearchInput: fieldName
		});

		// this.clearPredictions();
	};

	_goToSearchRoutes = () => {
		const { originLocationAddress, destinationLocationAddress, dispatch } = this.props;

		Keyboard.dismiss();

		var searchTerm = this.returnSearchterm();

		dispatch(
			navigateToRoute(routeNames.SEARCH_ROUTES, {
				originLocation: originLocationAddress,
				searchTerm: searchTerm,
				destinationLocation: destinationLocationAddress,
				clearOriginCallback: this._onOriginClear,
				editOriginCallback: this._onOriginEdit,
				clearDestinationCallback: this._onDestinationClear,
				editDestinationCallback: this._onDestinationEdit
			})
		);
	};

	// Renders
	// ============================
	_renderSuggestions = () => {
		var searchTerm = this.returnSearchterm();
		return <Suggestions searchTerm={searchTerm} handleSearchTypeChange={this._handleSearchTypeChange} />;
	};

	_renderGoogleMapsAutoComplete = () => {
		const { predictions, originLocationAddress, destinationLocationAddress } = this.props;
		const { gMapsAutoCompleteHasZeroResults, gMapsAutoCompleteHasError, activeSearchInput } = this.state;

		const searchQuery =
			activeSearchInput === searchInputs.DESTINATION_INPUT ? destinationLocationAddress : originLocationAddress;

		if (!searchQuery) {
			return (
				<View style={styles.emptyState}>
					<VoudText style={styles.emptyStateText}>
						{activeSearchInput === searchInputs.ORIGIN_INPUT ? (
							'Clique na mira para te localizar automaticamente, ou pesquise por seu endereço.'
						) : (
							'Insira um destino e saiba as melhores rotas e alternativas para chegar lá.'
						)}
					</VoudText>
				</View>
			);
		}

		// No Results
		if (gMapsAutoCompleteHasZeroResults) {
			return (
				<View style={styles.emptyState}>
					<VoudText style={styles.emptyStateText}>Nenhum resultado encontrado para {searchQuery}.</VoudText>
				</View>
			);
		}

		// Error
		if (gMapsAutoCompleteHasError) {
			return (
				<RequestError
					style={styles.requestErrorContainer}
					error={predictions.error}
					onRetry={this._onRetryFetchPredictions}
				/>
			);
		}

		// Loading State
		if (predictions.isFetching) {
			return (
				<View style={styles.listWrapper}>
					<VoudText style={styles.listTitle}>Sugestões</VoudText>
					<View style={styles.placeholderContainer}>
						<ContentPlaceholder duration={1000} style={styles.placeholderLeft} />
						<ContentPlaceholder duration={1000} style={styles.placeholderRight} />
					</View>
				</View>
			);
		}

		// Normal State
		if (predictions.data.length > 0) {
			return (
				<View style={styles.listWrapper}>
					<VoudText style={styles.listTitle}>Sugestões</VoudText>
					<FlatList
						data={predictions.data}
						renderItem={({ item, index }) => (
							<PredictionItem
								mainText={item.structured_formatting.main_text}
								secondaryText={item.structured_formatting.secondary_text}
								onPress={() => {
       						const {
										dispatch,
										hasSelectedUserLocation,
										hasSelectedDestination,
										destinationLocationAddress,
										originLocationAddress
									} = this.props;
									const { activeSearchInput } = this.state;

									dispatch(change(reduxFormName, activeSearchInput, item.description));

									if (
										hasSelectedDestination &&
										hasSelectedUserLocation &&
										originLocationAddress !== undefined &&
										destinationLocationAddress !== undefined
									) {
										this._goToSearchRoutes();
									}

									// // Toggle define location mode on tap suggestion
									if (activeSearchInput === searchInputs.ORIGIN_INPUT) {
										dispatch(change(reduxFormName, 'hasSelectedUserLocation', true));
										if (!hasSelectedDestination || destinationLocationAddress === undefined) {
											this._onDestinationEdit();
										}
									}

									if (activeSearchInput === searchInputs.DESTINATION_INPUT) {
										dispatch(change(reduxFormName, 'hasSelectedDestination', true));
										if (!hasSelectedUserLocation || originLocationAddress === undefined) {
											this._onOriginEdit();
										}
									}

									// this.clearPredictions();
								}}
								style={StyleSheet.flatten([
									styles.predictionItem,
									index === 0 ? styles.predictionItemNoBorder : {}
								])}
							/>
						)}
						keyExtractor={(item) => item.id}
						keyboardShouldPersistTaps="always"
					/>
				</View>
			);
		}
	};

	_renderSearchListEmptyState = () => {
		return (
			<View style={styles.emptyState}>
				<VoudText style={styles.emptyStateText}>
					Busque pelas melhores rotas, pontos de recarga, linhas de ônibus, metrô e trem.
				</VoudText>
			</View>
		);
	};

	_goToTransportOrRechargePointDetail = (item) => {
		Keyboard.dismiss();
		this.props.dispatch(
			waitAndNavigateToRoute(routeNames.TRANSPORT_SEARCH_RESULT, {
				searchType: this.state.selectedSearchType,
				searchItem: item,
				onClear: this._clearFromSearchDetail,
				onEdit: this._focusDestinationField
			})
		);
	};

	_clearSearch = () => {
		const { dispatch } = this.props;
		dispatch(change(reduxFormName, searchInputs.DESTINATION_INPUT, ''));
		dispatch(fetchTransportLineSearchClear());
		dispatch(fetchRechargePointsSearchClear());
	};

	_clearFromSearchDetail = () => {
		this._clearSearch();
		this._focusDestinationField();
	};

	_focusDestinationField = () => {
		if (this._searchFormRef) this._searchFormRef.focusDestinationField();
	};

	_renderTransportOrRechargePointList = () => {
		const { transportLinesSearch, rechargePointsSearch } = this.props;
		const { selectedSearchType } = this.state;
		var searchTerm = this.returnSearchterm();
		const resultSearchData = this._isTransportLinesSearchSelected() ? transportLinesSearch : rechargePointsSearch;
		return (
			<ResultSearchList
				searchTerm={searchTerm}
				selectedSearchType={selectedSearchType}
				resultSearchData={resultSearchData}
				onSearchItemDetail={this._goToTransportOrRechargePointDetail}
				onFetchSearch={this._fetchTransportOrRechargePoint}
			/>
		);
	};

	_renderResultSearchList = () => {
		const { predictions } = this.props;
		const { selectedSearchType, activeSearchInput } = this.state;

		var searchTerm = this.returnSearchterm();

		const isTransportOrRechargePointsSelected = this._isTransportOrRechargePointSelected();

		return (
			<Fragment>
				{/* ======================= */}
				{/* EMPTY STATE =========== */}
				{/* ======================= */}
				{!searchTerm &&
					selectedSearchType === '' &&
					predictions.data.length === 0 &&
					activeSearchInput !== searchInputs.ORIGIN_INPUT &&
					this._renderSearchListEmptyState()}

				{/* ======================= */}
				{/* SUGGESTIONS =========== */}
				{/* ======================= */}
				{searchTerm && searchTerm !== '' && selectedSearchType === '' && this._renderSuggestions()}

				{/* ======================= */}
				{/* GMAPS AUTOCOMPLETE ==== */}
				{/* ======================= */}
				{(this._isRoutesSelected() || activeSearchInput === searchInputs.ORIGIN_INPUT) &&
					this._renderGoogleMapsAutoComplete()}

				{/* ================================== */}
				{/* Transport and Recharge Points ==== */}
				{/* ================================== */}
				{isTransportOrRechargePointsSelected &&
					activeSearchInput !== searchInputs.ORIGIN_INPUT &&
					this._renderTransportOrRechargePointList()}
			</Fragment>
		);
	};

	_onOriginClear = () => {
		this._searchFormRef.clearUserLocationField();
	};

	_onDestinationClear = () => {
		this._searchFormRef.clearDestinationField();
	};

	_onOriginEdit = () => {
		this._searchFormRef.setLocationMode(searchInputs.ORIGIN_INPUT, this._searchFormRef.focusUserLocationField);
	};

	_onDestinationEdit = () => {
		this._searchFormRef.setLocationMode(searchInputs.DESTINATION_INPUT, this._searchFormRef.focusDestinationField);
	};

	render() {
		const { originLocationAddress, destinationLocationAddress } = this.props;
		const { selectedSearchType } = this.state;

		var searchTerm = this.returnSearchterm();

		return (
			<View style={styles.container}>
				<StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
				<KeyboardDismissView>
					<View style={styles.wrapperHeader}>
						<View style={styles.header}>
							<Icon onPress={this._close} style={styles.icon} name="md-arrow-back" />
							<View style={styles.wrapperRouteForm}>
								<SearchForm
									onRef={(el) => {
										this._searchFormRef = el;
									}}
									onChangeDestinationLocation={this.onChangeDestinationLocation}
									onChangeStartLocation={this.onChangeStartLocation}
									onFocusField={this.clearPredictions}
									searchTerm={searchTerm}
									selectedSearchType={selectedSearchType}
									originLocationAddress={originLocationAddress}
									destinationLocationAddress={destinationLocationAddress}
									updateFocusedField={this.updateFocusedField}
								/>
							</View>
						</View>
					</View>
					<SwitchTypeSearch
						selectedSearchType={selectedSearchType}
						onSearchTypeChange={this._handleSearchTypeChange}
					/>
					{this._renderResultSearchList()}
				</KeyboardDismissView>
			</View>
		);
	}
}

// Styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.GRAY_LIGHTEST
	},
	wrapperHeader: {
		height: 144,
		shadowColor: 'rgba(0, 0, 0, 0.5)',
		shadowOpacity: 0.5,
		shadowRadius: 5,
		shadowOffset: {
			height: 1,
			width: 0
		},
		backgroundColor: 'white',
		elevation: 9,
		zIndex: 1
	},
	header: {
		alignItems: 'flex-start',
		flexDirection: 'row',
		paddingLeft: 16,
		paddingTop: 40,
		marginBottom: 16
	},
	icon: {
		fontSize: 24,
		color: colors.BRAND_PRIMARY
	},
	wrapperRouteForm: {
		flex: 1,
		height: 112,
		marginLeft: 8
	},
	listWrapper: {
		flex: 1
	},
	emptyState: {
		justifyContent: 'center',
		alignContent: 'center',
		paddingVertical: 48,
		paddingHorizontal: 16
	},
	emptyStateText: {
		textAlign: 'center',
		fontSize: 14,
		color: colors.GRAY,
		marginHorizontal: 42
	},
	listTitle: {
		fontSize: 12,
		color: colors.GRAY,
		fontWeight: 'bold',
		marginTop: 16,
		marginBottom: 8,
		paddingLeft: 16
	},
	predictionItem: {
		padding: 16,
		borderTopWidth: 1,
		borderColor: colors.GRAY_LIGHTER,
		backgroundColor: 'white'
	},
	predictionItemNoBorder: {
		borderTopWidth: 0
	},

	placeholderContainer: {
		height: 56,
		backgroundColor: 'white',
		paddingHorizontal: 16,
		paddingVertical: 14,
		justifyContent: 'space-between'
	},
	placeholderLeft: {
		width: '80%',
		marginBottom: 4,
		height: 12
	},
	placeholderRight: {
		width: '60%',
		height: 8
	},
	requestErrorContainer: {
		marginTop: 40,
		marginHorizontal: 16
	}
});

function mapStateToProps(state) {
	return {
		transportLinesSearch: state.searchPointsOfInterest.transportLinesSearch,
		rechargePointsSearch: state.searchPointsOfInterest.rechargePointsSearch,
		position: state.profile.position,
		searchTerm: formValueSelector(reduxFormName)(state, 'searchTerm'),
		originLocationAddress: formValueSelector(reduxFormName)(state, searchInputs.ORIGIN_INPUT),
		destinationLocationAddress: formValueSelector(reduxFormName)(state, searchInputs.DESTINATION_INPUT),
		hasSelectedUserLocation: formValueSelector(reduxFormName)(state, 'hasSelectedUserLocation'),
		hasSelectedDestination: formValueSelector(reduxFormName)(state, 'hasSelectedDestination'),
		predictions: state.mobilityServices.predictions
	};
}

export const SearchPointsOfInterest = connect(mapStateToProps)(SearchPointsOfInterestView);

export * from './TransportSearchResult';
export * from './SearchRoutes';
