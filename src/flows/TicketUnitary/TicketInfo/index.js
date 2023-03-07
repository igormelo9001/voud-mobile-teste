import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  ScrollView
} from "react-native";
import Swiper from "react-native-swiper";

import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import VoudText from "../../../components/VoudText";
import { colors } from "../../../styles";
import Icon from "../../../components/Icon";
import BrandText from "../../../components/BrandText";
import { routeNames } from "../../../shared/route-names";
import { navigateFromHome } from "../../../redux/nav";
import SwiperPagination from "../../../components/SwiperPagination";
import { getHostQrCode } from "../../../shared/remote-config";

import StationEnableList from "../component/StationEnableList";
import LoadMask from "../../../components/LoadMask";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 0,
    marginTop: 120
    // alignItems:"center",
  },
  swiper: {
    flex: 1
  },
  pagerDot: {
    width: 11,
    height: 11,
    borderRadius: 11,
    margin: 5
  },
  page: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 35,
    marginTop: 16
    // backgroundColor:"red",
    // justifyContent:"center",
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 24,
    marginTop: 16,
    color: colors.BRAND_PRIMARY,
    fontWeight: "bold"
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.BRAND_PRIMARY,
    // fontWeight: 'bold',
    textAlign: "center"
  },
  locate: {},
  get: {
    marginBottom: 28,
    marginTop: 41
  },
  security: {
    // width: 92,
    // height: 86,
    marginBottom: 42,
    marginTop: 20
  },
  travel: {
    // width: 119,
    // height: 119,
    marginBottom: 20,
    marginTop: 0
  },
  turnOn: {
    width: 118,
    height: 135,
    marginBottom: 15,
    marginTop: 0
  },
  enjoy: {
    width: 92,
    height: 86,
    marginBottom: 30,
    marginTop: 20
  },
  return: {
    // width: 62,
    // height: 107,
    // marginBottom: 31,
    // marginTop: 38
  },
  textTitle: {
    fontSize: 18,
    color: "#6E3E91",
    fontWeight: "bold"
  },
  station: {
    margin: 5,
    fontSize: 14,
    color: "#6E3E91"
  },
  buttonNextPrev: {
    padding: 10,
    fontSize: 16,
    color: colors.BRAND_PRIMARY,
    fontWeight: "bold"
  },
  containnerButton: {
    position: "absolute",
    marginTop: 0,
    marginBottom: 0,
    alignItems: "flex-end"
  }
});

// pagination
const renderPagination = (index, total, context) => {
  return (
    <SwiperPagination
      index={index}
      total={total}
      prev={{ text: "Voltar", action: () => context.scrollBy(-1) }}
      next={{ text: "Continuar", action: () => context.scrollBy(1) }}
      navByIndex={i => {
        context.scrollBy(i === 0 ? -1 : i);
      }}
      end={{ text: "Entendi!", action: context.props.dismiss }}
      styleAction={{ color: colors.BRAND_PRIMARY, fontWeight: "bold" }}
      styleDot={{ backgroundColor: colors.BRAND_PRIMARY }}
      styleDotExternal={{
        position: "absolute",
        backgroundColor: colors.BRAND_SECONDARY
      }}
    />
  );
};

class TicketInfoView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      prevButtonText: "",
      nextButtonText: "continuar",
      isMyTicket: false,
      station: [],
      isLoading: true
    };
  }

  _handlerInfo = () => {
    this.props.navigation.dispatch(NavigationActions.back());
  };

  _dismiss = () => {
    const { dispatch } = this.props;
    dispatch(
      navigateFromHome(routeNames.MY_TICKET_UNITARY, {
        issuerType: "BIUN"
      })
    );
  };

  async componentDidMount() {
    const listStation = await getHostQrCode();
    this.setState({ station: JSON.parse(listStation), isLoading: false });
  }

  renderContent = () => {
    const { station } = this.state;
    const {
      navigation: {
        state: { params: myticket }
      }
    } = this.props;

    const isSwiper = myticket.myticket;

    if (isSwiper) {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ alignItems: "center", marginTop: 0 }}>
            <VoudText style={styles.textTitle}>
              Estações habilitadas com
            </VoudText>
            <VoudText style={styles.textTitle}>Bilhete QR Code</VoudText>
          </View>
          <View
            style={{
              marginTop: 16,
              flex: 1
            }}
          >
            {station.length > 0 && <StationEnableList data={station} />}
          </View>
        </View>
      );
    } else {
      const imageQrCodeOnboarding = require("../../../images/qrcodeOnboarding.png");
      const imageQrCodeOnboardingDevice = require("../../../images/qrcodeOnboardingDevice.png");
      return (
        <Swiper
          loop={false}
          scrollEnabled={false}
          renderPagination={renderPagination}
          dismiss={this._dismiss}
        >
          <View style={styles.page}>
            <Image
              source={imageQrCodeOnboardingDevice}
              style={styles.security}
            />
            <VoudText style={styles.title}>Bilhete QR Code</VoudText>
            <VoudText style={styles.description}>
              Agora você pode pagar sua passagem também com o Bilhete QR Code no
              aplicativo.
            </VoudText>
          </View>
          <View style={styles.page}>
            <Image source={imageQrCodeOnboarding} style={styles.get} />
            <VoudText style={styles.title}>Estações habilitadas</VoudText>
            <VoudText style={styles.description}>
              Antes de comprar, fique atento às estações habilitadas com
              leitores QR Code:
            </VoudText>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ alignItems: "center", marginTop: 0 }}>
              <VoudText style={styles.textTitle}>
                Estações habilitadas com
              </VoudText>
              <VoudText style={styles.textTitle}>Bilhete QR Code</VoudText>
            </View>
            <View
              style={{
                marginTop: 16,
                flex: 1
              }}
            >
              {station.length > 0 && <StationEnableList data={station} />}
            </View>
          </View>
        </Swiper>
      );
    }
  };

  render() {
    const { isLoading } = this.state;
    const {
      navigation: {
        state: { params: myticket }
      }
    } = this.props;

    const isSwiper = myticket.myticket;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._handlerInfo}>
          <View syle={{ flexDirection: "row" }}>
            <Icon
              name="close"
              size={30}
              style={{ marginLeft: 16, marginTop: 8 }}
              color={colors.BRAND_PRIMARY}
            />
          </View>
        </TouchableOpacity>
        {this.renderContent()}
        {isLoading && isSwiper === true && <LoadMask />}
      </View>
    );
  }
}

const mapDispatchToProps = state => ({
  listTicket: state.ticketUnitary
});

export const TicketInfo = connect(mapDispatchToProps)(TicketInfoView);
