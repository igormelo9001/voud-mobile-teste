// npm imports
import React, { Component, Fragment } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';

// VouD Imports
import SystemText from './SystemText';
import BrandText from './BrandText';
import Loader from './Loader';
import { colors } from '../styles';
import TouchableText from './TouchableText';

// Images
const emptyImg = require('../images/empty.png');

// Component
const propTypes = {
  isFetching: PropTypes.bool.isRequired,
  loadingMessage: PropTypes.string,

  error: PropTypes.string,
  errorMessage: PropTypes.string,
  onRetry: PropTypes.func.isRequired,

  isEmpty: PropTypes.bool.isRequired,
  emptyMessage: PropTypes.string,

  style: PropTypes.number
}

const defaultProps ={
  loadingMessage: "Carregando...",
  errorMessage: "Ocorreu um erro, tente novamente.",
  emptyMessage: "Nenhum dado encontrado",
}

export default class RequestFeedbackSmall extends Component {
  render () {
    const {
      isFetching,
      loadingMessage,

      error,
      errorMessage,
      onRetry,

      isEmpty,
      emptyMessage,

      style,
    } = this.props;
    
    return (
      <View style={style}>
        {/* ============= */}
        {/* LOADING STATE */}
        {/* ============= */}
        {
          isFetching &&
          <Fragment>
            <Loader iconSize={16} />
            <SystemText style={styles.messageText}>
              {loadingMessage}
            </SystemText>
          </Fragment>
        }


        {/* =========== */}
        {/* ERROR STATE */}
        {/* =========== */}
        {
          !isFetching && error !== '' &&
          <TouchableText textStyle={styles.errorText} onPress={onRetry}>
            {`${errorMessage}: ${error}. `}
            <BrandText style={styles.errorTryAgain}>
              Toque para tentar novamente
            </BrandText>
          </TouchableText>
        }

        {/* =========== */}
        {/* EMPTY STATE */}
        {/* =========== */}
        {
          isEmpty && !isFetching && error === '' &&
          <Fragment>
            <Image
              source={emptyImg}
              style={styles.emptyImage}
            />
            <SystemText style={styles.messageText}>
              {emptyMessage}
            </SystemText>
          </Fragment>
        }
      </View>
    )
  }
}

RequestFeedbackSmall.propTypes = propTypes;
RequestFeedbackSmall.defaultProps = defaultProps;

const styles = StyleSheet.create({
  messageText: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.GRAY,
    marginTop: -12,
  },
  errorText: {
    color: colors.BRAND_ERROR,
    textAlign: 'center'
  },
  errorTryAgain: {
    textDecorationLine: 'underline',
  },
  emptyImage: {
    alignSelf: 'center',
    marginVertical: 16,
    width: 25,
    height: 25,
  },
});