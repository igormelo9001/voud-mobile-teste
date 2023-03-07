import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Vibration,
  Platform,
  Keyboard,
  Image,
  Modal,
  StatusBar,
  BackHandler
} from "react-native";

import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import { GATrackEvent, GAEventParams } from "../../../shared/analytics";

import { RNCamera } from "react-native-camera";
import { reduxForm, Field, reset } from "redux-form";

import Loader from "../../../components/Loader";
import { colors } from "../../../styles";

import IconButton from "../../../components/IconButton";
import VoudText from "../../../components/VoudText";
import ButtonIcon from "../../home/components/ButtonIcon";

import { fetchStartRide } from "../store/ducks/startRide";
import { fetchEndRide } from "../store/ducks/endRide";
import {
  fetchRidePaymentTransaction,
  resultCodeTransaction,
  fetchPaymentCancelRefundTransaction
} from "../store/ducks/financialRide";
import { navigateFromHome } from "../../../redux/nav";
import { routeNames } from "../../../shared/route-names";
import { showToast, toastStyles } from "../../../redux/toast";
import { getSelectedPaymentMethod } from "../../../redux/selectors";
import { saveItem, getJson, removeItem } from "../../../utils/async-storage";
import { navigateToRoute } from "../../../redux/nav";
import { asyncStorageKeys } from "../../../redux/init";

import ScooServicesQrCodeManualView from "../components/QrcodeManual";

const deviceWidth = Dimensions.get("screen").width;
const deviceHeight = Dimensions.get("screen").height;
const deviceDensity = Dimensions.get("screen").scale;

const {
  categories: { BUTTON },
  actions: { CLICK },
  labels: { SCOO_END_RIDE, SCOO_START_RIDE, SCOO_PRE_PAYMENT }
} = GAEventParams;

const rideValue = 4.3;

