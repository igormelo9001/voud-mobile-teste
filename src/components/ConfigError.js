// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View
} from 'react-native';

// VouD imports
import BrandText from './BrandText';
import { colors } from '../styles';
import { getConfigContentUI, getHasConfigError, getIsLoadingConfig } from '../redux/selectors';
import { fetchContent, hasConfigError } from '../redux/config';
import { getCheckLastTermsAcceptedUi } from '../flows/usage-terms/reducer';
import { dispatchCheckLastTermsAccepted } from '../flows/usage-terms/utils';

// constants
const CONFIG_RETRY_TIMEOUT = 10; // in seconds

// Component
class ConfigError extends Component {

  constructor(props) {
    super(props);

    this.state = {
      retryCounter: CONFIG_RETRY_TIMEOUT
    }
    this._retryTimer = null;
  }

  componentWillReceiveProps(nextProps) {
    const nextConfigUi = nextProps.configUi;
    const nextCheckLastTermsAcceptedUi = nextProps.checkLastTermsAcceptedUi;   

    if (!this._retryTimer && !nextConfigUi.isFetching && !nextCheckLastTermsAcceptedUi.isFetching && 
      hasConfigError(nextConfigUi, nextCheckLastTermsAcceptedUi)) {
      
      this._createRetryTimer(nextConfigUi, nextCheckLastTermsAcceptedUi);
    }
  }

  componentWillUnmount() {
    this._cleanRetryTimer();
  }

  _cleanRetryTimer = () => {
    clearInterval(this._retryTimer);
    this._retryTimer = null;
  }

  _setRetryCounter = (counter) => {
    this.setState({
      retryCounter: counter
    });
  }

  _createRetryTimer = (configUi, checkLastTermsAcceptedUi) => {
    const { dispatch } = this.props;

    this._retryTimer = setInterval(() => {
      const nextRetryCounter = --this.state.retryCounter;
      this._setRetryCounter(nextRetryCounter > 0 ? nextRetryCounter : 0);

      if (this.state.retryCounter === 0) {
        this._cleanRetryTimer();
        this._setRetryCounter(CONFIG_RETRY_TIMEOUT);
        
        if (configUi.error !== '') dispatch(fetchContent());
        if (checkLastTermsAcceptedUi.error !== '') dispatchCheckLastTermsAccepted(dispatch);
      }
    }, 1000);
  }

  render() {
    const { isLoadingConfig, hasConfigError } = this.props;
    const { retryCounter } = this.state;

    if (hasConfigError)
      return (
        <View style={styles.container}>
          <BrandText style={styles.text}>
            {`Falha de comunicação com nossos servidores. ${'\n'} ${isLoadingConfig ?
              `Reconectando...` : `Tentativa de reconexão em ${retryCounter} segundos.`}`}
          </BrandText>
        </View>
      );
    return null;
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: colors.GRAY_DARKER
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: 'white'
  }
});

// Redux
const mapStateToProps = (state) => {
  return {
    configUi: getConfigContentUI(state),
    checkLastTermsAcceptedUi: getCheckLastTermsAcceptedUi(state),
    isLoadingConfig: getIsLoadingConfig(state),
    hasConfigError: getHasConfigError(state)
  }
};

export default connect(mapStateToProps)(ConfigError);