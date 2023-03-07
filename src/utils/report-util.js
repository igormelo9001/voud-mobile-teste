import { Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { reportTypes } from '../redux/report';

export const showReportExitAlert = dispatch => {
  Alert.alert(
    'Cancelar denúncia',
    'Tem certeza que gostaria de cancelar a sua denúncia? Lembre-se que juntos podemos zelar por um transporte público de qualidade para todos.',
    [
      {
        text: 'Cancelar',
        onPress: () => {}
      },
      {
        text: 'Sim',
        onPress: () => { 
          dispatch(NavigationActions.back());
        }
      }
    ]
  );
}

export const showFinishReportExitAlert = dispatch => {
  Alert.alert(
    'Tem certeza que deseja sair de denúncias?',
    'Este questionário tem fim estatístico e pode ajudar muitas pessoas que estão na mesma condição, além de ser completamente anônimo.',
    [
      {
        text: 'Cancelar',
        onPress: () => {}
      },
      {
        text: 'Sim',
        onPress: () => { 
          dispatch(NavigationActions.back());
        }
      }
    ]
  );
}

export const emergencyPhones = {
  MILITARY_POLICE_STATION: 190,
  WOMEN_POLICE_STATION: 180,
  SPTRANS: 156,
};

export const isEmergencyReport = reportType => reportType === reportTypes.SEXUAL_HARASSMENT || reportType === reportTypes.THEFT ||
  reportType === reportTypes.AGGRESSION || reportType === reportTypes.VANDALISM || reportType === reportTypes.TRAFFICKING;