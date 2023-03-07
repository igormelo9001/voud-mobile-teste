import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Swiper from "react-native-swiper";

import { NavigationActions } from "react-navigation";
import VoudText from "../../../components/VoudText";
import { colors } from "../../../styles";
import Icon from "../../../components/Icon";
import SwiperPagination from "../../../components/SwiperPagination";

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

export class ScooterServicesInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      prevButtonText: "",
      nextButtonText: "continuar",
      isScooterInfo: false
    };
  }

  _handlerInfo = () => {
    this.props.navigation.dispatch(NavigationActions.back());
  };

  _dismiss = () => {
    this.props.navigation.dispatch(NavigationActions.back());
  };

  render() {
    const imageLocate = require("../../../images/img-localize-scoo.png");
    const imageGet = require("../../../images/scoo-get.png");
    const imageSecurity = require("../../../images/scoo-security.png");
    const imageTravel = require("../../../images/scoo-travel.png");
    const imageTurnOn = require("../../../images/scoo-turn-on.png");
    const imageEnjoy = require("../../../images/scoo-enjoy.png");
    const imageReturn = require("../../../images/scoo-locate-u.png");
    const imageDevice = require("../../../images/scoo-get-device.png");
    const imageRules = require("../../../images/respeite-as-regras.png");

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._handlerInfo}>
          <View syle={{ flexDirection: "row" }}>
            <Icon
              name="close"
              size={30}
              style={{ marginLeft: 16, marginTop: 16 }}
              color={colors.BRAND_PRIMARY}
            />
          </View>
        </TouchableOpacity>

        <Swiper
          loop={false}
          scrollEnabled={false}
          renderPagination={renderPagination}
          dismiss={this._dismiss}
        >
          <View style={styles.page}>
            <Image source={imageRules} style={styles.return} />
            <VoudText style={[styles.title, { marginBottom: 5 }]}>
              1. Respeite as regras de uso
            </VoudText>
            <VoudText style={[styles.description, { fontSize: 13 }]}>
              A circulação é permitida somente em ciclovias, ciclofaixas e ruas
              até 40km/h. Velocidade máxima de 20km/h e nos 10 primeiros usos
              até 15km/h.
            </VoudText>
            <VoudText style={styles.description}>
              E lembre-se, o patinete deverá ser estacionado em uma estação.
            </VoudText>
          </View>

          <View style={styles.page}>
            <Image source={imageLocate} style={styles.locate} />
            <VoudText style={[styles.title]}>2. Localize</VoudText>
            <VoudText style={[styles.description]}>
              Localize no mapa o ponto de retirada do patinete mais próximo de
              você.
            </VoudText>
          </View>
          <View style={styles.page}>
            {Platform.OS === "ios" && (
              <Image source={imageDevice} style={styles.get} />
            )}
            {Platform.OS === "android" && (
              <Image source={imageGet} style={styles.get} />
            )}
            <VoudText style={styles.title}>3. Retire</VoudText>
            <VoudText style={styles.description}>
              Utilize a câmera do seu celular para retirar o patinete.
            </VoudText>
          </View>
          <View style={styles.page}>
            <Image source={imageSecurity} style={styles.security} />
            <VoudText style={styles.title}>4. Segurança</VoudText>
            <VoudText style={styles.description}>
              Utilize o capacete, respeite as leis de trânsito e os pedestres.
              Permitido somente para maiores de 18 anos.
            </VoudText>
          </View>
          <View style={styles.page}>
            <Image source={imageTravel} style={styles.travel} />
            <VoudText style={styles.title}>5. Viagem</VoudText>
            <VoudText style={styles.description}>
              Nas ciclovias e ciclofaixas a velocidade máxima permitida é de até
              20km/h.
            </VoudText>
          </View>
          <View style={styles.page}>
            <Image source={imageTurnOn} style={styles.turnOn} />
            <VoudText style={styles.title}>6. Ligue</VoudText>
            <VoudText style={styles.description}>
              Impulsione o patinete e pressione o acelerador para baixo com o
              polegar direito.
            </VoudText>
          </View>
          <View style={styles.page}>
            <Image source={imageEnjoy} style={[styles.enjoy]} />
            <VoudText style={styles.title}>7. Divirta-se</VoudText>
            <VoudText style={styles.description}>
              Para sua segurança e diversão, fique atento aos desníveis, buracos
              e trânsito em sua viagem. Estações não abrem em dias de chuva.
            </VoudText>
          </View>
          <View style={styles.page}>
            <Image source={imageReturn} style={styles.return} />
            <VoudText style={styles.title}>8. Devolução</VoudText>
            <VoudText style={styles.description}>
              Vá até o ponto mais próximo do seu destino e clique em encerrar
              para escanear o QR do ponto e finalizar a viagem.
            </VoudText>
          </View>
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 0,
    marginTop: 140
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
    paddingHorizontal: 45
    // marginTop: 16
    // backgroundColor:"red",
    // justifyContent:"center",
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 24,
    marginTop: 24,
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
  locate: {
    // width: 62,
    // height: 107,
    // marginBottom: 21,
    // marginTop: 20,
  },
  get: {
    width: 62,
    height: 107,
    marginBottom: 28,
    marginTop: 41
  },
  security: {
    width: 92,
    height: 86,
    marginBottom: 42,
    marginTop: 20
  },
  travel: {
    width: 119,
    height: 119,
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
