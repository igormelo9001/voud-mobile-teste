// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';
import Moment from 'moment';

// VouD imports
import SelectionButton from '../../../components/SelectionButton';
import { colors } from '../../../styles';
import SystemText from '../../../components/SystemText';

// Component
const propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};

const defaultProps = {
  style: {},
};

const scheduledDayOptions = [1, 10, 15, 20];

class ScheduledDayField extends Component {

  constructor(props) {
    super(props);
    this.state = {
      options: [{value: Number(Moment().format('DD')), label: 'Hoje' }, ...scheduledDayOptions.map(el => ({value: el, label: el }))],
      isKeepPreviousDateSelected: false
    };
  }

  componentDidMount() {
    const { editSmartPurchase } = this.props;
    const showKeepPreviousDate = editSmartPurchase && !this.state.options.some(el => el.value === Number(editSmartPurchase.scheduledDay))
    this.setState({
      isKeepPreviousDateSelected: showKeepPreviousDate,
      showKeepPreviousDate
    });
  }

  _checkLastSmartPurchaseFire = dayNumber => {
    const { lastRecurrentPaymentFire } = this.props;
    if (!lastRecurrentPaymentFire) return false;

    const todayDate = Moment();
    const isToday = Number(todayDate.format('DD')) === Number(dayNumber);
    return isToday && todayDate.isAfter(Moment(lastRecurrentPaymentFire, 'YYYY-MM-DD HH:mm:ss'));
  }

  render() {
    const { style, input, onShowLastSmartPurchaseFireAlert, editSmartPurchase } = this.props;
    const { showKeepPreviousDate, isKeepPreviousDateSelected } = this.state;

    return (
      <View style={StyleSheet.flatten([styles.container, style])}>
        <SystemText style={styles.questionText}>Programar compra mensal para qual dia?</SystemText>
        <View style={styles.scheduledDayBtnContainer}>
        {
          this.state.options.map((el, index) => {
            const isDisabled = index !== 0 && Number(Moment().format('DD')) === el.value;
            return (
              <SelectionButton
                key={el.label}
                style={StyleSheet.flatten([styles.selectionButton,
                  index === this.state.options.length - 1 ? styles.mr0 : {}])}
                selected={!isKeepPreviousDateSelected && !isDisabled && input.value === el.value}
                pristine={!input.value}
                selectionValue={el.value}
                useSysFont
                disabled={isDisabled}
                onPress={value => {
                  this.setState({ isKeepPreviousDateSelected: false });

                  if (onShowLastSmartPurchaseFireAlert) {
                    const showAlert = this._checkLastSmartPurchaseFire(value);
                    onShowLastSmartPurchaseFireAlert(showAlert);
                  }
                  input.onChange(value); 
                }}
              >
                {el.label}
              </SelectionButton>
            );
          })
        }
        </View>
        {
          showKeepPreviousDate &&
          (
            <SelectionButton
              style={styles.keepPreviousDateButton}
              selected={isKeepPreviousDateSelected}
              useSysFont
              onPress={() => {
                this.setState({ isKeepPreviousDateSelected: true });
                input.onChange(editSmartPurchase.scheduledDay);
              }}
            >
              {`Manter todo dia ${editSmartPurchase.scheduledDay} de cada mês`}
            </SelectionButton>
          )
        }
      </View>
    );
  }
}

ScheduledDayField.propTypes = propTypes;
ScheduledDayField.defaultProps = defaultProps;

// Styles
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16
  },
  selectionButton: {
    flex: 1,
    minHeight: 48,
    marginRight: 8
  },
  mr0: {
    marginRight: 0
  },
  questionText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.GRAY,
    marginBottom: 8,
  },
  scheduledDayBtnContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  keepPreviousDateButton: {
    marginTop: 8
  }
});

// Redux
const mapStateToProps = state => {
  return {
    lastRecurrentPaymentFire: state.apiStatus.data.lastRecurrentPaymentFire
  };
};

export default connect(mapStateToProps)(ScheduledDayField);
