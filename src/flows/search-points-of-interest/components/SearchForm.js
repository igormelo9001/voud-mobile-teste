// NPM imports
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import {
  StyleSheet,
  View,
} from 'react-native';

// VouD imports
import Icon from '../../../components/Icon';
import VoudText from '../../../components/VoudText';
import TouchableNative from '../../../components/TouchableNative';
import ButtonField from '../../../flows/home/components/ButtonField';
import { colors } from '../../../styles';
import { clearReduxForm } from '../../../utils/redux-form-util';
import { fetchPlaceTextSearch } from '../../../flows/mobility-services/actions';
import Spinner from '../../../components/Spinner';
import { TYPES } from './SwitchTypeSearch';
import SearchFormDottedLine from './SearchFormDottedLine';




// consts
export const reduxFormName = 'searchForm';
export const searchInputs = {
  ORIGIN_INPUT: 'originLocationAddress',
  DESTINATION_INPUT: 'destinationLocationAddress',
}

// Component
class SearchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      originLocationAddressIsLoading: false,
      originLocationAddressHasError: false,
      isDefiningOriginLocation: false,
    }
  }

  componentDidMount() {
    this._getUserLocation();
    this.props.onRef(this);
  }

  componentWillUnmount() {
    clearReduxForm(this.props.dispatch, reduxFormName);
  }

  // Location
  _getUserLocation = async () => {

    const {
      position,
      dispatch,
      change,
    } = this.props;
    const { latitude, longitude } = position;

    this.setState({
      originLocationAddressIsLoading: true,
      originLocationAddressHasError: false,
    });

    try {
      change('hasSelectedUserLocation', false);

      const response = await dispatch(fetchPlaceTextSearch(`${latitude},${longitude}`));
      // remove CEP, neighborhood, city from string using split
      const originLocationAddress = response.results[0].formatted_address;
      this.setState({
        originLocationAddressIsLoading: false,
        originLocationAddress
      })

      change(searchInputs.ORIGIN_INPUT, originLocationAddress);
      change('hasSelectedUserLocation', true);

    } catch (error) {
      this.setState({
        originLocationAddressHasError: true,
        originLocationAddressIsLoading: false,
      });
    }
  }

  toggleDefineLocationMode = (onStateChange) => {
    const {
      updateFocusedField,
    } = this.props;

    this.setState({
      isDefiningOriginLocation: !this.state.isDefiningOriginLocation,
    }, () => {
      const {
        hasSelectedUserLocation,
        hasSelectedDestination,
        change
      } = this.props;
      if (!hasSelectedUserLocation) change(searchInputs.ORIGIN_INPUT, '');
      if (!hasSelectedDestination) change(searchInputs.DESTINATION_INPUT, '');

      onStateChange && onStateChange();
    });

    this.state.isDefiningOriginLocation ?
      updateFocusedField(searchInputs.DESTINATION_INPUT) :
      updateFocusedField(searchInputs.ORIGIN_INPUT);
  }

  setLocationMode = (searchInput, onStateChange) => {
    const {
      updateFocusedField,
    } = this.props;
    const setOriginInput = searchInput === searchInputs.ORIGIN_INPUT;

    this.setState({
      isDefiningOriginLocation: setOriginInput,
    }, () => {
      const {
        hasSelectedUserLocation,
        hasSelectedDestination,
      } = this.props;
      if (!hasSelectedUserLocation) this._clearOriginInputValue();
      if (!hasSelectedDestination) this._clearDestinationInputValue();

      onStateChange && onStateChange();
    });

    updateFocusedField(setOriginInput ?
      searchInputs.ORIGIN_INPUT : searchInputs.DESTINATION_INPUT);
  }

  _clearOriginInputValue = () => {
    const { change } = this.props;
    change(searchInputs.ORIGIN_INPUT, '');
    change('hasSelectedUserLocation', false);
  }

  _clearDestinationInputValue = () => {
    const { change } = this.props;
    change(searchInputs.DESTINATION_INPUT, '');
    change('hasSelectedDestination', false);
  }

  clearUserLocationField = () => {
    this.setLocationMode(searchInputs.ORIGIN_INPUT, () => {
      this._clearOriginInputValue();
      this.focusUserLocationField();
    });
  }

  focusUserLocationField = () => {
    if (this.UserLocationField) this.UserLocationField.focus();
  }

  // Render
  _renderUserLocationActionButton = () => {
    const {
      originLocationAddressIsLoading,
      originLocationAddressHasError,
    } = this.state;

    const {
      originLocationAddress,
    } = this.props;

    return (
      <Fragment>
        {/* ===================== */}
        {/* ERROR =============== */}
        {/* ===================== */}
        {
          !originLocationAddress &&
          !originLocationAddressIsLoading &&
          originLocationAddressHasError &&
          <TouchableNative
            onPress={this._onUseMyLocation}
            borderless
          >
            <VoudText style={styles.geoLocationButton}>
              TENTAR NOVAMENTE
            </VoudText>
          </TouchableNative>
        }

        {/* ===================== */}
        {/* NO ADDR ============= */}
        {/* ===================== */}
        {
          !originLocationAddress &&
          !originLocationAddressIsLoading &&
          !originLocationAddressHasError &&
          <TouchableNative onPress={() => {
            this.toggleDefineLocationMode(this.focusUserLocationField);
          }}>
            <VoudText style={styles.geoLocationButton}>
              DEFINIR
            </VoudText>
          </TouchableNative>
        }

        {/* ===================== */}
        {/* HAS ADDR ============ */}
        {/* ===================== */}
        {
          originLocationAddress &&
          !originLocationAddressIsLoading &&
          !originLocationAddressHasError &&
          <TouchableNative onPress={this.clearUserLocationField}>
            {/* <VoudText style={styles.geoLocationButton}>
              LIMPAR
            </VoudText> */}
            <Icon
                 name="close"
                 style={styles.closeIcon}
                />
          </TouchableNative>
        }
      </Fragment>
    )
  }

  _renderUserLocationString = () => {
    const {
      originLocationAddressIsLoading,
      originLocationAddressHasError
    } = this.state;
    const {
      originLocationAddress,
    } = this.props;

    return (
      <Fragment>
        {/* ===================== */}
        {/* LOADING ============= */}
        {/* ===================== */}
        {
          originLocationAddressIsLoading &&
          !originLocationAddressHasError &&
          <VoudText
            style={styles.userLocationEmptyLabel}>
            Carregando localização...
          </VoudText>
        }

        {/* ===================== */}
        {/* ERROR =============== */}
        {/* ===================== */}
        {
          originLocationAddressHasError &&
          !originLocationAddressIsLoading &&
          <VoudText
            style={styles.userLocationEmptyLabel}
          >
            Ocorreu um erro.
          </VoudText>
        }

        {/* ===================== */}
        {/* EMPTY =============== */}
        {/* ===================== */}
        {
          !originLocationAddress &&
          !originLocationAddressIsLoading &&
          !originLocationAddressHasError &&
          <TouchableNative
            style={styles.userLocationEmptyLabelContainer}
            onPress={() => {
              this.toggleDefineLocationMode(this.focusUserLocationField);
            }}
          >
            <VoudText style={styles.userLocationEmptyLabel}>
              Insira sua localização
            </VoudText>
          </TouchableNative>
        }

        {/* ===================== */}
        {/* NORMAL ============== */}
        {/* ===================== */}
        {
          originLocationAddress &&
          !originLocationAddressIsLoading &&
          <TouchableNative
            style={styles.userLocationEmptyLabelContainer}
            onPress={() => {
              this.toggleDefineLocationMode(() => {
                this.focusUserLocationField();
              });
            }}
          >
            <VoudText
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.userLocationLabel}
            >
              <VoudText style={styles.originLocationAddress}>
                {originLocationAddress}
              </VoudText>
            </VoudText>
          </TouchableNative>
        }
      </Fragment>
    )
  }

  _onUseMyLocation = async () => {
    const { hasSelectedDestination } = this.props;
    this.setState({ isDefiningOriginLocation : false });

    await this._getUserLocation();

    if (!hasSelectedDestination) {
      this.props.updateFocusedField(searchInputs.DESTINATION_INPUT);
      this.focusDestinationField();
    }
  }

  _renderDefineLocationInput = () => {
    const {
      originLocationAddressIsLoading,
      originLocationAddressHasError
    } = this.state;
    if (originLocationAddressIsLoading && !originLocationAddressHasError) {
      return (
        <VoudText
          style={styles.userLocationEmptyLabel}>
          Carregando localização...
        </VoudText>
      )
    }
    return (
      <View style={styles.userLocationField}>
        <Field
          name="originLocationAddress"
          onChange={this.props.onChangeStartLocation}
          props={{
            textFieldRef: el => this.UserLocationField = el,
            value: this.props.originLocationAddress,
            inputStyle: styles.textInput,
            selectionColor: colors.BRAND_PRIMARY,
            placeholderTextColor: colors.GRAY,
            placeholder: "Digite o endereço de origem",
            underlineColorAndroid: 'transparent',
            icon: "pin-large",
            rightIcon: "my-location",
            rightActionPress: this._onUseMyLocation,
            hasField: true
          }}
          component={ButtonField}
        />
      </View>
    )
  }

  focusDestinationField = () => {
    if (this.DestinationField) this.DestinationField.focus();
  }

  clearDestinationField = () => {
    this.setLocationMode(searchInputs.DESTINATION_INPUT, () => {
      this.props.change(searchInputs.DESTINATION_INPUT, '');
      this.focusDestinationField();
    });
  }

  render() {
    const {
      selectedSearchType,
      destinationLocationAddress,
    } = this.props;
    const {
      originLocationAddressIsLoading,
      isDefiningOriginLocation,
      originLocationAddressHasError,
    } = this.state;

    return (
      <View style={styles.content}>
        <View style={styles.headerSearch}>
          {/* ======================= */}
          {/* ORIGIN ================ */}
          {/* ======================= */}
          <View style={styles.headerFieldRow}>
            {
              !isDefiningOriginLocation &&
              <Fragment>
                {
                  originLocationAddressHasError && !originLocationAddressIsLoading &&
                  <Icon name="alert" style={styles.pin} />
                }
                {
                  !originLocationAddressIsLoading && !originLocationAddressHasError &&
                  <Icon name="md-radio-button-on" style={styles.pin} />
                }
              </Fragment>
            }
            {
              originLocationAddressIsLoading && !originLocationAddressHasError &&
              <Spinner style={styles.spinner} iconSize={16} />
            }
            <View style={styles.contentLocation}>
              <View style={styles.locationFields}>
                {!isDefiningOriginLocation && this._renderUserLocationString()}
                {isDefiningOriginLocation && this._renderDefineLocationInput()}

                {!isDefiningOriginLocation && this._renderUserLocationActionButton()}
              </View>
            </View>
          </View>

          {/* =========================== */}
          {/* DESTINATION =============== */}
          {/* =========================== */}
          <View style={styles.headerFieldRow}>
            {
              (isDefiningOriginLocation && !destinationLocationAddress) && (
                <Fragment>
                  <TouchableNative
                    onPress={() => {
                      this.toggleDefineLocationMode(this.focusDestinationField);
                    }}
                    style={styles.fakeView}
                  >
                    <Icon
                      name={selectedSearchType === TYPES.ROUTES ? "pin" : "md-search"}
                      style={styles.pin}
                    />
                  </TouchableNative>
                  <TouchableNative onPress={() => {
                    this.toggleDefineLocationMode(this.focusDestinationField);
                  }}>
                    <VoudText style={styles.defineLocationButton}>
                      DEFINIR
                    </VoudText>
                  </TouchableNative>
                </Fragment>
              )
            }

            {
              !isDefiningOriginLocation &&
              <View style={styles.buttonField}>
                <Field
                  name="destinationLocationAddress"
                  onChange={this.props.onChangeDestinationLocation}
                  props={{
                    textFieldRef: el => this.DestinationField = el,
                    value: this.props.destinationLocationAddress,
                    inputStyle: styles.textInput,
                    selectionColor: colors.BRAND_PRIMARY,
                    placeholderTextColor: colors.GRAY,
                    placeholder: selectedSearchType === TYPES.ROUTES ? "Insira um destino" : "Rotas, linhas ou pontos de recarga",
                    underlineColorAndroid: 'transparent',
                    icon: selectedSearchType === TYPES.ROUTES ? "pin" : "md-search",
                    hasField: true
                  }}
                  component={ButtonField}
                />
              </View>
            }

            {
              (isDefiningOriginLocation && destinationLocationAddress) &&
              <Fragment>
                <Icon
                  name={selectedSearchType === TYPES.ROUTES ? "pin-drop-large" : "md-search"}
                  style={styles.pin}
                />
                <TouchableNative
                  style={styles.destinationTextContainer}
                  onPress={this.toggleDefineLocationMode}
                >
                  <VoudText
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={styles.destinationText}
                  >
                    {destinationLocationAddress}
                  </VoudText>
                </TouchableNative>
              </Fragment>
            }
          </View>

          <View style={styles.hr}>
            <SearchFormDottedLine selectedSearchType={selectedSearchType} />
          </View>
        </View>
      </View>
    );
  }
}

