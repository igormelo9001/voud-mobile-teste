import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import VoudText from '../../../../components/VoudText';
import { colors } from '../../../../styles';
import { padStart } from '../../../../utils/string-util';
import Button from '../../../../components/Button';

export default class ScooReceipt extends PureComponent {
  _getDuration(startDate, endDate) {
    const diff = endDate.diff(startDate, 'seconds');

    const minutes = parseInt(diff / 60);
    const seconds = diff - minutes * 60;

    return `${padStart(minutes.toString(), '0', 2)}:${padStart(seconds.toString(), '0', 2)}`;
  }

  _getDurationString(totalMinutes) {
    if (totalMinutes == 0) return `${totalMinutes} seg`;
    if (totalMinutes >= 1) return `${totalMinutes} min`;
  }

  _getMoneyValue(value) {
    return `R$ ${value
      .toFixed(2)
      .toString()
      .replace('.', ',')}`;
  }

  _renderDateFormat = date => {
    return date.replace('-', '/').replace('-', '/');
  };

  leftPad = (value, totalWidth, paddingChar) => {
    const length = totalWidth - value.toString().length + 1;
    return Array(length).join(paddingChar || '0') + value;
  };

  secondsToTime = secs => {
    const hours = Math.floor(secs / (60 * 60));

    const divisor_for_minutes = secs % (60 * 60);
    const minutes = Math.floor(divisor_for_minutes / 60);

    const divisor_for_seconds = divisor_for_minutes % 60;
    const seconds = Math.ceil(divisor_for_seconds);

    const obj = {
      hours,
      minutes,
      seconds,
    };
    return obj;
  };

