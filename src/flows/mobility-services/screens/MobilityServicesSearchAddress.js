// NPM imports
import React, { Component } from 'react';
import { FlatList, Keyboard, View, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';

// VouD imports
import Header, { headerActionTypes } from '../../../components/Header';
import Progress from '../../../components/Progress';
import { colors } from '../../../styles';


// Module imports
import PredictionItem from '../../../components/PredictionItem';
import SystemText from '../../../components/SystemText';
import { getPredictionsUi } from '../reducer';
import { fetchPredictions, clearPredictions } from '../actions';
import SearchAddressForm from '../components/SearchAddressForm';
import LoadMask from '../../../components/LoadMask';

// Screen component
class MobilityServicesSearchAddressView extends Component {
  constructor(props) {
    super(props);
    this.textFieldRef = null;

    this.state = {
      canShowEmptyState: false,
      showErrorState: false,
      isSettingLocal: false,
    };

    this._debounceFetchPredictions = debounce(this.fetchPredictions, 750);
  }

  componentDidMount() {
    this.focusTextField();
  }

  componentWillUnmount() {
    this.props.dispatch(clearPredictions());
  }

  focusTextField = () => {
    if (this.textFieldRef) this.textFieldRef.focus();
  }

  dismiss = () => {
    const { dispatch } = this.props;
    Keyboard.dismiss();
    dispatch(NavigationActions.back());
  };

  useMyLocation = () => {
    this.setState({ isSettingLocal: true });
    Keyboard.dismiss();

    this.props.navigation.state.params.checkPermissionAndUseLocation().then(
      (isAllowed) => {
        this.setState({ isSettingLocal: false });
        if (isAllowed) {
          this.dismiss();
        } else {
          this.focusTextField();
        }
      },
      () => {
        this.setState({ isSettingLocal: false });
        this.focusTextField();
      },
    );
  };

  fetchPredictions = (input = '') => {
    if (input.length > 3) {
      this.props.dispatch(fetchPredictions(input)).then(
        () => {
          this.setState({ canShowEmptyState: true });
        },
        () => {
          this.setState({ showErrorState: true });
        },
      );
    }
  };

  clearPredictions = () => {
    this.setState({
      canShowEmptyState: false,
      showErrorState: false,
    });
    this.props.dispatch(clearPredictions());
  };

  changeText = (value) => {
    this.clearPredictions();
    this._debounceFetchPredictions(value);
  }

  renderPredictions = () => {
    const { predictions, navigation } = this.props;
    const { select, isOrigin, isDestination } = navigation.state.params;
    const { showErrorState, canShowEmptyState } = this.state;

    // render error state
    if (showErrorState) return (
      <View style={styles.emptyState}>
        <SystemText style={styles.errorStateText}>Ocorreu um erro na busca de endereços</SystemText>
      </View>
    )

    // render empty state
    if (canShowEmptyState && predictions && !predictions[0]) return (
      <View style={styles.emptyState}>
        <SystemText style={styles.emptyStateText}>Local não encontrado</SystemText>
      </View>
    )

    // render list
    if (predictions && predictions[0]) return (
      <FlatList
        data={predictions}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <PredictionItem
            mainText={item.structured_formatting.main_text}
            secondaryText={item.structured_formatting.secondary_text}
            onPress={() => {
              select(item.place_id, isOrigin, isDestination);
              this.dismiss();
            }}
            style={StyleSheet.flatten([styles.predictionItem, index === 0 ? styles.predictionItemNoBorder : {}])}
          />
        )}
        keyboardShouldPersistTaps="always"
        style={styles.list}
      />
    )

    // initial state
    return null;
  };

  render() {
    const { ui, navigation } = this.props;
    const { isOrigin } = navigation.state.params;

    return (
      <View style={styles.container}>
        <Header
          title={isOrigin ? 'Partida' : 'Destino'}
          left={{
            type: headerActionTypes.BACK,
            onPress: this.dismiss,
          }}
        />
        <SearchAddressForm
          isOrigin={isOrigin}
          textFieldRef={(el) => { this.textFieldRef = el; }}
          onChangeText={this.changeText}
          onMyLocationPress={this.useMyLocation}
        />
        <View style={styles.listWrapper}>
          {ui.isFetching && <Progress />}
          {this.renderPredictions()}
        </View>
        {this.state.isSettingLocal && <LoadMask message="Selecionando local" />}
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listWrapper: {
    flex: 1,
    backgroundColor: colors.GRAY_LIGHTER,
  },
  list: {
    flex: 1,
  },
  predictionItem: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: colors.GRAY_LIGHTER,
    backgroundColor: 'white',
  },
  predictionItemNoBorder: {
    borderTopWidth: 0,
  },
  emptyState: {
    alignSelf: 'stretch',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: colors.GRAY,
  },
  errorStateText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: colors.BRAND_ERROR,
  },
});

// Redux
const mapStateToProps = state => ({
  predictions: state.mobilityServices.predictions.data,
  ui: getPredictionsUi(state),
});

export const MobilityServicesSearchAddress = connect(mapStateToProps)(MobilityServicesSearchAddressView);
