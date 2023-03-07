// NPM imports
import React, { Component } from "react";
import PropTypes from "prop-types";

import BUPurchaseForm from "./BUPurchaseForm";
import BOMPurchaseForm from "./BOMPurchaseForm";
import LEGALPurchaseForm from "./LEGALPurchaseForm";
import { transportCardTypes } from "../../../redux/transport-card";

const propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number])
};

const defaultProps = {
  style: {}
};

class PurchaseForm extends Component {
  // _isBUFlow = () => this.props.cardData.layoutType === transportCardTypes.BU;

  renderForm = () => {
    const {
      cardData: { layoutType }
    } = this.props;

    switch (layoutType) {
      case transportCardTypes.BU:
        return BUPurchaseForm;
      case transportCardTypes.LEGAL:
        return LEGALPurchaseForm;

      default:
        return BOMPurchaseForm;
    }
  };

  render() {
    // const FormComponent = this._isBUFlow() ? BUPurchaseForm : BOMPurchaseForm;
    const FormComponent = this.renderForm();

    return <FormComponent {...this.props} />;
  }
}

PurchaseForm.propTypes = propTypes;
PurchaseForm.defaultProps = defaultProps;

export default PurchaseForm;