// styles
const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingRight: 16
  },
  headerSearch: {
    position: 'relative',
    flex: 1,
    height: 96,
    flexDirection: 'column',
  },
  contentLocation: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    color: colors.GRAY,
  },
  pin: {
    fontSize: 22,
    color: colors.BRAND_PRIMARY,
    width: 24,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginRight: 8,
    marginLeft: 14
  },
  spinner: {
    width: 24,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginRight: 8,
    marginLeft: 14
  },
  userLocationEmptyLabelContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  userLocationEmptyLabel: {
    fontSize: 14,
    flex: 1,
    color: colors.BRAND_NOTIFICATION,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  userLocationLabel: {
    fontSize: 12,
    color: colors.BRAND_PRIMARY,
    fontWeight: 'bold',
    marginRight: 8,
  },
  originLocationAddress: {
    fontWeight: 'normal',
    color: colors.GRAY_DARK,
  },
  destinationTextContainer: {
    flex: 1,
  },
  destinationText: {
    color: colors.GRAY_DARK,
  },
  locationFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  buttonField: {
    height: 48,
    flex: 1,
  },
  userLocationField: {
    height: 48,
    flex: 1,
  },
  geoLocationButton: {
    color: colors.BRAND_PRIMARY,
    fontSize: 10,
    fontWeight: 'bold',
  },
  defineLocationButton: {
    color: colors.BRAND_PRIMARY,
    fontSize: 10,
    fontWeight: 'bold',
  },

  headerFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    marginTop: -32,
  },

  hr: {
    position: 'absolute',
    top: 27,
    left: 24,
    elevation: 4,
  },
  fakeView: {
    borderRadius: 24,
    height: 48,
    flex: 1,
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: colors.BRAND_PRIMARY
  },
});

// Redux
const mapStateToProps = state => ({
  initialValues: {
    hasSelectedDestination: false,
    hasSelectedUserLocation: false,
  },
  hasSelectedUserLocation: formValueSelector(reduxFormName)(state, 'hasSelectedUserLocation'),
  hasSelectedDestination: formValueSelector(reduxFormName)(state, 'hasSelectedDestination'),
  position: state.profile.position,
  state,

}
);

export default connect(mapStateToProps)(reduxForm({ form: reduxFormName, destroyOnUnmount: false })(SearchForm));
