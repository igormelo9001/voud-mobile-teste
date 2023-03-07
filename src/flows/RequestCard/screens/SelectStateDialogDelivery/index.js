// NPM imports
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { formValueSelector, change } from 'redux-form';

// VouD imports
import BrandText from '../../../../components/BrandText';
import Dialog from '../../../../components/Dialog';
import Icon from '../../../../components/Icon';
import { colors } from '../../../../styles/constants';
import TouchableNative from '../../../../components/TouchableNative';
import { fetchCardAddressRequested } from '../../store/requestCardAddress';

const stateOptions = [
  'Acre',
  'Alagoas',
  'Amapá',
  'Amazonas',
  'Bahia',
  'Ceará',
  'Distrito Federal',
  'Espírito Santo',
  'Goiás',
  'Maranhão',
  'Mato Grosso',
  'Mato Grosso do Sul',
  'Minas Gerais',
  'Pará',
  'Paraíba',
  'Paraná',
  'Pernambuco',
  'Piauí',
  'Rio de Janeiro',
  'Rio Grande do Norte',
  'Rio Grande do Sul',
  'Rondônia',
  'Roraima',
  'Santa Catarina',
  'São Paulo',
  'Sergipe',
  'Tocantins',
];

// Component
class SelectStateDialogDeliveryView extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const {
      params: { localWithdrawal },
    } = this.props.navigation.state;
    if (localWithdrawal) dispatch(fetchCardAddressRequested());
  }

  _dismiss = () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.back());
  };

  _selectState = state => {
    const { dispatch } = this.props;
    const { reduxFormName } = this.props.navigation.state.params;

    const {
      params: { localWithdrawal },
    } = this.props.navigation.state;
    const typeState = localWithdrawal ? '' : 'stateDelivery';
    dispatch(change(reduxFormName, typeState, state));
    this._dismiss();
  };

  renderItensAddress = state => {
    const {
      params: { localWithdrawal },
    } = this.props.navigation.state;

    const stylesText = localWithdrawal
      ? styles.stateOptionTextLocalWithdrawal
      : styles.stateOptionText;

    if (localWithdrawal) {
      return (
        <View>
          <BrandText style={stylesText}>{state.name}</BrandText>
          <BrandText style={stylesText}>{state.shortAddress}</BrandText>
        </View>
      );
    }
    return <BrandText style={stylesText}>{state}</BrandText>;
  };

  render() {
    const { selectedState, listAddress } = this.props;
    const {
      params: { localWithdrawal },
    } = this.props.navigation.state;

    const list = localWithdrawal ? listAddress : stateOptions;
    const stylesOption = localWithdrawal ? styles.stateOptionLocalWithdrawal : styles.stateOption;

    return (
      <View style={styles.container}>
        <Dialog noPadding onDismiss={this._dismiss}>
          <ScrollView>
            {list.map(state => (
              <TouchableNative
                key={state}
                onPress={() => this._selectState(state)}
                style={stylesOption}
              >
                <Icon
                  name="done"
                  style={state === selectedState ? {} : { opacity: 0 }}
                  size={24}
                  color={colors.BRAND_PRIMARY_LIGHTER}
                />
                {/* <BrandText style={stylesText}>{state}</BrandText> */}
                {this.renderItensAddress(state)}
              </TouchableNative>
            ))}
          </ScrollView>
        </Dialog>
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    flex: 1,
  },
  stateOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    height: 48,
  },
  stateOptionLocalWithdrawal: {
    flex: 1,
    // flexDirection: "row",
    alignItems: 'center',
    // padding: 16,
    // height: 80,
  },
  stateOptionText: {
    marginLeft: 16,
    fontSize: 16,
    lineHeight: 20,
    color: colors.GRAY_DARKER,
  },
  stateOptionTextLocalWithdrawal: {
    fontSize: 12,
    // lineHeight: 20,
    color: colors.GRAY_DARKER,
    // backgroundColor:"red",
    // margin: 5,
    // marginTop: 8,
    paddingHorizontal: 5,
    // lineHeight: 15,
  },
});

// redux connect and export
const mapStateToProps = (state, ownProps) => {
  const editAddressFormSelector = formValueSelector(ownProps.navigation.state.params.reduxFormName);
  const typeState = state.requestCardAddress.data.length > 0 ? 'localWithdrawal' : 'stateDelivery';
  return {
    selectedState: editAddressFormSelector(state, typeState),
    listAddress: state.requestCardAddress.data,
  };
};

export const SelectStateDialogDelivery = connect(mapStateToProps)(SelectStateDialogDeliveryView);
