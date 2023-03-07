// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  StyleSheet,
} from 'react-native';

// VouD imports
import BrandText from './BrandText';
import { colors } from '../styles';
import { viewTerms, viewPrivacyPolicy } from '../flows/usage-terms/utils';

// component
const propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const defaultProps = {};

class UsageTerms extends Component {
  render() {
    const { dispatch } = this.props;
    return (
      <BrandText style={styles.termsText}>
        <BrandText>
          {'Ao realizar o cadastro, você afirma estar de acordo com os '}
        </BrandText>
        <BrandText
          style={styles.hyperlink}
          onPress={() => viewTerms(dispatch)}
        >
          {'termos de uso'}
        </BrandText>
        <BrandText>
          {' e a '}
        </BrandText>
        <BrandText
          style={styles.hyperlink}
          onPress={() => viewPrivacyPolicy(dispatch)}
        >
          {'política de privacidade'}
        </BrandText>
        <BrandText>
          {' do aplicativo.'}
        </BrandText>
      </BrandText>
    );
  }
}

UsageTerms.propTypes = propTypes;
UsageTerms.defaultProps = defaultProps;

// Styles
const styles = StyleSheet.create({
  termsText: {
    color: 'white',
    textAlign: 'left',
  },
  hyperlink: {
    color: colors.BRAND_SECONDARY,
    textDecorationLine: 'underline'
  },
});

export default  connect()(UsageTerms);
