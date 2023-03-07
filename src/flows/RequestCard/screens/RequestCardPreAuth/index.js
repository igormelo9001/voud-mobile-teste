import React, { PureComponent } from "react";
import { View, Keyboard, BackHandler } from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import { connect } from "react-redux";
import Header, { headerActionTypes } from "../../../../components/Header";
import { reduxForm, Field } from "redux-form";
import { formatCpf, parseCpf } from "../../../../utils/parsers-formaters";
import { cpfValidator, required } from "../../../../utils/validators";
import { clearReduxForm } from "../../../../utils/redux-form-util";
import { navigateToRoute } from "../../../../redux/nav";
import { routeNames } from "../../../../shared/route-names";
import { fetchPreAuth, preAuthClear } from "../../../../redux/login";

import { getPreAuthUI } from "../../../../redux/selectors";
import MessageBox from "../../../../components/MessageBox";
import LoadMask from "../../../../components/LoadMask";
import Button from "../../../../components/Button";
import BrandText from "../../../../components/BrandText";
import FadeInView from "../../../../components/FadeInView";
import TextField from "../../../../components/TextField";

import styles from "./style";
const reduxFormName = "requestCard";

class RequestCardPreAuthView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(preAuthClear());
    clearReduxForm(dispatch, reduxFormName);
  }

  _preAuth = ({ cpfResquestCard }) => {
    const { dispatch } = this.props;

    this._back();
    dispatch(fetchPreAuth(cpfResquestCard, true)).then(() => {
      dispatch(navigateToRoute(routeNames.AUTH));
    });
  };

  _submit = () => {
    const { handleSubmit, preAuthUI, valid } = this.props;

    Keyboard.dismiss();

    if (valid && !preAuthUI.isFetching) handleSubmit(this._preAuth)();
  };

  _back = () => {
    this.props.dispatch(NavigationActions.back());
  };

  render() {
    const { valid, preAuthUI } = this.props;

    return (
      <View style={styles.container}>
        <Header
          title="Solicitar cartão"
          left={{
            type: headerActionTypes.CLOSE,
            onPress: this._back
          }}
        />
        <View style={styles.containerDescription}>
          <BrandText style={styles.textDescription}>
            Informe o CPF do titular do cartão:{" "}
          </BrandText>
        </View>
        <View style={{ marginTop: 8, marginLeft: 16, marginRight: 16 }}>
          <FadeInView>
            <Field
              name="cpfResquestCard"
              props={{
                textFieldRef: el => (this.CPFFieldRequestCard = el),
                isPrimary: true,
                isRequestCard: true,
                label: "CPF*",
                keyboardType: "numeric",
                onSubmitEditing: () => {
                  Keyboard.dismiss();
                }
              }}
              format={formatCpf}
              parse={parseCpf}
              maxLength={14}
              component={TextField}
              validate={[required, cpfValidator]}
            />
            {preAuthUI.error ? (
              <MessageBox
                message={preAuthUI.error}
                style={styles.errorMessage}
              />
            ) : null}
          </FadeInView>
        </View>
        <View style={{ marginTop: 23 }}>
          <View
            style={{
              marginLeft: 16,
              marginRight: 16,
              elevation: !valid ? 0 : 1
            }}
          >
            <Button
              buttonStyle={{ height: 36 }}
              onPress={this._submit}
              disabled={!valid}
            >
              Prosseguir
            </Button>
          </View>
        </View>
        {preAuthUI.isFetching && <LoadMask />}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    initialValues: {
      cpf: state.profile.data.cpf
    },
    preAuthUI: getPreAuthUI(state)
  };
};

export const RequestCardPreAuth = connect(mapStateToProps)(
  reduxForm({ form: reduxFormName, destroyOnUnmount: false })(
    RequestCardPreAuthView
  )
);