  render() {
    const { data, isFinishRunning } = this.props;
    const duration = this.secondsToTime(data.timeSeconds);
    let minutesDuration = '';
    let minutesDurationDescription = '';

    const minute = parseInt(data.quantity) - parseInt(data.minuteFree);
    let minuteExtra = 0;
    let totalMinuteExtra = 0;

    if (minute > 0) {
      minuteExtra = minute;
      totalMinuteExtra = data.valuePerMinute * minute;
    }

    if (duration.hours > 0) {
      minutesDuration = `${this.leftPad(duration.hours, 2)}:${this.leftPad(
        duration.minutes,
        2
      )}:${this.leftPad(duration.seconds, 2)}`;
      minutesDurationDescription = `${this.leftPad(duration.hours, 2)} h ${this.leftPad(
        duration.minutes,
        2
      )} min ${this.leftPad(duration.seconds, 2)} seg`;
    } else if (duration.minutes > 0) {
      minutesDuration = `${this.leftPad(duration.minutes, 2)}:${this.leftPad(duration.seconds, 2)}`;
      minutesDurationDescription = `${this.leftPad(duration.minutes, 2)} min ${this.leftPad(
        duration.seconds,
        2
      )} seg`;
    } else if (duration.seconds > 0) {
      minutesDuration = `00:${this.leftPad(duration.seconds, 2)}`;
      minutesDurationDescription = `${this.leftPad(duration.seconds, 2)} seg`;
    } else {
      minutesDuration = `00:00`;
      minutesDurationDescription = ``;
    }

    const colorRecepeit = isFinishRunning ? colors.GRAY_LIGHTER : colors.WHITE;
    const containerScooInfo = isFinishRunning ? styles.infoContainer : styles.infoContainerFinishi;

    return (
      <View style={{ flex: 1, backgroundColor: colorRecepeit }}>
        <View style={[containerScooInfo, styles.locationInfoContainer]}>
          <View style={styles.locationContainer}>
            <View style={[styles.icon, styles.startIcon]} />
            <View>
              <View style={styles.addressContainer}>
                <VoudText style={[styles.text]}>
                  <VoudText style={styles.title}>Ponto de retirada: </VoudText>
                  {data.start.address}
                </VoudText>
                <VoudText style={[styles.text]}>{this._renderDateFormat(data.start.date)}</VoudText>
              </View>
            </View>
          </View>
          <View style={[styles.locationContainer, styles.locationContainerSpace]}>
            <View style={[styles.icon, styles.endIcon]} />
            <View>
              <View style={[styles.addressContainer]}>
                <VoudText style={[styles.text]}>
                  <VoudText style={styles.title}>Ponto de devolução: </VoudText>
                  {data.end.address}
                </VoudText>
                <VoudText style={styles.text}>{this._renderDateFormat(data.end.date)}</VoudText>
              </View>
            </View>
          </View>
        </View>
        <View style={[containerScooInfo, styles.scooInfoContainer]}>
          <View style={styles.scooContainer}>
            <VoudText style={styles.title}>SCOO</VoudText>
            <VoudText style={styles.text}>{data.scoo}</VoudText>
          </View>
          <View style={styles.scooSpacer} />
          <View style={styles.scooContainer}>
            <VoudText style={styles.title}>DURAÇÃO</VoudText>
            <VoudText style={styles.text}>{minutesDuration}</VoudText>
          </View>
        </View>
        <View style={[containerScooInfo, styles.detailsInfoContainer]}>
          <VoudText style={[styles.title, styles.detailsTitle]}>Detalhamento da cobrança</VoudText>
          <View style={styles.detailsRow}>
            <VoudText style={styles.text}>Duração da viagem:</VoudText>
            <VoudText style={styles.text}>{minutesDurationDescription}</VoudText>
          </View>
          <View style={styles.detailsRow}>
            <VoudText style={styles.text}>
              Minutos extra ({this._getMoneyValue(data.valuePerMinute)} x {minuteExtra} min):
            </VoudText>
            <VoudText style={styles.text}>{this._getMoneyValue(totalMinuteExtra)}</VoudText>
          </View>
          <View style={styles.detailsRow}>
            <VoudText style={styles.text}>Tarifa de desbloqueio:</VoudText>
            <VoudText style={styles.text}>{this._getMoneyValue(data.tax)}</VoudText>
          </View>
          <View style={styles.detailsRow}>
            <VoudText style={styles.title}>Total:</VoudText>
            <VoudText style={styles.title}>{this._getMoneyValue(data.totalValue)}</VoudText>
          </View>
        </View>
        {isFinishRunning && (
          <View style={[styles.infoContainer, styles.totalInfoContainer]}>
            <VoudText style={styles.totalText}>{this._getMoneyValue(data.totalValue)}</VoudText>
            <VoudText style={styles.thankYouText}>Obrigado por utilizar o VouD Patinete</VoudText>
          </View>
        )}
        {isFinishRunning && (
          <View>
            <Button style={[styles.exitButton, { marginBottom: 20 }]} onPress={this.props.OnPress}>
              Sair
            </Button>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  infoContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 5,
    marginTop: 15,
    borderRadius: 7,
  },
  infoContainerFinishi: {
    backgroundColor: '#fff',
    marginHorizontal: 5,
    marginTop: 15,
    borderRadius: 7,
    borderColor: '#979797',
    borderWidth: 1,
  },
  locationInfoContainer: {
    paddingTop: 16,
    paddingBottom: 13,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  locationContainerSpace: {
    marginTop: 0,
  },
  addressContainer: {
    flexDirection: 'row',
    // flex:1,
    flexWrap: 'wrap',
    padding: 10,
  },
  icon: {
    width: 12,
    height: 12,
    borderRadius: 12,
    marginRight: 10,
  },
  startIcon: {
    backgroundColor: '#7ed321',
  },
  endIcon: {
    backgroundColor: '#d0021b',
  },
  title: {
    fontWeight: 'bold',
    color: colors.GRAY_DARK,
  },
  text: {
    color: colors.GRAY_DARK,
  },
  scooInfoContainer: {
    flexDirection: 'row',
  },
  scooContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 25,
  },
  scooSpacer: {
    width: 1,
    backgroundColor: '#979797',
    marginVertical: 7,
  },
  detailsInfoContainer: {
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 10,
    marginBottom: 20,
  },
  detailsTitle: {
    marginBottom: 15,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  totalText: {
    fontSize: 32,
    fontWeight: '500',
    color: colors.GRAY_DARK,
  },
  thankYouText: {
    fontSize: 12,
    color: colors.GRAY_DARK,
  },
  exitButton: {
    // backgroundColor: colors.BRAND_PRIMARY,
    marginHorizontal: 20,
    marginTop: 25,
  },
});
