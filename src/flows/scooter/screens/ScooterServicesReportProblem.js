import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import {
  reduxForm,
  Field,
  reset
} from 'redux-form';

import Header, { headerActionTypes } from '../../../components/Header';
import VoudText from '../../../components/VoudText';
import Button from '../../../components/Button';
import CheckBoxField from '../../../components/CheckBoxField';
import { colors } from '../../../styles';

import { fetchReportProblem } from '../store/ducks/reportProblemRide';
import Loader from '../../../components/Loader';
import LinearGradient from 'react-native-linear-gradient';
import { showToast, toastStyles } from '../../../redux/toast';


const problems = [
  { name: 'Pneu Furado', text: 'Pneu furado' },
  { name: 'Bateria', text: 'Bateria' },
  { name: 'BloqueioDesbloqueio', text: 'Bloqueio / Desbloqueio' },
  { name: 'Freio', text: 'Freio' },
  { name: 'Barulho', text: 'Barulho' },
  { name: 'Motor', text: 'Motor' },
  { name: 'Velocidade', text: 'Velocidade' },
  { name: 'Farol', text: 'Farol' },
];

class ScooterServicesReportProblem extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: headerProps => {
        return (
          <Header
            title="Suporte"
            left={{
              type: headerActionTypes.CLOSE,
              onPress: () => {
                navigation.dispatch(reset('scooter-report'));
                navigation.dispatch(NavigationActions.back());
              }
            }}
          />
        );
      }
    };
  };

  _handleSubmit = values => {
    const { dispatch, payload: { idRide } } = this.props;

    var result = Object.entries(values).map(([k, v]) => ([String(k), v]));
    let arrayItem = [];

    result.map(item => {
      if (item[1]) arrayItem.push(item[0]);
    });

    if (arrayItem.length > 0) {
      dispatch(fetchReportProblem(idRide,arrayItem))
        .then(response => {
          if (response.payload === 200) {
            this.props.dispatch(reset('scooter-report'));
            this.props.dispatch(showToast("Dados enviado com sucesso.", toastStyles.SUCCESS));
          };
        })
        .catch(error => {
          this.props.dispatch(showToast(error.returnMessage, toastStyles.ERROR));
        });
    } else {
      this.props.dispatch(showToast("Selecione um tipo de problema, para reportar.", toastStyles.DEFAULT));
    }

  }

  _handleExit = () => {
    this.props.dispatch(reset('scooter-report'));
    this.props.dispatch(NavigationActions.back());
  }

  render() {
    return (
      <ScrollView style={{ backgroundColor: "#FFF", flex: 1 }}>
        {/* <View style={styles.container}> */}

        <View style={{ flex: 1, padding: 10, alignItems: "center" }}>
          <View style={{ padding: 20 }}>
            <VoudText style={[styles.description]}>Entre em contato  o suporte via whatsapp:</VoudText>
          </View>
          <View style={{ flexDirection: "row", flex: 1, }}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'http://api.whatsapp.com/send?phone=55' + 11976373479
                );
              }}
              style={styles.buttonScoo}>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 2, y: 0 }}
                colors={[colors.BRAND_PRIMARY_DARKER, colors.BRAND_PRIMARY_LIGHTER]}
                style={styles.buttonScoo}>
                <VoudText style={styles.textScoo}> Entrar em contato</VoudText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ padding: 20, }}>
          <VoudText style={styles.description}>Ou selecione a opção que melhor descreve o problema que você quer reportar:</VoudText>
          <View style={{ marginTop: 24, }}>
            {
              problems.map((p, i) => {
                return (
                  <View key={i} style={styles.reportItem}>
                    <Field
                      name={p.name}
                      props={{
                        text: p.text,
                      }}
                      component={CheckBoxField}
                    />
                  </View>
                );
              })
            }
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={this.props.handleSubmit(this._handleSubmit)}
              style={styles.buttonScoo}>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 2, y: 0 }}
                colors={[colors.BRAND_PRIMARY_DARKER, colors.BRAND_PRIMARY_LIGHTER]}
                style={styles.buttonScoo}>
                <VoudText style={styles.textScoo}> Reportar</VoudText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {this.props.report.isFetching &&
           <Loader style={styles.loader}  text="Aguarde..." />
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  description: {
    color: "#4d1e71",
    fontSize: 14,
    // margin: 31
  },
  reportItem: {
    marginHorizontal: 3,
    backgroundColor: '#fff',
    borderRadius: 7,
    height: 34,
    justifyContent: 'center',
    marginBottom: 8,
    paddingLeft: 14
  },
  buttonsContainer: {
    marginHorizontal: 20,
    marginTop: 70
  },
  reportButton: {
    backgroundColor: colors.BRAND_PRIMARY,
    marginBottom: 5
  },
  exitButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    elevation: 0
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    paddingHorizontal: 17,
    marginTop: 0,
    padding: 8,
  },
  buttonScoo: {
    borderRadius: 27,
    height: 40,
    elevation: 2,
    alignItems: "center",
    justifyContent: 'center',
    width: 292,
    height: 36,
  },
  textScoo: {
    color: "#FFF",
    fontSize: 12,
  },

});

const mapStateToProps = state => ({
  report: state.reportProblemRide,
  payload: state.scooter,
});

export default connect(mapStateToProps)(reduxForm({ form: 'scooter-report', destroyOnUnmount: false })(ScooterServicesReportProblem));
