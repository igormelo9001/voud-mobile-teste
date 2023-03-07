// NPM imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';

// VouD imports
import BrandText from '../../components/BrandText';
import Icon from '../../components/Icon';

// component
const propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

const defaultProps = {
  style: {},
};

class FBProfileBox extends Component {
  render() {
    const { style, name, lastName, email } = this.props;

    return (
      <View style={StyleSheet.flatten([style, styles.facebookProfileBox])}>
        <BrandText style={styles.facebookProfileText}>
          {`${name} ${lastName}`}
        </BrandText>
        <BrandText style={styles.facebookProfileText}>
          {email}
        </BrandText>
        <BrandText style={styles.facebookInfoText}>
          Você poderá editar estes dados após o cadastro
        </BrandText>
        <Icon
          name="facebook"
          style={styles.facebookIcon}
        />
      </View>
    )
  }
}

FBProfileBox.propTypes = propTypes;
FBProfileBox.defaultProps = defaultProps;

// styles
const styles = StyleSheet.create({
  facebookProfileBox: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 2,
  },
  facebookProfileText: {
    paddingRight: 32,
    fontSize: 14,
    lineHeight: 20,
    color: 'white',
  },
  facebookInfoText: {
    marginTop: 16,
    fontSize: 12,
    lineHeight: 16,
    color: 'white',
    opacity: 0.5,
  },
  facebookIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    fontSize: 24,
    color: 'white',
  },
});

export default FBProfileBox;
