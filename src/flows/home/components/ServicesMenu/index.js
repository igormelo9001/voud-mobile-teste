import React, { PureComponent, Fragment } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Platform,
  Easing,
  ScrollView,
  Alert,
  BackHandler,
  Modal
} from "react-native";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";

import PropTypes from "prop-types";

// redux
import { routeNames } from '../../../../shared/route-names';
import { navigateToRoute, navigateFromHome } from '../../../../redux/nav';
import CardButton from '../../../../components/CardButton';
import {
	getUserPhoneValidRecharge,
	getCardListUI,
	getHasConfigError,
	getIssuerConfig,
	getTransportCards,
	getHasProfileAlerts,
  getConfigContentUI,
  getSelectedPaymentMethod,
} from '../../../../redux/selectors';
import { colors } from '../../../../styles';
import { GATrackEvent, GAEventParams } from '../../../../shared/analytics';
import { viewDetails, fetchCardList, fetchCardListRealBalance } from '../../../../redux/transport-card';
import VoudText from '../../../../components/VoudText';
import TouchableNative from '../../../../components/TouchableNative';
import ViewCollapsibleCard from './ViewCollapsibleCard';
import PurchaseCollapsibleCard from './PurchaseCollapsibleCard';
import { goToPurchaseCredit } from '../../../../utils/purchase-credit';
import BrandText from '../../../../components/BrandText';
import { setIsServiceMenuCollapsed } from '../../../../redux/config';
import { configurePosition } from '../../../../redux/profile';
import { showLocationWithoutPermissionAlert } from '../../../../utils/geolocation';
import DiscountInfoModal from './DiscountInfoModal';

import { fetchAuthRide } from '../../../scooter/store/ducks/authRide';
import {
  fetchPendingRide,
  fetchPendingTransactionRide,
  fetchPaymentPendingTransaction,
  resultCodeTransaction,
} from "../../../../redux/scooter";

import { getJson, saveItem } from '../../../../utils/async-storage';
import { asyncStorageKeys } from '../../../../redux/init';
import { showToast, toastStyles } from '../../../../redux/toast';
import { fetchVerifyCardRequested } from "../../../RequestCard/store/requestCard";
import ScooterUsageTerms from "../../../scooter/screens/ScooterUsageTerms";

import SwitcherTransportModel from './SwitcherTransportModel';

import {fetchTicketUnitaryList} from '../../../TicketUnitary/store/ducks/ticketUnitary';


