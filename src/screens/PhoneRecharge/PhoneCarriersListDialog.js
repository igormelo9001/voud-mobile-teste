// NPM imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View, FlatList } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { formValueSelector, change } from 'redux-form';

// VouD Imports
import Dialog from '../../components/Dialog';
import BrandText from '../../components/BrandText';
import TouchableText from '../../components/TouchableText';
import { colors } from '../../styles';
import { reduxFormName } from './RechargeForm';
import Icon from '../../components/Icon';
import { fetchCarrierValues } from '../../redux/phone-recharge';
import TouchableNative from '../../components/TouchableNative';
import { GAEventParams, GATrackEvent } from '../../shared/analytics';

// Component
const propTypes = {
  phoneCarrierId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  carrierList: PropTypes.array.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
}

class PhoneCarriersListView extends Component {

  _dismiss = () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.back());
  };

  _renderCarrierItem = ({ item }) => {
    const { phoneCarrierName } = this.props;
    const isSelected = item.name === phoneCarrierName;

    return (
      <TouchableNative
        style={styles.carrierItem}
        textStyle={isSelected ? styles.carrierItemTextActive : {}}
        color={colors.GRAY_DARKER}
        onPress={() => { this._selectCarrier(item); }}
      >
        {
          isSelected &&
          <View style={styles.carrierItemIcon}>
            <Icon
              name='done'
              size={16}
              color={colors.BRAND_PRIMARY_LIGHTER}
            />
          </View>
        }
        <BrandText>{item.name}</BrandText>
      </TouchableNative>
    );
  }

  _selectCarrier = carrier => {
    const { dispatch, phoneNumber } = this.props;
    const ddd = phoneNumber.substring(0, 2);

    const { categories: { BUTTON }, actions: { CLICK }, labels: { SELECT_PHONE_CARRIER } } = GAEventParams;
    GATrackEvent(BUTTON, CLICK, `${SELECT_PHONE_CARRIER}-${carrier.name}`);

    dispatch(change(reduxFormName, 'phoneCarrierName', carrier.name));

    // Reset previous selected value, if any
    dispatch(change(reduxFormName, 'selectedValue', null));

    // Init carrier values call
    dispatch(fetchCarrierValues(ddd, carrier.name));
    this._dismiss();
  }

  render() {
    const { carrierList } = this.props;

    return (
      <View style={styles.container}>
        <Dialog 
          style={styles.listDialog}
          noPadding
          onDismiss={this._dismiss}
        >
          <View style={styles.listContainer}>
            <BrandText style={styles.titleText}>Escolha a sua operadora</BrandText>

            {
              carrierList.length === 0 &&
              <BrandText style={styles.emptyStateText}>Nenhuma operadora encontrada para este DDD. Por favor, informe outro número.</BrandText>
            }

            {
              carrierList.length > 0 &&
              <FlatList
                data={carrierList.map(carrier => ({ key: carrier.name, name: carrier.name }))}
                renderItem={this._renderCarrierItem}
              />
            }
          </View>

          <View style={styles.actions}>
            <TouchableText
              onPress={this._dismiss}
              color={colors.GRAY}
            >
              Cancelar
            </TouchableText>
          </View>
        </Dialog>
      </View>
    )
  }
}

PhoneCarriersListView.propTypes = propTypes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listDialog: {
    height: 'auto'
  },

  listContainer: {
    maxHeight: 440,
    padding: 16,
  },

  titleText: {
    color: colors.BRAND_PRIMARY,
    marginBottom: 16,
  },

  emptyStateText: {
    color: colors.GRAY,
    textAlign: 'center',
  },

  carrierItem: {
    paddingVertical: 16,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  carrierItemTextActive: {
    fontWeight: 'bold',
  },
  carrierItemIcon: {
    width: 20,
    height: 16,
  },

  actions: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: colors.GRAY_LIGHTER,
  },
})

function mapStateToProps(state) {
  return {
    phoneNumber: selectedCarrierFormValueSelector(state, 'phoneNumber'),
    phoneCarrierName: selectedCarrierFormValueSelector(state, 'phoneCarrierName'),
    carrierList: state.phoneRecharge.carriers.data
  };
}

const selectedCarrierFormValueSelector = formValueSelector(reduxFormName);

export const PhoneCarriersList = connect(mapStateToProps)(PhoneCarriersListView);