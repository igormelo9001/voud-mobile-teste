// NPM imports
import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import PropTypes from 'prop-types';

// VouD imports
import BrandText from './BrandText';
import Spinner from './Spinner';
import { colors } from '../styles';

const propTypes = {
  styles: PropTypes.object,
  text: PropTypes.string.isRequired,
};

const defaultProps = {
  style: {},
  text: ''
};

// Component
class Loader extends Component {

  constructor(props) {
    super(props);
  }

  _getTextStyles() {
    let textStyles = [styles.text];
    if (this.props.isLight) textStyles.push(styles.textLight);
    return textStyles;
  }

  render() {
    return (
      <View style={StyleSheet.flatten([styles.container, this.props.style])}>
        <Spinner
          style={styles.spinner}
          isLight={this.props.isLight}
          iconSize={this.props.iconSize}
        />
        <BrandText style={this._getTextStyles()}>
          {this.props.text}
        </BrandText>
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  spinner: {
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    color: colors.GRAY,
    textAlign: 'center'
  },
  textLight: {
    color: 'white'
  }
});

Loader.propTypes = propTypes;
Loader.defaultProps = defaultProps;

export default Loader;