class ServicesMenu extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			isDiscountModalVisible: false,
			isAcceptUsageTerms: false
		};
		this._toggle  = null;
		this._CollapsibleCard = null;
		this._toastAnimation = new Animated.Value(0);
		this._toastPosition = this._toastAnimation.interpolate({
			inputRange: [ 0, 1 ],
			outputRange: [ -70, 0 ]
		});
	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this._backHandler);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
	}

	_backHandler = () => {
		const { nav } = this.props;

		if (nav === undefined) {
			const { isDiscountModalVisible } = this.state;
			if (!isDiscountModalVisible) return false;
			this.setState({
				isDiscountModalVisible: !this.state.isDiscountModalVisible
			});
		}
		return true;
	};

	componentWillUpdate(nextProps) {
		const { parentRequestsUi, positionError } = nextProps;

		if (parentRequestsUi.error || positionError) {
			this._showErrorToast();
		}

		if (!parentRequestsUi.error && !positionError) {
			this._dismissErrorToast();
		}
	}

	_refreshCardList = () => {
		this.props.dispatch(fetchCardList());
	};

	// _fetchCardListRealBalance = () => {
	// 	this.props.dispatch(fetchCardListRealBalance());
	// };

	_navigateToRoute = (routeName, eventLabel = '') => {
		const { geolocPermGranted, dispatch } = this.props;
		const { categories: { BUTTON }, actions: { CLICK } } = GAEventParams;
		GATrackEvent(BUTTON, CLICK, eventLabel);

		if (routeName === routeNames.MOBILITY_SERVICES && !geolocPermGranted) {
			showLocationWithoutPermissionAlert();
			return;
		}

		dispatch(navigateFromHome(routeName));
  };


	_goToAddCard = async (issuerType) => {
    const {dispatch} = this.props;

    if(issuerType === "BIUN"){

      const { categories: { BUTTON }, actions: { CLICK }, labels: { ADD_CARD_BILHETE_UNITARIO } } = GAEventParams;
			GATrackEvent(BUTTON, CLICK, ADD_CARD_BILHETE_UNITARIO);
			
			const isRead = await getJson("readTicketInfo");
	    if (!isRead) {
        await saveItem("readTicketInfo", "true");
        dispatch(navigateToRoute(routeNames.TICKET_INFO, { myticket: false }));
      } else {
        dispatch(
          navigateToRoute(routeNames.MY_TICKET_UNITARY, {
            issuerType
          })
        );
      }
    } else {
      const { categories: { BUTTON }, actions: { CLICK }, labels: { ADD_CARD } } = GAEventParams;
      GATrackEvent(BUTTON, CLICK, ADD_CARD);
      dispatch(
        navigateToRoute(routeNames.ADD_CARD, {
          issuerType
        })
      );
    }
	};

	_viewCardDetails = ({ uuid }) => {
   	const { dispatch } = this.props;
		const { categories: { BUTTON }, actions: { CLICK }, labels: { TRANSPORT_CARD_DETAILS } } = GAEventParams;

		GATrackEvent(BUTTON, CLICK, TRANSPORT_CARD_DETAILS);
		dispatch(viewDetails(uuid));
		dispatch(navigateToRoute(routeNames.CARD_DETAILS));
	};

	_goToPurchaseCredit = (cardData) => {
		let minCreditValue = 0;
		if(this.props.bomCreditValueRange){
			minCreditValue = this.props.bomCreditValueRange.minCreditValue;
		}
		const {
			dispatch,
			hasConfigError,
			// bomCreditValueRange: { minCreditValue },
			issuerConfig,
			configUi
		} = this.props;


		goToPurchaseCredit(dispatch, cardData, minCreditValue, issuerConfig, hasConfigError, configUi);
	};

	_toggleDiscountModal = () => {
		this.setState({
			isDiscountModalVisible: !this.state.isDiscountModalVisible
		});
	};

	_onNavigateToTaxi = () => {
		const { dispatch } = this.props;
		const { categories: { BUTTON }, actions: { CLICK }, labels: { MENU_MOBILITY_SERVICES } } = GAEventParams;

		GATrackEvent(BUTTON, CLICK, MENU_MOBILITY_SERVICES);
		dispatch(navigateToRoute(routeNames.MOBILITY_SERVICES));
	};

	_onNavigateToCarro = () => {
		const { onNearbyZazcarLocation } = this.props;
		onNearbyZazcarLocation();
  };

  _navigateToRequestCard = toggle => {
    const { hasAlert } = this.props;

    this._checkCard().then(response => {
      const responseReturnCode = parseInt(response);
      if (responseReturnCode === 200 && !hasAlert) {
        this.props.dispatch(navigateFromHome(routeNames.REQUEST_CARD));
      } else if (responseReturnCode > 0 || !response) {
        toggle("requestCard");
      }
    });
  };

  _checkCard = async () => {
    const { dispatch, profileData } = this.props;
    const response = await dispatch(fetchVerifyCardRequested(profileData.cpf));
    return response.returnCode;
  };

  _refreshRequestCard = () => {
    const { onToggle } = this.props;
    this._navigateToRequestCard(onToggle);
  };

	// render methods
	renderStatic = (animValueCard, animValueScooter, animValueRentCar, animValueRequestCard,toggle) => {
		this._toggle =  toggle;
		return (
			<Fragment>
				<View style={styles.hr} />
				<View style={styles.staticContent}>
					<BrandText style={styles.listTitle}>Serviços</BrandText>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						style={styles.listContainer}
						contentContainerStyle={styles.listContainerContent}
					>
						{this._renderCardButtons(animValueCard, animValueScooter, animValueRentCar, animValueRequestCard, toggle)}
					</ScrollView>
				</View>
			</Fragment>
		);
	};

	_renderCardButtons = (animValueCard, animValueScooter, animValueRentCar, animValueRequestCard ,toggle) => {
		const transportCardButtonAnimStyle = {
			width: animValueCard.interpolate(
				{
					inputRange: [ 0, 1 ],
					outputRange: [ 0, 98 ], // 98 = CardButton width (90) + margin (8)
					extrapolate: 'clamp'
				},
				{
					useNativeDriver: true
				}
			),
			opacity: animValueCard.interpolate(
				{
					inputRange: [ 0, 1 ],
					outputRange: [ 0, 1 ],
					extrapolate: 'clamp'
				},
				{
					useNativeDriver: true
				}
			)
		};

		const scooterCardButtonAnimStyle = {
			width: animValueScooter.interpolate(
				{
					inputRange: [ 0, 1 ],
					outputRange: [ 0, 98 ], // 98 = CardButton width (90) + margin (8)
					extrapolate: 'clamp'
				},
				{
					useNativeDriver: true
				}
			),
			opacity: animValueScooter.interpolate(
				{
					inputRange: [ 0, 1 ],
					outputRange: [ 0, 1 ],
					extrapolate: 'clamp'
				},
				{
					useNativeDriver: true
				}
			)
		};

		const rentCarCardButtonAnimStyle = {
			width: animValueRentCar.interpolate(
				{
					inputRange: [ 0, 1 ],
					outputRange: [ 0, 98 ], // 98 = CardButton width (90) + margin (8)
					extrapolate: 'clamp'
				},
				{
					useNativeDriver: true
				}
			),
			opacity: animValueRentCar.interpolate(
				{
					inputRange: [ 0, 1 ],
					outputRange: [ 0, 1 ],
					extrapolate: 'clamp'
				},
				{
					useNativeDriver: true
				}
			)
    };

    const requestCardBOMCardButtonAnimStyle = {
      width: animValueRequestCard.interpolate(
        {
          inputRange: [0, 1],
          outputRange: [0, 98], // 98 = CardButton width (90) + margin (8)
          extrapolate: "clamp"
        },
        {
          useNativeDriver: true
        }
      ),
      opacity: animValueRequestCard.interpolate(
        {
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: "clamp"
        },
        {
          useNativeDriver: true
        }
      )
    };

		const {
			categories: { BUTTON },
			actions: { CLICK },
			labels: {
				MENU_REPORT,
				MENU_HELP,
				MENU_SCOOTER_SERVICES,
				MENU_SMART_PURCHASE,
				MENU_TRANSPORT_CARDS,
				MENU_PHONE_RECHARGE,
        MENU_VOUD_CAR,
        MENU_REQUEST_CARD,
			}
		} = GAEventParams;

		const {
			onRentCarLocation,
			onBusLocation,
			onNearbyTembiciLocation,
			menuTembiciLocation,
			onScooLocation,
			isServiceMenuCollapsed
		} = this.props;

		return (
			<Fragment>
				{__DEV__ && (
					<CardButton
						iconName="bus"
						text="Force Error"
						onPress={() => {
							throw new Error('Error');
						}}
						style={styles.cardButton}
					/>
				)}
				{this.props.purchaseCredit ? null : (
					<Animated.View style={transportCardButtonAnimStyle}>
						<CardButton
							iconName="bus"
              // text="Cartões de transporte"
              text="Transporte público"
							onPress={() => {
                GATrackEvent(BUTTON, CLICK, MENU_TRANSPORT_CARDS);
           			toggle('card');
								onBusLocation();
							}}
							style={styles.cardButton}
						/>
					</Animated.View>
        )}
          {/* <Animated.View style={requestCardBOMCardButtonAnimStyle}>
          <CardButton
            isNew
            iconName="bom-card"
            text="Solicitar cartão BOM"
            style={styles.cardButton}
            onPress={() => {
              GATrackEvent(BUTTON, CLICK, MENU_REQUEST_CARD);
              this._navigateToRequestCard(toggle);
            }}
          />
        </Animated.View> */}
				<Animated.View style={scooterCardButtonAnimStyle}>
					<CardButton
						iconName="scooter"
						text="VouD Patinete"
						style={styles.cardButton}
						onPress={() => {
							GATrackEvent(BUTTON, CLICK, MENU_SCOOTER_SERVICES);
							this._handlerScooInfo();
							toggle('scooter');
							onScooLocation();
						}}
					/>
				</Animated.View>
				<Animated.View style={rentCarCardButtonAnimStyle}>
					<CardButton
            // isNew
    				iconName="car"
						text="VouD Carro"
						style={styles.cardButton}
						onPress={() => {
							GATrackEvent(BUTTON, CLICK, MENU_VOUD_CAR);
							toggle('rentCar');
							onRentCarLocation();
						}}
					/>
				</Animated.View>
				<CardButton
					iconName="ic-tembici"
					text="VouD Bike"
					style={styles.cardButton}
					onPress={() => {
						const { categories: { BUTTON }, actions: { CLICK }, labels: { MENU_TEMBICI } } = GAEventParams;
						GATrackEvent(BUTTON, CLICK, MENU_TEMBICI);
						menuTembiciLocation();
						if (!isServiceMenuCollapsed) {
							toggle();
						}
						onNearbyTembiciLocation();
					}}
				/>
				<CardButton
					iconName="mobile"
					text="Recarga de celular"
					style={styles.cardButton}
					onPress={() => this._navigateToRoute(routeNames.PHONE_RECHARGE, MENU_PHONE_RECHARGE)}
				/>
				<CardButton
					iconName="history"
					text="Compra programada"
					style={styles.cardButton}
					onPress={() => this._navigateToRoute(routeNames.SMART_PURCHASE, MENU_SMART_PURCHASE)}
				/>
				<CardButton
					iconName="wallet-giftcard"
					text="Clube de Descontos"
					style={styles.cardButton}
					onPress={() => {
						const {
							categories: { BUTTON },
							actions: { CLICK },
							labels: { MENU_DISCOUNT_PAGE }
						} = GAEventParams;
						GATrackEvent(BUTTON, CLICK, MENU_DISCOUNT_PAGE);
						this._toggleDiscountModal();
					}}
				/>
				<CardButton
					iconName="feedback"
					text="Denúncias"
					style={styles.cardButton}
					onPress={() => this._navigateToRoute(routeNames.REPORTS, MENU_REPORT)}
				/>
				<CardButton
					iconName="help-outline"
					text="FAQ"
					style={styles.cardButton}
					onPress={() => this._navigateToRoute(routeNames.HELP, MENU_HELP)}
				/>
			</Fragment>
		);
	};

	// error toast
	_showErrorToast = () => {
		Animated.timing(this._toastAnimation, {
			toValue: 1,
			duration: 500,
			easing: Easing.inOut(Easing.ease)
		}).start();
	};

	_dismissErrorToast = () => {
		Animated.timing(this._toastAnimation, {
			toValue: 0,
			duration: 500,
			easing: Easing.inOut(Easing.ease)
		}).start();
	};

	_hasError = () => {
		return this.props.parentRequestsUi.error || this.props.positionError;
	};

	_renderToast = () => {
		const { parentRequestsUi, positionError } = this.props;
		const parentRequestsError = parentRequestsUi.error;
		return (
			<Animated.View
				style={StyleSheet.flatten([
					styles.toastErrorContainer,
					{
						opacity: this._toastAnimation,
						bottom: this._toastPosition
					}
				])}
				pointerEvents={this._hasError() ? 'auto' : 'none'}
			>
				<TouchableNative style={styles.toastError} onPress={this._handleErrorToastPress}>
					<VoudText style={styles.toastErrorText} numberOfLines={2} ellipsizeMode="tail">
						{positionError ? (
							positionError
						) : parentRequestsError ? (
							<Fragment>
								<VoudText>{`${parentRequestsError}${parentRequestsError.endsWith('.')
									? ' '
									: '. '}`}</VoudText>
								<VoudText style={{ fontWeight: 'bold' }}>Tentar novamente.</VoudText>
							</Fragment>
						) : (
							''
						)}
					</VoudText>
				</TouchableNative>
			</Animated.View>
		);
	};

	_handleErrorToastPress = () => {
		const { dispatch, onParentRequestsRetry, positionError, onCenterLocation } = this.props;
		this._dismissErrorToast();

		if (positionError) {
			dispatch(configurePosition(onCenterLocation));
		} else {
			if (onParentRequestsRetry) onParentRequestsRetry();
		}
	};

	_handleCardCollapse = (toggle, type) => {
		const { dispatch, purchaseCredit, onToggle } = this.props;

		if (!purchaseCredit) {
			dispatch(setIsServiceMenuCollapsed({ toggle, type }));
		}

		if (onToggle) onToggle();
	};

	_handlerScooInfo = async () => {
    const isRead = await getJson("readScooInfo");
    const {
      profileData,
      dispatch,
      pendingRide,
      pendingTransactionRide
		} = this.props;
	

    if (!pendingRide && !pendingTransactionRide.pending) {
      dispatch(
        fetchAuthRide(profileData.name, profileData.cpf, profileData.email)
      )
        .then(response => {
          dispatch(fetchPendingRide(profileData.id)).then(response => {
            if (!response.pendingRide) {
              dispatch(fetchPendingTransactionRide(profileData.id));
            }
          });
        })
        .catch(error => {
          this.props.dispatch(showToast(error.message, toastStyles.ERROR));
        });
    };
    if (!isRead) {
      await saveItem("readScooInfo", "true");
      this._handleScooterHelp();
    }
	};

	_handleScooterHelp = () => {
		//GATrackEvent(BUTTON, CLICK, ADD_CARD);
		this.props.dispatch(navigateToRoute(routeNames.SCOOTER_INFO));
	};

	_handleScooterReport = () => {
		//GATrackEvent(BUTTON, CLICK, ADD_CARD);
		this.props.dispatch(navigateToRoute(routeNames.SCOOTER_REPORT));
	};

	// _handlerQRCODE = async () => {
	// 	const scooterAcceptTerm = await this._renderAcceptUsageTerms();

	// 	if (scooterAcceptTerm) {
	// 		this.props.dispatch(navigateToRoute(routeNames.SCOOTER_SERVICES_QRCODE));
	// 	} else {
	// 		this.setState({ isAcceptUsageTerms: true });
	// 	}
	// };

	_handlerOnPressClose = () => {
		this.setState({ isAcceptUsageTerms: false });
	};

	_handlerOnPressAccpetTerms = () => {
		this.setState({ isAcceptUsageTerms: false });
		this.props.dispatch(navigateToRoute(routeNames.SCOOTER_SERVICES_QRCODE));
	};

	_renderToken = async () => {
		return await getJson(asyncStorageKeys.scooterToken);
  };

  _renderAcceptUsageTerms = async () => {
    return await getJson(asyncStorageKeys.scooterAcceptUsageTerms);
  };

  _renderScooterService = () => {
    const { pendingRide, dispatch, profileData } = this.props;

		if (pendingRide) {
      dispatch(fetchPendingRide(profileData.id, true))
        .then(dispatch(navigateToRoute(routeNames.SCOOTER_SERVICES)))
        .catch(error => {
          dispatch(showToast(error.message, toastStyles.ERROR));
        });
    } else {
      dispatch(navigateToRoute(routeNames.SCOOTER_SERVICES_QRCODE));
    }
  };

  _handlerOnPressAccpetTerms = () => {
    this.setState({ isAcceptUsageTerms: false });
    this._renderScooterService();
  };

  _handlerQRCODE = async () => {
    const scooterAcceptTerm = await this._renderAcceptUsageTerms();
    if (scooterAcceptTerm) {
      this._renderScooterService();
    } else {
      this.setState({ isAcceptUsageTerms: true });
    }
  };

  _handleScooterBegin = async () => {
    this._handlerQRCODE();
  };

  _handleScooterPaymentPending = () => {

    const { dispatch, selectedPaymentMethod :{ id} , pendingTransactionRide : {rideValue}} = this.props;
    const params = { id , rideValue };
    let error = "";

    dispatch(fetchPaymentPendingTransaction(params))
      .then(response => {
        if (response === resultCodeTransaction.PAYMENT_CONFIRMED) {
          Alert.alert(
            "Voud Patinete",
            "Pagamento confirmado com sucesso!"
          );
        } else if (response === resultCodeTransaction.DENIED) {
          const paymentData = undefined;
          dispatch(
            navigateToRoute(
              [NavigationActions.back(), routeNames.PAYMENT_ERROR],
              { paymentData, error }
            )
          );
        }
      })
      .catch(error => {});
}

	render() {
		const {
			style,
			onCenterLocation,
			parentRequestsUi,
			purchaseCredit,
			cardsData,
			cardListUi,
			isServiceMenuCollapsed,
			isGettingPosition,
			hasAlert,
			onCompleteRegistration,
			shouldRenderCenterOnLocationButton = true,
			renderOnTop,
			shouldRenderToast = true,
			isMenuService,
			onBycicleLocation,
			onRentCarLocation,
			onScooLocation,
			onBusLocation,
			isZazcar,
			isTembici,
			isBus,
			isScoo,
			serviceMenuType,
		} = this.props;

		const CollapsibleCardComponent = purchaseCredit ? PurchaseCollapsibleCard : ViewCollapsibleCard;
		const showProgressBar = !this._hasError() && (isGettingPosition || parentRequestsUi.isFetching);

		return (
			<Fragment>
				<View style={StyleSheet.flatten([ styles.container, style ])} pointerEvents="box-none">
					{shouldRenderCenterOnLocationButton && (
						<SwitcherTransportModel
							onPressCar={() => {
								this._toggle('rentCar');
								onRentCarLocation();
							}}
							onPressBike={() => {
								if (!isServiceMenuCollapsed) {
									this._toggle(serviceMenuType);
								}
								onBycicleLocation();
							}}
							onPressBus={() => {
								this._toggle('card');
								onBusLocation();
							}}
							onPressScoo={() => {
								this._toggle('scooter');
								onScooLocation();
							}}
							onCenterLocation={onCenterLocation}
							toastPosition={this._toastPosition}
							isZazcar={isZazcar}
							isBus={isBus}
							isScoo={isScoo}
							isTembici={isTembici}
							isServiceMenuCollapsed={isServiceMenuCollapsed}
							models={'location|bus|bike|car|scoo'}
						/>
					)}
					{shouldRenderToast && this._renderToast()}
					{renderOnTop && renderOnTop()}
					<CollapsibleCardComponent
						style={styles.collapsible}
						cardListUi={cardListUi}
						cardsData={cardsData}
						renderStatic={this.renderStatic}
						onViewCardDetails={this._viewCardDetails}
						onAddCard={this._goToAddCard}
						onRetryCardList={this._refreshCardList}
						onPurchaseCredit={this._goToPurchaseCredit}
						onScooterHelp={this._handleScooterHelp}
						onScooterReport={this._handleScooterReport}
						onScooterBegin={this._handleScooterBegin}
						isServiceMenuCollapsed={isServiceMenuCollapsed}
						onToggle={this._handleCardCollapse}
						showProgressBar={showProgressBar}
						hasAlert={hasAlert}
						onCompleteRegistration={onCompleteRegistration}
						isMenuService={isMenuService}
            serviceMenuType={serviceMenuType}
            onScooterPaymentPending={this._handleScooterPaymentPending}
						onRef={(ref) => {
							this._CollapsibleCard = ref;
						}}
						isZazcar={isZazcar}
						onNavigateToTaxi={this._onNavigateToTaxi}
            onNavigateToCarro={this._onNavigateToCarro}
            onRetryRequestCard={this._refreshRequestCard}
					/>
				</View>
				<DiscountInfoModal
					onDismiss={this._toggleDiscountModal}
					isVisible={this.state.isDiscountModalVisible}
				/>
				<Modal
					animationType="slide"
					transparent={false}
					visible={this.state.isAcceptUsageTerms}
					onRequestClose={() => {}}
				>
					<View style={{ flex: 1 }}>
						<ScooterUsageTerms
							onPressClose={this._handlerOnPressClose}
							onPressAcceptTerms={this._handlerOnPressAccpetTerms}
						/>
					</View>
				</Modal>
			</Fragment>
		);
	}
}

