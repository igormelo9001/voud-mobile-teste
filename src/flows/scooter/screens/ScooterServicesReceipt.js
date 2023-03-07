import React, {PureComponent} from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import moment from 'moment'

import Header, { headerActionTypes } from '../../../components/Header';
// import Button from '../../../components/Button';
// import VoudText from '../../../components/VoudText';
// import { colors } from '../../../styles';
// import { padStart } from '../../../utils/string-util';
import ScooReceipt from "../components/ScooReceipt";

class ScooterServicesReceiptView extends PureComponent {
    static navigationOptions = ({ navigation }) => {
        return {
            header: headerProps => {
                return (
                    <Header
                        title="Recibo da viagem"
                        left={{
                            type: headerActionTypes.CLOSE,
                            onPress: () => navigation.dispatch(NavigationActions.back())
                        }}
                        />
                );
              }
        };
      };

    // _getDuration(startDate, endDate) {
    //     const diff = endDate.diff(startDate, 'seconds')

    //     const minutes = parseInt(diff / 60);
    //     const seconds = diff - (minutes * 60);

    //     return `${padStart(minutes.toString(), '0', 2)}:${padStart(seconds.toString(), '0', 2)}`;
    // }

    // _getDurationString(totalMinutes) {
    //     if (totalMinutes == 0)
    //         return `${totalMinutes} seg`;
    //     else if (totalMinutes >= 1)
    //         return `${totalMinutes} min`;
    // }

    // _getMoneyValue(value) {
    //     return `R$ ${value.toFixed(2).toString().replace('.', ',')}`
    // }

    // _renderDateFormat = (date) => {
    //     return date.replace('-','/').replace('-','/');
    // }

    // leftPad = (value, totalWidth, paddingChar) => {
    //     const length = totalWidth - value.toString().length + 1;
    //     return Array(length).join(paddingChar || '0') + value;
    //   }

    render() {
        const { dispatch, navigation: { state: { params } } } = this.props;
        const data = {
          start: {
          address: params.start.address,
          date: params.start.date
        },
        end: {
          address: params.end.address,
          date: params.end.date,
        },
        scoo: params.scoo,
        tax: params.tax,
        valuePerMinute: params.valuePerMinute,
        timeSeconds: params.timeSeconds,
        minutesValue: params.minutesValue,
        totalValue: params.totalValue,
        quantity: params.quantity,
        minuteFree: params.minuteFree,
      }

        return (
            <View style={styles.view}>
            <ScrollView>
              <ScooReceipt data={data}  isFinishRunning={true} OnPress= {() => dispatch(NavigationActions.back())}/>
            </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
});

export const ScooterServicesReceipt = connect(null)(ScooterServicesReceiptView);
