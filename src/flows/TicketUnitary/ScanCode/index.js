import React, { Component } from "react";

import { View, Image, TouchableOpacity, BackHandler } from "react-native";
import QRCode from "react-native-qrcode-svg";
import moment from "moment";
import { backToHome } from "../../../redux/nav";

import styles from "./style";
import Icon from "../../../components/Icon";
import BrandText from "../../../components/BrandText";
import SystemText from "../../../components/SystemText";

const imageSubway = require("./image/metro.png");
const imageCptm = require("./image/cptm.png");

import { getHostQrCodeValidate } from "../../../shared/remote-config";

class ScanCodeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validateDescription: ""
    };
  }

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backHandler);
  }

  async componentDidMount() {
    const responseValidate = await getHostQrCodeValidate();
    this.setState({ validateDescription: responseValidate });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backHandler);
  }

  backHandler = () => {
    this.close();
    return true;
  };

  close = () => {
    const {
      navigation: { dispatch }
    } = this.props;
    dispatch(backToHome());
  };

  render() {
    const {
      navigation: {
        state: {
          params: {
            item: {
              qrCodeBase64,
              saleBrokerCardSessionId,
              validade,
              idQrcodeExternal,
              idTransactionExternal
            }
          }
        }
      }
    } = this.props;

    const { validateDescription } = this.state;

    return (
      <View style={[styles.container, { backgroundColor: "#6E3E91" }]}>
        <View style={styles.containerInternal}>
          <TouchableOpacity style={styles.buttonClose} onPress={this.close}>
            <View>
              <Icon style={styles.icon} onPress={this.close} name="close" />
            </View>
          </TouchableOpacity>
          <View style={styles.containerTitle}>
            <BrandText style={styles.title}>Escanear QR Code</BrandText>
          </View>
        </View>
        <View style={styles.containerCode}>
          <View style={styles.containerImageQrCode}>
            <QRCode value={qrCodeBase64} size={210} />
          </View>
          <View style={styles.containerTicket}>
            <SystemText style={styles.titleTicket}>
              <SystemText style={[styles.titleTicket, { fontWeight: "bold" }]}>
                Ticket:
              </SystemText>{" "}
              {idQrcodeExternal}
            </SystemText>
            <SystemText style={styles.titleTicket}>
              <SystemText style={[styles.titleTicket, { fontWeight: "bold" }]}>
                Transação:
              </SystemText>{" "}
              {idTransactionExternal}
            </SystemText>
            <SystemText style={styles.titleTicket}>
              {validateDescription}
            </SystemText>
          </View>
        </View>
        <View style={[styles.image, { padding: 5 }]}>
          <Image source={imageCptm} style={{ marginRight: 10 }} />
          <Image source={imageSubway} style={{ marginLeft: 10  }} />
        </View>
      </View>
    );
  }
}

export const ScanCode = ScanCodeView;