export const COLLAPSIBLE_HEIGHT = 126;

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		width: '100%',
		bottom: 0
	},
	collapsible: {
		alignSelf: 'stretch'
	},
	collapsibleContent: {
		paddingVertical: 8
	},
	staticContent: {
		paddingTop: 16,
		paddingBottom: 8,
		height: 142
	},
	hr: {
		alignSelf: 'stretch',
		height: 1,
		marginHorizontal: 16,
		backgroundColor: colors.GRAY_LIGHTER
	},
	listTitle: {
		marginHorizontal: 16,
		fontSize: 12,
		fontWeight: 'bold',
		color: colors.GRAY_DARK
	},
	listContainer: {
		alignSelf: 'stretch'
	},
	badgesListContent: {
		paddingVertical: 8,
		paddingHorizontal: 16
	},
	listContainerContent: {
		flexGrow: 1,
		flexDirection: 'row',
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
	cardButton: {
		marginRight: 8
	},
	// buy button
	buyButtonContainer: {
		position: 'absolute',
		top: 0,
		right: 0,
		left: 0,
		padding: 16
	},
	buyButtonTouchable: {
		borderRadius: 18
	},
	buyButton: {
		alignItems: 'center',
		padding: 10,
		borderRadius: 18
	},
	buyButtonText: {
		fontSize: 12,
		lineHeight: 16,
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'white'
	},
	centerPosition: {
		alignItems: 'flex-end',
		// compensate shadow clipping on android with padding
		marginBottom: Platform.OS === 'android' ? 8 : 16,
		marginRight: Platform.OS === 'android' ? 8 : 16,
		padding: Platform.OS === 'android' ? 8 : 0
	},
	centerPositionIconContainer: {
		backgroundColor: 'white',
		borderRadius: 50,
		padding: 8,
		elevation: 5,
		shadowColor: 'rgba(0, 0, 0, 0.25)',
		shadowOpacity: 1,
		shadowRadius: 6,
		shadowOffset: {
			height: 2,
			width: 0
		}
	},

	toastErrorContainer: {
		backgroundColor: colors.BRAND_ERROR,
		height: 80,
		marginBottom: -10,
		bottom: -70
	},
	toastError: {
		flex: 1,
		justifyContent: 'center',
		marginBottom: 10
	},
	toastErrorText: {
		color: 'white',
		paddingHorizontal: 16
	},
	debugView: {
		backgroundColor: 'black',
		flexDirection: 'row'
	}
});

