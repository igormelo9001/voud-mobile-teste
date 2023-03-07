import React, { Component } from 'react';
import { connect } from 'react-redux';
import { change, formValueSelector } from 'redux-form';
import { View } from 'react-native';
import { fetchPromocodeClear } from '../../../../redux/promo-code';

// import { Container } from './styles';
import AddCreditButton from '../AddCreditButton';
import styles from './style';

class PurchaseTicketCreditValue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unityOne: false,
      unityTwo: false,
      unityFour: false,
      unityEight: false,
    };
  }

  renderColor = isSelected => {
    return isSelected ? '#A84D97' : '#C0C0C0';
  };

  addUnity = unity => {
    const { dispatch, reduxFormName } = this.props;
    dispatch(fetchPromocodeClear());
    const value = Number(4.3) * unity;
    dispatch(change(reduxFormName, 'creditValue', value.toFixed(2)));
  };

  render() {
    const { unityOne, unityTwo, unityFour, unityEight } = this.state;

    return (
      <View style={{ flexDirection: 'row' }}>
        <AddCreditButton
          style={[styles.addCreditBtn, { borderColor: this.renderColor(unityOne) }]}
          styleText={{ color: this.renderColor(unityOne) }}
          onPress={() => {
            this.setState({
              unityOne: true,
              unityTwo: false,
              unityFour: false,
              unityEight: false,
            });
            this.addUnity(1);
          }}
        >
          1 uni.
        </AddCreditButton>
        <AddCreditButton
          style={[styles.addCreditBtn, { borderColor: this.renderColor(unityTwo) }]}
          styleText={{ color: this.renderColor(unityTwo) }}
          onPress={() => {
            this.setState({
              unityOne: false,
              unityTwo: true,
              unityFour: false,
              unityEight: false,
            });
            this.addUnity(2);
          }}
        >
          2 uni.
        </AddCreditButton>
        <AddCreditButton
          style={[styles.addCreditBtn, { borderColor: this.renderColor(unityFour) }]}
          styleText={{ color: this.renderColor(unityFour) }}
          onPress={() => {
            this.setState({
              unityOne: false,
              unityTwo: false,
              unityFour: true,
              unityEight: false,
            });
            this.addUnity(4);
          }}
        >
          4 uni.
        </AddCreditButton>
        <AddCreditButton
          style={[styles.addCreditBtn, { borderColor: this.renderColor(unityEight) }]}
          styleText={{ color: this.renderColor(unityEight) }}
          onPress={() => {
            this.setState({
              unityOne: false,
              unityTwo: false,
              unityFour: false,
              unityEight: true,
            });
            this.addUnity(8);
          }}
        >
          8 uni.
        </AddCreditButton>
      </View>
    );
  }
}

// Redux
const mapStateToProps = (state, ownProps) => {
  return {
    creditValue: 0,
  };
};

export default connect(mapStateToProps)(PurchaseTicketCreditValue);
