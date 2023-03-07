// NPM imports
import React, { Component, Fragment } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

// VouD Imports
import RechargeValue from './RechargeValue';
import SystemText from '../../components/SystemText';
import { colors } from '../../styles';
import RequestFeedbackSmall from '../../components/RequestFeedbackSmall';
import divideArrayIntoRows from '../../utils/divide-array-into-rows';

// Component
const propTypes = {
  isFetching: PropTypes.bool.isRequired,
  valueList: PropTypes.array.isRequired,
  style: PropTypes.number,
  onSelectRechargeValue: PropTypes.func.isRequired,
  activeValue: PropTypes.object,
  error: PropTypes.string,
  retryGetValuesList: PropTypes.func,
}

const ITEMS_PER_ROW = 3;

class RechargeValueList extends Component {

  _renderValueList = () => {
    const {
      valueList,
      activeValue,
      onSelectRechargeValue,
    } = this.props;
    const rows = divideArrayIntoRows(valueList, ITEMS_PER_ROW);

    return rows.map((valueGroup, index) => {
      const fillSpaceLength = ITEMS_PER_ROW - valueGroup.length;
      return (
        <View
          key={valueGroup[0] ? valueGroup[0].custRecharge : null}
          style={StyleSheet.flatten([styles.valueRow, index === rows.length - 1 ? styles.mb0 : {}])}
        >
          {
            valueGroup.map((value, index) => {
              const isActive = activeValue ? activeValue.custRecharge === value.custRecharge : false;

              return (
                <RechargeValue
                  isActive={isActive}
                  onPress={() => { onSelectRechargeValue(value) }}
                  key={value.custRecharge}
                  value={value.custRecharge}
                  noMarginRight={index === ITEMS_PER_ROW - 1}
                />
              )
            })
          }
          {
            [...Array(fillSpaceLength)].map((value, index) => (
              <View 
                key={`fill-space-${index}`}
                style={StyleSheet.flatten([styles.fillSpace, index === fillSpaceLength - 1 ? styles.mr0 : {}])}
              />
            ))
          }
        </View>
      )
    })
  }

  render() {
    const {
      style,
      valueList,
      isFetching,
      error,
      retryGetValuesList,
    } = this.props;

    return (
      <View style={style}>
        {
          (isFetching || (error && error !== '') || valueList.length === 0) &&
          <RequestFeedbackSmall
            isFetching={isFetching}
            loadingMessage="Carregando valores de recarga disponíveis..."
            error={error}
            errorMessage="Ocorreu um erro ao carregar os valores de recarga disponíveis"
            onRetry={retryGetValuesList}
            isEmpty={valueList.length === 0}
            emptyMessage="Não há produtos desta operadora para a sua região. Deseja escolher outra operadora?"
          />
        }

        {
          !isFetching && !error && valueList.length > 0 &&
          <Fragment>
            <SystemText style={styles.rechargeListLabel}>
              Qual será o valor da sua recarga?
            </SystemText>
            <View>
              {this._renderValueList()}
            </View>
          </Fragment>
        }
      </View>
    )
  }
}

RechargeValueList.propTypes = propTypes;

// Style
const styles = StyleSheet.create({
  valueRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  rechargeListLabel: {
    fontSize: 12,
    marginBottom: 8,
    color: colors.GRAY
  },
  fillSpace: {
    flex: 1,
    marginRight: 12
  },
  mb0: {
    marginBottom: 0
  },
  mr0: {
    marginRight: 0
  }
})

export default RechargeValueList;