ServicesMenu.propTypes = {
	onRef: PropTypes.func,
	nav: PropTypes.object,
	dispatch: PropTypes.func,
	geolocPermGranted: PropTypes.bool,
	hasConfigError: PropTypes.bool,
	// bomCreditValueRange: PropTypes.object,
	minCreditValue: PropTypes.number,
	issuerConfig: PropTypes.object,
	configUi: PropTypes.object,
	onRentCarLocation: PropTypes.func,
	onBusLocation: PropTypes.func,
	onNearbyTembiciLocation: PropTypes.func,
	menuTembiciLocation: PropTypes.func,
	isZazcar: PropTypes.bool,
	isBus: PropTypes.bool,
	isScoo: PropTypes.bool,
	isTembici: PropTypes.bool,
	isServiceMenuCollapsed: PropTypes.bool,
	purchaseCredit: PropTypes.bool,
	parentRequestsUi: PropTypes.object,
	positionError: PropTypes.object,
	onParentRequestsRetry: PropTypes.func,
	onCenterLocation: PropTypes.func,
	onToggle: PropTypes.func,
	style: PropTypes.object,
	cardsData: PropTypes.array,
	cardListUi: PropTypes.object,
	isGettingPosition: PropTypes.bool,
	hasAlert: PropTypes.bool,
	onCompleteRegistration: PropTypes.func,
	shouldRenderCenterOnLocationButton: PropTypes.bool,
	renderOnTop: PropTypes.func,
	shouldRenderToast: PropTypes.bool,
	isMenuService: PropTypes.bool,
	onBycicleLocation: PropTypes.func,
	onScooLocation: PropTypes.func,
	serviceMenuType: PropTypes.string,
	onNearbyZazcarLocation: PropTypes.func,
	renderRidePoints: PropTypes.func
};

ServicesMenu.defaultProps = {};

function mapStateToProps(state) {
  return {
    phoneIsConfirmed: getUserPhoneValidRecharge(state),
    cardsData: getTransportCards(state),
    cardListUi: getCardListUI(state),
    pointsOfInterest: state.pointsOfInterest.data,
    hasConfigError: getHasConfigError(state),
    issuerConfig: getIssuerConfig(state),
    isGettingPosition: state.profile.position.isGettingPosition,
    hasAlert: getHasProfileAlerts(state),
    configUi: getConfigContentUI(state),
    geolocPermGranted: state.profile.position.geolocPermGranted,
    profileData: state.profile.data,
    pendingRide: state.scooter.pendingRide,
    pendingTransactionRide: state.scooter.pendingTransactionRide,
    selectedPaymentMethod: getSelectedPaymentMethod(state),
    listTicket: state.ticketUnitary,
  };
}

export default connect(mapStateToProps)(ServicesMenu);
