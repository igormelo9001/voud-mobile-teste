import React, { PureComponent } from 'react';
import { View, BackHandler, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image, TextInput } from 'react-native';
import Icon from "../../../../components/Icon";
import { colors } from '../../../../styles';
import VoudText from '../../../../components/VoudText';
import RoundedTextInput from '../../../../components/RoundedTextInput';
import Loader from '../../../../components/Loader';
import styles from "./style";

import { connect } from 'react-redux';

const imageMessage = require("../../../../images/exclamationQrCode.png")

import {
  reduxForm,
  Field,
  reset,
} from 'redux-form';

class ScooServicesQrCodeManualView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      qrCodeNumberEditable: false,
      qrCodeNumber2Editable: false,
      qrCodeNumber3Editable: false,
      qrCodeNumber4Editable: false,
      qrCodeNumber5Editable: false,
      qrCodeNumber6Editable: false,
      qrCodeNumber7Editable: false,
      isError: false,
    };
  }

  componentDidMount() {

    this.qrCodeNumber.focus()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isError) {
      this.setState({
        isError: true,
        qrCodeNumber2Editable: false,
        qrCodeNumber3Editable: false,
        qrCodeNumber4Editable: false,
        qrCodeNumber5Editable: false,
        qrCodeNumber6Editable: false,
        qrCodeNumber7Editable: false,
      });
      this.props.dispatch(reset('scooter-qrcodeManual'));
      this._timeout = setTimeout(() => { this.dismiss() }, 5000);
    }
    else {
      this.setState({ isError: false });
    }
  }

  dismiss = () => {
    if (this._timeout) clearTimeout(this._timeout);
    this.props.handlerError();
  };

  _back = () => {
    this.props.dispatch(reset('scooter-qrcodeManual'));
    this.props.onClose();
  }

  _handleQrCodeManualSubmit = () => {
    const { handleSubmit, onSubmit } = this.props;
    handleSubmit(onSubmit)();
  }

  _renderTitleDescription = () => {
    const { isScooterServiceActive } = this.props;

    let title = "Digitar código";
    let titleTwo = "do patinete";

    let descriptionTitle = "Insira o código de desbloqueio do patinete";
    let descriptionSubtitle = "que contém 7 dígitos";

    if (isScooterServiceActive && !this.props.payload.isFetching) {
      title = "Digitar código";
      titleTwo = "do ponto de patinete";

      descriptionTitle = "Insira o código do ponto para bloquear ";
      descriptionSubtitle = " o patinete e encerrar a viagem";
    }

    return (
      <View>
        <View style={styles.containerTitle}>
          <VoudText style={styles.title}>{title}</VoudText>
          <VoudText style={styles.title}>{titleTwo}</VoudText>
        </View>
        <View style={styles.containerTitle}>
          <VoudText style={styles.description}>{descriptionTitle}</VoudText>
          <VoudText style={styles.description}>{descriptionSubtitle}</VoudText>
        </View>
      </View>
    )
  }

  renderMessageError = () => (
    <View style={styles.containerMessage}>
      <View style={styles.containerMessageIcon}>
        <Image source={imageMessage} />
      </View>
      <View style={styles.containerMessageText}>
        <VoudText style={styles.messageText}>Código inválido. Tente novamente!</VoudText>
      </View>
    </View>
  );

  onChangeQrCodeNumber = (value) => {
    if (value !== "") {
      this.qrCodeNumberFocusAndEditable();
    }
  }

  qrCodeNumberFocusAndEditable = () => {
    this.setState({ qrCodeNumber2Editable: true }, () => {
      this.qrCodeNumber2.focus();
    });
  }

  onChangeQrCodeNumber2 = (value) => {
    if (value !== "") {
      this.qrCodeNumber2FocusAndEditable();
    } else {
      this.setState({ qrCodeNumber1Editable: true }, () => {
        this.qrCodeNumber.focus();
      });
    }
  }

  qrCodeNumber2FocusAndEditable = () => {
    this.setState({ qrCodeNumber3Editable: true }, () => {
      this.qrCodeNumber3.focus();
    });
  }

  onChangeQrCodeNumber3 = (value) => {
    if (value !== "") {
      this.qrCodeNumber3FocusAndEditable();
    } else {
      this.setState({ qrCodeNumber2Editable: true }, () => {
        this.qrCodeNumber2.focus();
      });
    }

  }

  qrCodeNumber3FocusAndEditable = () => {
    this.setState({ qrCodeNumber4Editable: true }, () => {
      this.qrCodeNumber4.focus();
    });
  }

  onChangeQrCodeNumber4 = (value) => {
    if (value !== "") {
      this.qrCodeNumber4FocusAndEditable();
    } else {
      this.setState({ qrCodeNumber3Editable: true }, () => {
        this.qrCodeNumber3.focus();
      });
    }

  }

  qrCodeNumber4FocusAndEditable = () => {
    this.setState({ qrCodeNumber5Editable: true }, () => {
      this.qrCodeNumber5.focus();
    });
  }

  onChangeQrCodeNumber5 = (value) => {
    if (value !== "") {
      this.qrCodeNumber5FocusAndEditable();
    } else {
      this.setState({ qrCodeNumber4Editable: true, }, () => {
        this.qrCodeNumber4.focus();
      });
    }

  }

  qrCodeNumber5FocusAndEditable = () => {
    this.setState({ qrCodeNumber6Editable: true }, () => {
      this.qrCodeNumber6.focus();
    });
  }

  onChangeQrCodeNumber6 = (value) => {
    if (value !== "") {
      this.qrCodeNumber6FocusAndEditable();
    } else {
      this.setState({
        qrCodeNumber5Editable: true,
      }, () => {
        this.qrCodeNumber5.focus();
      });
    }
  }

  qrCodeNumber6FocusAndEditable = () => {
    this.setState({ qrCodeNumber7Editable: true }, () => {
      this.qrCodeNumber7.focus();
    });
  }

  // onChangeQrCodeNumber7 = (value) => {
  //   if (value === "") {
  //     this.setState({ qrCodeNumber6Editable: true, }, () => {
  //       this.qrCodeNumber6.focus();
  //     });
  //   }
  // }

  onChangeQrCodeNumber7 = () => {
    this._handleQrCodeManualSubmit();
  }

  render() {
    const {
      qrCodeNumber2Editable,
      qrCodeNumber3Editable,
      qrCodeNumber4Editable,
      qrCodeNumber5Editable,
      qrCodeNumber6Editable,
      qrCodeNumber7Editable,
      isError,
    } = this.state;

    return (

      <KeyboardAvoidingView
        style={styles.container}
        enabled
        behavior={Platform.OS === "ios" ? "padding" : null}>
        <ScrollView style={{ flex: 1, }}>
          {isError &&
            this.renderMessageError()
          }
          <View style={{ padding: 40 }}>
            <TouchableOpacity onPress={this._back} style={styles.wrapperHeader}>
              <View>
                <Icon
                  name="md-arrow-back"
                  style={{ fontSize: 30, color: colors.BRAND_PRIMARY }}
                />
              </View>
            </TouchableOpacity>
          </View>
          {this._renderTitleDescription()}
          <View style={{ flex: 1 }}>
            <View style={styles.containerField}>
              <Field
                name="qrCodeNumber"
                onChange={(values) => this.onChangeQrCodeNumber(values)}
                returnKeyType={"next"}
                blurOnSubmit={false}
                props={{
                  editable: true,
                  style: {
                    borderColor: colors.BRAND_PRIMARY,
                    borderLeftWidth: 2,
                    borderBottomWidth: 2,
                    borderTopWidth: 2,
                    borderRightWidth: 2,
                  },
                }}
                onSubmitEditing={(event) => {
                  if (event.nativeEvent.text !== "") this.qrCodeNumberFocusAndEditable();
                }}
                component={RoundedTextInput}
                getRef={r => this.qrCodeNumber = r}
              />
              <Field
                name="qrCodeNumber2"
                returnKeyType={"next"}
                onChange={(values) => this.onChangeQrCodeNumber2(values)}
                props={{
                  editable: qrCodeNumber2Editable,
                  style: {
                    borderColor: qrCodeNumber2Editable ? colors.BRAND_PRIMARY : "#979797",
                    borderBottomWidth: 2,
                    borderTopWidth: 2,
                    borderRightWidth: 2,
                  },

                }}
                onSubmitEditing={(event) => {
                  if (event.nativeEvent.text !== "") this.qrCodeNumber2FocusAndEditable();
                }}
                component={RoundedTextInput}
                getRef={r => this.qrCodeNumber2 = r}
              />
              <Field
                name="qrCodeNumber3"
                returnKeyType={"next"}
                onChange={(value) => this.onChangeQrCodeNumber3(value)}
                clearTextOnFocus={true}
                props={{
                  editable: qrCodeNumber3Editable,
                  style: {
                    borderColor: qrCodeNumber3Editable ? colors.BRAND_PRIMARY : "#979797",
                    borderBottomWidth: 2,
                    borderTopWidth: 2,
                    borderRightWidth: 2,
                  }
                }}
                onSubmitEditing={(event) => {
                  if (event.nativeEvent.text !== "") this.qrCodeNumber3FocusAndEditable();
                }}
                component={RoundedTextInput}
                getRef={r => this.qrCodeNumber3 = r}
                blurOnSubmit={false}
              />
              <Field
                name="qrCodeNumber4"
                onChange={(value) => this.onChangeQrCodeNumber4(value)}
                returnKeyType={"next"}
                clearTextOnFocus={true}
                props={{
                  editable: qrCodeNumber4Editable,
                  style: {
                    borderColor: qrCodeNumber4Editable ? colors.BRAND_PRIMARY : "#979797",
                    borderBottomWidth: 2,
                    borderTopWidth: 2,
                    borderRightWidth: 2,
                  }
                }}
                onSubmitEditing={(event) => {
                  if (event.nativeEvent.text !== "") this.qrCodeNumber4FocusAndEditable();
                }}
                component={RoundedTextInput}
                getRef={r => this.qrCodeNumber4 = r}
                blurOnSubmit={false}
              />
              <Field
                name="qrCodeNumber5"
                returnKeyType={"next"}
                onChange={(value) => this.onChangeQrCodeNumber5(value)}
                blurOnSubmit={false}
                clearTextOnFocus={true}
                props={{
                  underlineColorAndroid: 'transparent',
                  style: {
                    borderColor: qrCodeNumber5Editable ? colors.BRAND_PRIMARY : "#979797",
                    borderBottomWidth: 2,
                    borderTopWidth: 2,
                    borderRightWidth: 2,
                  }
                }}
                onSubmitEditing={(event) => {
                  if (event.nativeEvent.text !== "") this.qrCodeNumber5FocusAndEditable();
                }}
                component={RoundedTextInput}
                getRef={r => this.qrCodeNumber5 = r}
              />
              <Field
                name="qrCodeNumber6"
                returnKeyType={"next"}
                onChange={(value) => this.onChangeQrCodeNumber6(value)}
                blurOnSubmit={false}
                clearTextOnFocus={true}
                props={{
                  editable: qrCodeNumber6Editable,
                  style: {
                    borderColor: qrCodeNumber6Editable ? colors.BRAND_PRIMARY : "#979797",
                    borderBottomWidth: 2,
                    borderTopWidth: 2,
                    borderRightWidth: 2,
                  }
                }}
                onSubmitEditing={(event) => {
                  if (event.nativeEvent.text !== "") this.qrCodeNumber6FocusAndEditable();
                }}
                component={RoundedTextInput}
                getRef={r => this.qrCodeNumber6 = r}
              />
              <Field
                name="qrCodeNumber7"
                returnKeyType={"done"}
                // onChange={(value) => this.onChangeQrCodeNumber7(value)}
                blurOnSubmit={false}
                props={{
                  underlineColorAndroid: 'transparent',
                  editable: qrCodeNumber7Editable,
                  style: {
                    borderColor: qrCodeNumber7Editable ? colors.BRAND_PRIMARY : "#979797",
                    borderBottomWidth: 2,
                    borderTopWidth: 2,
                    borderRightWidth: 2,
                  }
                }}
                onSubmitEditing={this._handleQrCodeManualSubmit}
                component={RoundedTextInput}
                getRef={r => this.qrCodeNumber7 = r}
              />
            </View>
          </View>
        </ScrollView>
        {(this.props.payload.isFetching || this.props.financialRide.isFetching) &&
          <Loader style={styles.loader} text="Aguarde..." />
        }
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  startDate: state.scooter.startDate,
  payload: state.scooter,
  financialRide: state.financialRide,
  isScooterServiceActive: state.scooter.isActive,
});

export default connect(mapStateToProps)(reduxForm({ form: 'scooter-qrcodeManual', destroyOnUnmount: false })(ScooServicesQrCodeManualView));

