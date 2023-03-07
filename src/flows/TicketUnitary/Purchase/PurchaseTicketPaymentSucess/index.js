// NPM imports
import React, { Component } from "react";
import { ScrollView, Image, View, BackHandler } from "react-native";
import {
  backToHome,
  navigateFromHome,
  navigateToRoute
} from "../../../../redux/nav";
import { routeNames } from "../../../../shared/route-names";

// VouD imports
import BrandText from "../../../../components/BrandText";
import VoudText from "../../../../components/VoudText";
import SystemText from "../../../../components/SystemText";
import Icon from "../../../../components/Icon";
import Button from "../../../../components/Button";

import styles from "./style";

import { fetchTicketUnitaryList } from "../../store/ducks/ticketUnitary";

import { getHostQrCode } from "../../../../shared/remote-config";
import StationEnableList from "../../component/StationEnableList";

const imageTicket = require("./image/qrcodesucess.png");

class PurchaseTicketPaymentSuccessfulView extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      station: []
    };
  }

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backHandler);
  }

  async componentDidMount() {
    this._isMounted = true;

    const listStation = await getHostQrCode();
    if (this._isMounted) {
      this.setState({ station: JSON.parse(listStation) });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    BackHandler.removeEventListener("hardwareBackPress", this.backHandler);
  }

  backHandler = () => {
    this.finish();
    return true;
  };

  finish = () => {
    const {
      navigation: { dispatch }
    } = this.props;
    dispatch(fetchTicketUnitaryList());
    dispatch(backToHome());
  };

  goTicket = () => {
    const {
      navigation: {
        dispatch,
        state: {
          params: { type }
        }
      }
    } = this.props;

    dispatch(navigateFromHome(routeNames.MY_TICKET_UNITARY));
  };

  render() {
    const { station } = this.state;

    return (
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Icon style={styles.closeIcon} name="close" onPress={this.finish} />
          <BrandText style={styles.successTitle}>Pagamento aprovado!</BrandText>
          <View style={[styles.containerTitle]}>
            <View style={{ alignItems: "center" }}>
              <SystemText style={styles.description}>
                Dirija-se à catraca identificada como Bilhete QR
              </SystemText>
              <SystemText style={styles.description}>
                Code e aproxime o código do leitor indicado.
              </SystemText>
            </View>
          </View>
        </View>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={imageTicket} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContainer}
        >
          <View style={styles.containerStation}>
            <VoudText style={styles.textTitle}>Estações habilitadas</VoudText>
          </View>
          <View style={{ marginTop: 16 }}>
            {station.length > 0 && <StationEnableList data={station} />}
          </View>
        </ScrollView>
        <View style={styles.actionBtnContainer}>
          <Button onPress={() => this.goTicket()}>VER BILHETE</Button>
        </View>
      </View>
    );
  }
}

export const PurchaseTicketPaymentSuccessful = PurchaseTicketPaymentSuccessfulView;
