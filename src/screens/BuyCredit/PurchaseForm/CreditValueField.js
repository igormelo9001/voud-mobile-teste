// NPM imports
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";
import { change, formValueSelector, Field } from "redux-form";
import debounce from "lodash.debounce";

// VouD imports
import {
  getDefaultCreditValueFieldLabel,
  buCreditTypeLabels
} from "../../../utils/transport-card";
import { transportCardTypes } from "../../../redux/transport-card";
import TextField from "../../../components/TextField";
import AddCreditButton from "./AddCreditButton";
import getIconName from "../../../utils/get-icon-name";
import {
  formatCurrencyFromCents,
  parseCurrency
} from "../../../utils/parsers-formaters";
import SystemText from "../../../components/SystemText";
import TouchableNative from "../../../components/TouchableNative";
import {
  createRangeCreditValueValidator,
  required
} from "../../../utils/validators";
import {
  getCreditValueRange,
  getBUSupportedCreditTypesSelector
} from "../../../redux/selectors";
import Icon from "../../../components/Icon";
import { fetchPromocodeClear } from "../../../redux/promo-code";

// Component
const propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number])
};

const defaultProps = {
  style: {}
};

class CreditValueField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      valueOne: false,
      valueFive: false,
      valueTen: false,
      valueFifty: false
    };
  }

  componentWillMount() {
    const { creditValueRange } = this.props;

    this._rangeCreditValueValidator = createRangeCreditValueValidator(
      creditValueRange.minCreditValue,
      creditValueRange.maxCreditValue
    );
  }

  componentWillReceiveProps(nextProps) {
    const { buCreditType } = this.props;

    if (buCreditType !== nextProps.buCreditType) {
      const { creditValueRange } = nextProps;
      this._rangeCreditValueValidator = createRangeCreditValueValidator(
        creditValueRange.minCreditValue,
        creditValueRange.maxCreditValue
      );
    }
  }

  _addCredit = value => {
    const { dispatch, creditValue, reduxFormName } = this.props;

    dispatch(fetchPromocodeClear());

    const incrementedValue = Number(creditValue) + value;
    dispatch(change(reduxFormName, "creditValue", incrementedValue));
  };

  _setCredit = value => {
    const { dispatch, reduxFormName } = this.props;
    dispatch(change(reduxFormName, "creditValue", value));
  };

  _resetCreditValue = () => {
    const { dispatch } = this.props;

    this.setState({
      valueOne: false,
      valueFive: false,
      valueTen: false,
      valueFifty: false
    });
    dispatch(fetchPromocodeClear());
    this._setCredit(0);
  };

  _renderColor = isSelected => {
    return isSelected ? "#A84D97" : "#C0C0C0";
  };

  render() {
    const {
      name,
      cardData,
      creditValue,
      creditValueRange,
      buCreditType
    } = this.props;
    const creditValueFieldLabel = getDefaultCreditValueFieldLabel(
      cardData.layoutType,
      buCreditType
    );

    return (
      <Fragment>
        <Field
          name={name}
          props={{
            textFieldRef: el => (this.CreditValueField = el),
            isPrimary: false,
            label: creditValueFieldLabel,
            keyboardType: "numeric",
            fixedValue: "R$ ",
            largeField: true,
            textColor: "black",
            helperText: `Valor mínimo R$ ${formatCurrencyFromCents(
              creditValueRange.minCreditValue
            )}`,
            style: styles.valueField,
            customShowError: meta => {
              const { error, touched } = meta;
              return (touched || parseInt(creditValue) !== 0) && error;
            },
            right: () => {
              return (
                !!creditValue &&
                creditValue !== "0" && (
                  <TouchableNative onPress={this._resetCreditValue}>
                    <Icon
                      style={styles.cleanCreditValueIcon}
                      name={getIconName("close")}
                      size={24}
                      color="black"
                    />
                  </TouchableNative>
                )
              );
            }
          }}
          format={formatCurrencyFromCents}
          parse={parseCurrency}
          component={TextField}
          validate={[required, this._rangeCreditValueValidator]}
        />
        {(cardData.layoutType === transportCardTypes.BOM_ESCOLAR ||
          buCreditType === buCreditTypeLabels.ESCOLAR) && (
          <View style={styles.addCreditBtnContainer}>
            <AddCreditButton
              style={styles.setCreditBtn}
              onPress={() => {
                this._setCredit(creditValueRange.maxCreditValue);
              }}
            >
              {`R$ ${formatCurrencyFromCents(
                creditValueRange.maxCreditValue
              )} `}
              <SystemText style={styles.setCreditInfo}>
                (Total disponível para compra)
              </SystemText>
            </AddCreditButton>
          </View>
        )}
        <View style={styles.addCreditBtnContainer}>
          <AddCreditButton
            style={[
              styles.addCreditBtn,
              { borderColor: this._renderColor(this.state.valueOne) }
            ]}
            styleText={{ color: this._renderColor(this.state.valueOne) }}
            onPress={() => {
              this.setState({
                valueOne: true,
                valueFive: false,
                valueTen: false,
                valueFifty: false
              });
              this._addCredit(100);
            }}
          >
            + R$1
          </AddCreditButton>
          <AddCreditButton
            style={[
              styles.addCreditBtn,
              { borderColor: this._renderColor(this.state.valueFive) }
            ]}
            styleText={{ color: this._renderColor(this.state.valueFive) }}
            onPress={() => {
              this.setState({
                valueOne: false,
                valueFive: true,
                valueTen: false,
                valueFifty: false
              });
              this._addCredit(500);
            }}
          >
            + R$5
          </AddCreditButton>
          <AddCreditButton
            style={[
              styles.addCreditBtn,
              { borderColor: this._renderColor(this.state.valueTen) }
            ]}
            styleText={{ color: this._renderColor(this.state.valueTen) }}
            onPress={() => {
              this.setState({
                valueOne: false,
                valueFive: false,
                valueTen: true,
                valueFifty: false
              });

              this._addCredit(1000);
            }}
          >
            + R$10
          </AddCreditButton>
          <AddCreditButton
            style={StyleSheet.flatten([
              styles.addCreditBtn,
              styles.lastAddCreditBtn,
              { borderColor: this._renderColor(this.state.valueFifty) }
            ])}
            styleText={{ color: this._renderColor(this.state.valueFifty) }}
            onPress={() => {
              this.setState({
                valueOne: false,
                valueFive: false,
                valueTen: false,
                valueFifty: true
              });

              this._addCredit(5000);
            }}
          >
            + R$50
          </AddCreditButton>
        </View>
      </Fragment>
    );
  }
}

CreditValueField.propTypes = propTypes;
CreditValueField.defaultProps = defaultProps;

// Styles
const styles = StyleSheet.create({
  cleanCreditValueIcon: {
    alignSelf: "center",
    marginTop: 16,
    marginRight: 8
  },
  addCreditBtnContainer: {
    flexDirection: "row"
  },
  addCreditBtn: {
    flex: 1,
    marginRight: 8
  },
  lastAddCreditBtn: {
    marginRight: 0
  },
  setCreditBtn: {
    flex: 1,
    marginBottom: 8
  },
  valueField: {
    marginTop: -15,
    marginBottom: 24
  }
});

// Redux
const mapStateToProps = (state, ownProps) => {
  return {
    creditValue: formValueSelector(ownProps.reduxFormName)(
      state,
      "creditValue"
    ),
    creditValueRange: getCreditValueRange(state, ownProps.buCreditType),
    buSupportedCreditTypes: getBUSupportedCreditTypesSelector(state)
  };
};

export default connect(mapStateToProps)(CreditValueField);
