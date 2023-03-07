// NPM imports
import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  BackHandler
} from 'react-native';
import Moment from 'moment';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// VouD imports
import BrandText from '../../components/BrandText';
import { getStatusBarHeight } from '../../styles/util';
import Button from '../../components/Button';
import BrandContainer from '../../components/BrandContainer';
import LoadMask from '../../components/LoadMask';
import { getApiStatusUI } from '../../redux/selectors';
import { fetchAPIStatus } from '../../redux/api-status';
import MessageBox from '../../components/MessageBox';
import { fetchContent } from '../../redux/config';


// images
const serviceUnavailableImg = require('../../images/service-unavailable.png');

class ServiceUnavailableView extends Component {

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  _backHandler = () => {
    return true;
  };

  componentDidUpdate(prevProps) {
    const {dispatch, apiStatusData: { available } } = this.props;
    const prevAvailable = prevProps.apiStatusData.available;
    if (!prevAvailable && available) {
      dispatch(NavigationActions.back());
      dispatch(fetchContent());
    }
  }

  _checkAPIStatus = () => {
    this.props.dispatch(fetchAPIStatus());
  }

  render() {
    const { apiStatusData: { title, message, lastCheck }, apiStatusUi } = this.props;

    return (
      <BrandContainer bottomPos={-200}>
        <ScrollView
          contentContainerStyle={styles.container}
        >
          <Image
            source={serviceUnavailableImg}
            style={styles.serviceUnavailableImg}
          />
          <BrandText style={styles.messageTitle}>
            {title}
          </BrandText>
          <BrandText style={styles.messageBody}>
            {message}
          </BrandText>
          { apiStatusUi.error !== '' &&
            <MessageBox
              message={apiStatusUi.error}
              style={styles.errorMessage}
            />
          }
          <Button
            style={styles.checkAvailabilityButton}
            outline='white'
            onPress={this._checkAPIStatus}
          >
            Checar disponibilidade
          </Button>
          <BrandText style={styles.lastCheckText}>
            {`Última verificação: ${Moment(lastCheck).format('DD/MM/YYYY HH:mm')}`}
          </BrandText>
        </ScrollView>
        { apiStatusUi.isFetching && <LoadMask message="Verificando disponibilidade"/> }
      </BrandContainer>
    );
  }
}

const styles = {
  container: {
    paddingTop: getStatusBarHeight() + 40,
    paddingHorizontal: 32,
  },
  serviceUnavailableImgContainer: {
    alignItems: 'center'
  },
  serviceUnavailableImg: {
    height: 180,
    marginBottom: 32,
    alignSelf: 'center',
  },
  messageTitle: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    color: 'white',
    marginBottom: 16,
  },
  messageBody: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: 'white',
    marginBottom: 40
  },
  checkAvailabilityButton: {
    marginBottom: 8,
  },
  lastCheckText: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
    color: 'white',
    marginBottom: 32,
  },
  errorMessage: {
    marginBottom: 16
  },
};

const mapStateToProps = state => (
  {
    apiStatusData: state.apiStatus.data,
    apiStatusUi: getApiStatusUI(state),
  }
);

export const ServiceUnavailable = connect(mapStateToProps)(ServiceUnavailableView);
