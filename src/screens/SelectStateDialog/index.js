// NPM imports
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { formValueSelector, change } from 'redux-form';

// VouD imports
import BrandText from '../../components/BrandText';
import Dialog from '../../components/Dialog';
import Icon from '../../components/Icon';
import { colors } from '../../styles/constants';
import TouchableNative from '../../components/TouchableNative';

const stateOptions = ["Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"];


// Component
class SelectStateDialogView extends Component {

  _dismiss = () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.back());
  };

  _selectState = state => {
    const { dispatch } = this.props;
    const { reduxFormName } = this.props.navigation.state.params;

    dispatch(change(reduxFormName, 'state', state));
    this._dismiss();
  }

  render() {
    const { selectedState } = this.props;

    return (
      <View style={styles.container}>
        <Dialog
          noPadding
          onDismiss={this._dismiss}
        >
          <ScrollView>
          {
            stateOptions.map(state => (
              <TouchableNative
                key={state}
                onPress={() => this._selectState(state)}
                style={styles.stateOption}
              >
                <Icon
                  name='done'
                  style={state === selectedState ? {} : { opacity: 0 }}
                  size={24}
                  color={colors.BRAND_PRIMARY_LIGHTER}
                />
                <BrandText style={styles.stateOptionText}>{state}</BrandText>
              </TouchableNative>
            ))
          }
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
    flex: 1
  },
  stateOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    height: 48
  },
  stateOptionText: {
    marginLeft: 16,
    fontSize: 16,
    lineHeight: 20,
    color: colors.GRAY_DARKER
  },
});

// redux connect and export
const mapStateToProps = (state, ownProps) => {
  const editAddressFormSelector = formValueSelector(ownProps.navigation.state.params.reduxFormName);
  return {
    selectedState: editAddressFormSelector(state, 'state'),
  }
};

export const SelectStateDialog = connect(mapStateToProps)(SelectStateDialogView);