export class ScooterServicesQrCodeView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isCameraReady: false,
      flashlight: RNCamera.Constants.FlashMode.off,
      qrCodeManual: false,
      captureArea: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        measured: false
      },
      modalVisible: false,
      isError: false
    };
    this._isReading = false;
    this._barCodeRead = [];
    this._qrCode = "";
    this.paymentMethod = null;
  }

  componentDidMount() {
    this._keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._handleKeyboardDidHide
    );
  }

  componentWillUnmount() {
    this.setState({ flashlight: RNCamera.Constants.FlashMode.off });
    this.props.dispatch(reset("scooter-qrcode"));
    this._keyboardDidHideListener.remove();
  }

  get _flashlightIcon() {
    return this.state.flashlight === RNCamera.Constants.FlashMode.off
      ? "flashlight-off"
      : "flashlight-on";
  }

  _handleCameraReady = () => {
    const { qrCodeManual } = this.state;

    if (!qrCodeManual) {
      this.setState({ isCameraReady: true, qrCodeManual: false }, () => {
        setTimeout(() => {
          this._cameraBounds.measureInWindow((x, y, width, height) => {
            const captureArea = { x, y, width, height, measured: true };
            this.setState({ captureArea });
          });
        }, 1000);
      });
    }
  };

  _handleQrCodeRead = data => {
    const { financialRide, endRide, payload } = this.props;
    const isAreaCamera =
      !financialRide.isFetching && !payload.isFetching && !endRide.isFetching;
    if (isAreaCamera) {
      if (!this._barCodeRead.includes(data.data)) {
        if (!this.state.captureArea.measured || this._isReading) return;

        this._isReading = true;
        Vibration.vibrate();
        this._processQrCode(data.data);
        this._isReading = false;
        this._barCodeRead.push(data.data);
      }
    }
  };

  _handleQrCodeManualSubmit = ({
    qrCodeNumber,
    qrCodeNumber2,
    qrCodeNumber3,
    qrCodeNumber4,
    qrCodeNumber5,
    qrCodeNumber6,
    qrCodeNumber7
  }) => {
    const qrCode = `${qrCodeNumber}${qrCodeNumber2}${qrCodeNumber3}${qrCodeNumber4}${qrCodeNumber5}${qrCodeNumber6}${qrCodeNumber7}`;

    if (qrCode !== undefined) {
      this._processQrCode(qrCode.toUpperCase());
    }
  };

  // secondsToTime = secs => {
  //   var hours = Math.floor(secs / (60 * 60));

  //   var divisor_for_minutes = secs % (60 * 60);
  //   var minutes = Math.floor(divisor_for_minutes / 60);

  //   var divisor_for_seconds = divisor_for_minutes % 60;
  //   var seconds = Math.ceil(divisor_for_seconds);

  //   var obj = {
  //     hours,
  //     minutes,
  //     seconds
  //   };
  //   return obj;
  // };

  _renderReceipt = response => {
    const { dispatch } = this.props;
    dispatch(
      navigateFromHome(routeNames.SCOOTER_RECEIPT, {
        start: {
          address: response.startPoint.point,
          date: response.startPoint.date
        },
        end: {
          address: response.finishPoint.point,
          date: response.finishPoint.date
        },
        scoo: response.scoo.code,
        tax: response.rate.initialValue,
        valuePerMinute: response.rate.valuePerMinute,
        timeSeconds: response.timeSeconds,
        minutesValue: response.rate.initialValue,
        totalValue: response.amount,
        quantity: response.items[0].quantity,
        minuteFree: response.rate.minuteFree
      })
    );
  };

  _renderBack = () => {
    const { dispatch } = this.props;
    this.paymentMethod = null;
    this._barCodeRead = [];
    dispatch(reset("scooter-qrcodeManual"));
    dispatch(NavigationActions.back());
  };

  _processQrCode = async qrCode => {
    //TODO: Implement qrCode validation

    const { isScooterServiceActive, dispatch } = this.props;

    if (isScooterServiceActive) {
      this._qrCode = qrCode;
      GATrackEvent(BUTTON, CLICK, SCOO_END_RIDE);
      dispatch(reset("scooter-qrcodeManual"));
      this.setState({ qrCodeManual: false });
      this._handlerSubmit();
    } else {
      dispatch(reset("scooter-qrcode"));
      this.setState({ isCameraReady: false });
      this._handlerPaymentTransactionStartRide(qrCode);
    }
  };

  _isBetweenBounds(data) {
    const xMin = this.state.captureArea.x;
    const xMax = this.state.captureArea.x + this.state.captureArea.width;
    const yMin = this.state.captureArea.y;
    const yMax = this.state.captureArea.y + this.state.captureArea.height;

    let p1 = null;
    let p2 = null;
    let p3 = null;
    let p4 = null;

    if (Platform.OS === "ios") {
      const { bounds, size } = data;
      p1 = {
        x: bounds.x / deviceDensity,
        y: bounds.y / deviceDensity
      };
      p2 = {
        x: bounds.x / deviceDensity,
        y: (bounds.y + size.width) / deviceDensity
      };
      p3 = {
        x: (bounds.x + size.height) / deviceDensity,
        y: bounds.y / deviceDensity
      };
      p4 = {
        x: (bounds.x + size.height) / deviceDensity,
        y: (bounds.y + size.width) / deviceDensity
      };
    } else {
      const { bounds } = data;
      const { origin } = bounds;

      p1 = this._pointCalc(bounds.width, bounds.height, origin[0]);
      p2 = this._pointCalc(bounds.width, bounds.height, origin[1]);
      p3 = this._pointCalc(bounds.width, bounds.height, origin[2]);
      p4 = this._pointCalc(bounds.width, bounds.height, origin[3]);
    }

    return (
      p1.x >= xMin &&
      p1.x <= xMax &&
      (p2.x >= xMin && p2.x <= xMax) &&
      (p3.x >= xMin && p3.x <= xMax) &&
      (p4.x >= xMin && p4.x <= xMax) &&
      (p1.y >= yMin && p1.y <= yMax) &&
      (p2.y >= yMin && p2.y <= yMax) &&
      (p3.y >= yMin && p3.y <= yMax) &&
      (p4.y >= yMin && p4.y <= yMax)
    );
  }

  _pointCalc(width, height, { x, y }) {
    const deviceWidthPx = deviceWidth * deviceDensity;
    const deviceHeightPx = deviceHeight * deviceDensity;

    const xCam = (deviceWidthPx * x) / height / deviceDensity;
    const yCam = (deviceHeightPx * y) / width / deviceDensity;

    const point = { x: xCam, y: yCam };

    return point;
  }

  _handleToggleFlashlight = () => {
    if (this.state.flashlight === RNCamera.Constants.FlashMode.off)
      this.setState({ flashlight: RNCamera.Constants.FlashMode.torch });
    else this.setState({ flashlight: RNCamera.Constants.FlashMode.off });
  };

  _handleQrCodeManual = () => {
    this.setState({ qrCodeManual: true });
  };

  _handleKeyboardDidHide = () => {
    this.props.dispatch(reset("scooter-qrcode"));
  };

  _handlerBack = () => {
    GATrackEvent(BUTTON, CLICK, SCOO_START_RIDE);
    this._barCodeRead = [];
    this.setState({ modalVisible: false });
  };

  _handlerCancelRefund = () => {};

  _handlerSubmit = async () => {
    const { profileData, dispatch } = this.props;
    GATrackEvent(BUTTON, CLICK, SCOO_PRE_PAYMENT);

    const payment = await getJson("payment");

    this.setState({ isCameraReady: false });
    dispatch(
      fetchEndRide(this._qrCode, this.props.payload.idRide, profileData.id)
    )
      .then(response => {
        const amount = parseFloat(response.amount);
        const valueDefault = parseFloat(4.3);
        if (amount <= valueDefault) {
          this._renderReceipt(response);
        } else {
          const params = { ...payment };
          dispatch(fetchPaymentCancelRefundTransaction(params))
            .then(
              this._handlerPaymentTransaction(
                response,
                this.props.payload.idRide,
                profileData.id
              )
            )
            .catch(error => {
              // this._handlerError(error);
            });
        }
      })
      .catch(error => {
        this._handlerError(error);
      });
  };

  _handlerStartRide = async (qrCode, idScooTransaction) => {
    const { profileData, dispatch } = this.props;
    const payment = await getJson("payment");
    const params = { ...payment };

    dispatch(fetchStartRide(qrCode, profileData.id, idScooTransaction))
      .then(this._renderBack)
      .catch(error => {
        dispatch(fetchPaymentCancelRefundTransaction(params))
          .then(this._handlerError(error))
          .catch(error => {
            this._handlerError(error);
          });
      });
  };

  _handlerError = error => {
    const { qrCodeManual } = this.state;
    this._barCodeRead = [];
    this._handleKeyboardDidHide();
    this.setState({ isCameraReady: true });

    if (qrCodeManual) {
      this.setState({ isError: true });
    } else {
      const messageError = this.props.payload.erro
        ? this.props.payload.erro
        : "O QrCode informando não é válido! Por favor, tente novamente ou procure um operador da SCOO se o problema persistir.";
      this.props.dispatch(showToast(messageError, toastStyles.ERROR));
    }
  };

  _handlerErrorFinancial = error => {
    const { qrCodeManual } = this.state;
    this._barCodeRead = [];
    this._handleKeyboardDidHide();
    this.setState({ isCameraReady: true });

    if (qrCodeManual) {
      this.setState({ isError: true });
    } else {
      const messageError = this.props.financialRide.error;
      this.props.dispatch(showToast(messageError, toastStyles.ERROR));
    }
  };

  _handlerPaymentTransactionStartRide = async qrCode => {
    const { dispatch, selectedPaymentMethod } = this.props;
    const payment = { ...selectedPaymentMethod };
    const params = { ...payment, rideValue };

    await removeItem("payment");
    await saveItem("payment", JSON.stringify(payment));

    dispatch(fetchRidePaymentTransaction(params, true))
      .then(response => {
        if (
          response.acquirerStatusDescription ===
          resultCodeTransaction.PAYMENT_CONFIRMED
        ) {
          this._handlerStartRide(qrCode, response.id);
        } else if (
          response.acquirerStatusDescription === resultCodeTransaction.DENIED
        ) {
          this._handlerErrorFinancial();
        }
      })
      .catch(error => this._handlerError(error));
  };

  _handlerPaymentTransaction = async (dataRideFinish, scooId, idCustomer) => {
    const { dispatch } = this.props;
    const payment = await getJson("payment");

    const rideValue = dataRideFinish.amount;
    const params = { ...payment, rideValue };
    let error = "";

    dispatch(fetchRidePaymentTransaction(params, false, scooId, idCustomer))
      .then(response => {
        if (
          response.acquirerStatusDescription ===
          resultCodeTransaction.PAYMENT_CONFIRMED
        ) {
          this._renderReceipt(dataRideFinish);
        } else if (
          response.acquirerStatusDescription === resultCodeTransaction.DENIED
        ) {
          this._barCodeRead = [];
          error = this.props.financialRide.error;
          const paymentData = undefined;
          dispatch(
            navigateToRoute(
              [NavigationActions.back(), routeNames.PAYMENT_ERROR],
              { paymentData, error }
            )
          );
        }
      })
      .catch(error => this._handlerError(error));
  };

  _renderTitle = () => {
    const { isScooterServiceActive } = this.props;
    let descriptionTitle = "Scaneie o QR Code do";
    let descriptionSubtitle = "patinete para iniciar a viagem!";

    if (isScooterServiceActive) {
      descriptionTitle = "Scaneie o QR Code do Ponto";
      descriptionSubtitle = "para encerrar a viagem!";
    }

    return (
      <View style={{ alignItems: "center" }}>
        <VoudText style={styles.text}>{descriptionTitle}</VoudText>
        <VoudText style={styles.text2}>{descriptionSubtitle}</VoudText>
      </View>
    );
  };

  _renderCamera = () => {
    const { isCameraReady } = this.state;
    const { financialRide, endRide, payload } = this.props;
    const isAreaCamera =
      !financialRide.isFetching && !payload.isFetching && !endRide.isFetching;

    return (
      <View style={styles.container}>
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={this.state.flashlight}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          onBarCodeRead={this._handleQrCodeRead}
          onCameraReady={this._handleCameraReady}
          Orientation="portrait"
        />

        {((!isCameraReady && payload.isFetching) ||
          financialRide.isFetching ||
          endRide.isFetching) && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={() => {}}
          >
            <View style={styles.containerLoader}>
              <View style={styles.loader}>
                <Loader text="Aguarde..." />
              </View>
            </View>
          </Modal>
        )}
        {isCameraReady && isAreaCamera && (
          <View style={styles.view}>
            <View style={styles.contanierButtonIcon}>
              <ButtonIcon
                style={styles.backIcon}
                onPress={() => this.props.dispatch(NavigationActions.back())}
                icon="md-arrow-back"
              />
            </View>
            <View style={styles.viewTop}>{this._renderTitle()}</View>
            <View style={styles.viewMiddle}>
              <View style={styles.viewMiddleBorder} />
              <View
                style={styles.captureArea}
                ref={r => (this._cameraBounds = r)}
              >
                <View style={styles.captureTopLeft} />
                <View style={styles.captureTopRight} />
                <View style={styles.captureBottomLeft} />
                <View style={styles.captureBottomRight} />
              </View>
              <View style={styles.viewMiddleBorder} />
            </View>
            <View style={styles.viewBottom}>
              <View style={styles.buttonsContainer}>
                <View style={[styles.buttonContainer, styles.buttonContainer1]}>
                  <IconButton
                    iconName={this._flashlightIcon}
                    style={styles.roundButton}
                    iconStyle={styles.roundButtonIcon}
                    onPress={this._handleToggleFlashlight}
                  />
                  <VoudText style={styles.roundButtonText}>Iluminar</VoudText>
                </View>
                <View style={styles.buttonContainer}>
                  <IconButton
                    iconName="md-edit"
                    style={styles.roundButton}
                    iconStyle={styles.roundButtonIcon}
                    onPress={this._handleQrCodeManual}
                  />
                  <VoudText style={styles.roundButtonText}>
                    Digitar código
                  </VoudText>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  _renderContent = () => {
    return this._renderCamera();
  };

  _handlerClose = () => {
    this.setState({ qrCodeManual: false });
  };

  handlerError = () => {
    this.setState({ isError: false });
  };

  render() {
    const { qrCodeManual, isError } = this.state;

    return (
      <View style={[styles.container]}>
        {this._renderContent()}
        <Modal
          animationType="slide"
          transparent={false}
          visible={qrCodeManual}
          onRequestClose={() => {}}
        >
          <ScooServicesQrCodeManualView
            onClose={this._handlerClose}
            onSubmit={this._handleQrCodeManualSubmit}
            isError={isError}
            handlerError={this.handlerError}
          />
        </Modal>
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  containerModal: {
    flex: 1
  },
  preview: {
    flex: 1
  },
  view: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "transparent"
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  viewTop: {
    backgroundColor: "rgba(0, 0, 0, .52)",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 30
  },
  viewMiddle: {
    flexDirection: "row"
  },
  viewMiddleBorder: {
    width: 70,
    height: deviceWidth - 140,
    backgroundColor: "rgba(0, 0, 0, .52)"
  },
  captureArea: {
    width: deviceWidth - 140,
    height: deviceWidth - 140,
    backgroundColor: "transparent"
  },
  viewBottom: {
    backgroundColor: "rgba(0, 0, 0, .52)",
    flex: 1
  },
  imageActive: {
    width: 145,
    height: 73
  },
  imageInactive: {
    width: 119,
    height: 100
  },
  text: {
    color: "#fff",
    marginTop: 15
  },
  text2: {
    color: "#fff"
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 50
  },
  buttonContainer: {
    alignItems: "center"
  },
  buttonContainer1: {
    marginRight: 50
  },
  roundButton: {
    backgroundColor: "#b1afb2",
    width: 48,
    height: 48,
    borderRadius: 36
  },
  roundButtonIcon: {
    color: "#fff",
    fontSize: 24
  },
  roundButtonText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5
  },
  captureTopLeft: {
    width: 50,
    height: 50,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    position: "absolute",
    left: 0,
    top: 0,
    borderLeftColor: colors.BRAND_PRIMARY,
    borderTopColor: colors.BRAND_PRIMARY
  },
  captureTopRight: {
    width: 50,
    height: 50,
    borderTopWidth: 3,
    borderRightWidth: 3,
    position: "absolute",
    right: 0,
    top: 0,
    borderRightColor: colors.BRAND_PRIMARY,
    borderTopColor: colors.BRAND_PRIMARY
  },
  captureBottomLeft: {
    width: 50,
    height: 50,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    position: "absolute",
    left: 0,
    bottom: 0,
    borderLeftColor: colors.BRAND_PRIMARY,
    borderBottomColor: colors.BRAND_PRIMARY
  },
  captureBottomRight: {
    width: 50,
    height: 50,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    position: "absolute",
    right: 0,
    bottom: 0,
    borderRightColor: colors.BRAND_PRIMARY,
    borderBottomColor: colors.BRAND_PRIMARY
  },
  codeInputContainer: {
    height: 95,
    backgroundColor: "rgba(155, 155, 155, .92)",
    paddingHorizontal: 43,
    paddingVertical: 8
  },
  codeInputLabel: {
    color: "#fff",
    alignSelf: "center",
    marginBottom: 5
  },
  wrapperHeader: {
    position: "absolute",
    padding: 10,
    top: Platform.select({
      ios: 60,
      android: 40
    }),
    marginLeft: 24
  },
  backIcon: {
    // alignSelf: 'center',
    marginRight: 8,
    marginLeft: 16,
    margin: 10
  },
  contanierButtonIcon: {
    backgroundColor: "rgba(0, 0, 0, .52)",
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight,
    alignItems: "flex-start"
  },
  containerLoader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  loader: {
    width: 160,
    height: 160,
    elevation: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center"
  }
});

const mapStateToProps = state => ({
  isScooterServiceActive: state.scooter.isActive,
  startDate: state.scooter.startDate,
  payload: state.scooter,
  selectedPaymentMethod: getSelectedPaymentMethod(state),
  financialRide: state.financialRide,
  // startRide: state.authStart,
  profileData: state.profile.data,
  endRide: state.authEnd
});

export const ScooterServicesQrCode = connect(mapStateToProps)(
  reduxForm({ form: "scooter-qrcode", destroyOnUnmount: false })(
    ScooterServicesQrCodeView
  )
);
