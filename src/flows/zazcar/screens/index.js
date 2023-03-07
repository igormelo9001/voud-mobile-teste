import React from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  Platform,
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";

import ScreenWithCardHeader from "../../../components/ScreenWithCardHeader";
import Header, { headerActionTypes } from "../../../components/Header";
import Button from "../../../components/Button";
import Swipper from "../../../components/Swipper";
import { formatCurrency } from "../../../utils/parsers-formaters";
import { openUrl } from "../../../utils/open-url";

//imports images
import { sedanLivre, compactoLivre } from "../../../images/rent_cars/index";

import { colors } from "../../../styles";
import { getPaddingForNotch } from "../../../utils/is-iphone-with-notch";

const styles = {
  mainContainer: {
    flex: 1,
    paddingBottom: getPaddingForNotch(),
    backgroundColor: "white"
  },
  scrollView: {
    flex: 1
  },
  imgStyle: {
    flex: 1
  },
  imgPackStyle: {
    height: (Dimensions.get("window").height * 10) / 100,
    width: (Dimensions.get("window").width * 10) / 100,
    justifyContent: "flex-start"
  },

  pointNameTxt: {
    fontSize: 17,
    fontWeight: "bold",
    lineHeight: 24
  },
  pointAddressTxt: {
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 20
  },
  carHeaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 8
  },
  cardCarsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "stretch",
    borderWidth: 0.5,
    borderColor: colors.GRAY_LIGHT,
    borderRadius: 4,
    marginHorizontal: 8,
    marginVertical: 8
  },
  car: {
    flex: 1,
    flexWrap: "wrap"
  },
  carDetail: {
    marginHorizontal: 8,
    marginVertical: 8,
    justifyContent: "space-around",
    alignItems: "stretch"
  },
  listPacksContainer: {
    justifyContent: "space-between",
    alignItems: "center"
  },
  lineOfPacks: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.GRAY_LIGHT
  },
  buttonsContainer: {
    alignItems: "stretch",
    paddingBottom: 16,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 16
  },
  label: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.GRAY_LIGHT
  },
  text: {
    fontSize: 11,
    lineHeight: 24,
    color: colors.GRAY
  }
};

class ZazcarView extends ScreenWithCardHeader {
  openApp = async deepLink => {
    const { dispatch } = this.props;
    const appStoreLink =
      "https://itunes.apple.com/us/app/zazcar/id1114155973?ls=1&mt=8";
    const googlePlayLink =
      "https://play.google.com/store/apps/details?id=br.com.zazcar&hl=pt_BR";

    try {
      await openUrl(deepLink);
    } catch (error) {
      if (Platform.OS === "ios" && appStoreLink) {
        await openUrl(appStoreLink);
      }
      if (Platform.OS === "android" && googlePlayLink) {
        await openUrl(googlePlayLink);
      }
    }
    dispatch(NavigationActions.back());
  };

  isPackLivre = packName => {
    if (packName === sedanLivre || packName === compactoLivre) {
      return true;
    }
    return false;
  };

  translateModelTrasmition = modelTransmition => {
    switch (modelTransmition) {
      case "AUTOMATIC":
        return "AUTOMÁTICO";
      default:
        return "MANUAL";
    }
  };

  getAutonomyAndFuelLevel = car =>
    `${car.fuelLevel}% - ${car.estimatedAutonomy}km`;

  getPackPrice = pack =>{
    const isFree = this.isPackLivre(pack.name);
    const price = formatCurrency(
      ( isFree ? pack.hourPrice : pack.value) / 100
    );
    const showHour = isFree ? '/hora': '';
    return `R$ ${price}${showHour} + R$ ${formatCurrency(pack.kmCost / 100)}/km`;
  }

  getAdditionalPackPrice = pack =>
    `R$ ${formatCurrency(pack.hourPrice / 100)}/hora`;

  renderListOfPlans = packs => {
    if (!packs) return null;
    const packsByModel = packs.map((pack, index, array) => {
      const i = array.length - 1;
      const imgPack = pack.icon;
      return (
        <View
          key={pack.name}
          style={
            i != index
              ? styles.lineOfPacks
              : [
                  styles.lineOfPacks,
                  {
                    borderBottomWidth: 0,
                    marginBottom: 0,
                    paddingBottom: 0
                  }
                ]
          }
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row"
            }}
          >
            <Image
              resizeMode="contain"
              source={{ uri: imgPack }}
              style={styles.imgPackStyle}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: colors.GRAY,
                marginLeft: 5
              }}
            >
              {this.getPackPrice(pack)}
            </Text>
          </View>

          {!this.isPackLivre(pack.name) ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text style={{ fontSize: 11, color: colors.GRAY_LIGHT }}>
                {"Adicional"}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  color: colors.GRAY_LIGHT
                }}
              >
                {this.getAdditionalPackPrice(pack)}
              </Text>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text style={{ fontSize: 11, color: colors.GRAY_LIGHT }}>{}</Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  color: colors.GRAY_LIGHT
                }}
              />
            </View>
          )}
        </View>
      );
    });
    return <View style={styles.listPacksContainer}>{packsByModel}</View>;
  };

  renderCardsOfCars = () => {
    const { navigation } = this.props;
    const details = navigation.getParam("details");
    const pointAddress = navigation.getParam("pointAddress");
    const pointName = navigation.getParam("pointName");

    if (!details) return null;

    let cards = [];

    details.map((car, index) => {
      if (!car.available) return;
      const imgCar = car.thumbnail;
      cards.push(
        <View key={index}>
          <View style={styles.carHeaderContainer}>
            <Text style={styles.pointNameTxt}>{pointName}</Text>
            <Text style={styles.pointAddressTxt}>{pointAddress}</Text>
          </View>
          <View style={styles.cardCarsContainer}>
            <View style={styles.car}>
              <Image
                resizeMode="contain"
                source={{ uri: imgCar }}
                style={styles.imgStyle}
              />
              <View style={{ alignItems: "center", marginTop: 5 }}>
                <Text
                  style={styles.label}
                >{`${car.model} - ${car.category}`}</Text>
              </View>
              <View style={{ alignItems: "center", marginTop: 5 }}>
                <Text style={styles.text}>{`Placa: ${car.plate}`}</Text>
              </View>
            </View>
            <View
              style={{
                width: 1,
                marginLeft: 5,
                marginRight: 5,
                borderWidth: 0.5,
                borderColor: colors.GRAY_LIGHT
              }}
            />
            <View style={styles.carDetail}>
              <View>
                <Text style={styles.label}>{"CAMBIO"}</Text>
                <Text style={styles.text}>
                  {this.translateModelTrasmition(car.transmissionType)}
                </Text>
              </View>
              <View>
                <Text style={styles.label}>{"CATEGORIA"}</Text>
                <Text style={styles.text}>{car.category}</Text>
              </View>
              <View>
                <Text style={styles.label}>{"COMBUSTÍVEL"}</Text>
                <Text style={styles.text}>
                  {this.getAutonomyAndFuelLevel(car)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );

      cards.push(
        <View style={{ flex: 1 }} key={car.plate}>
          <View>{this.renderListOfPlans(car.packs)}</View>
          <View>
            <Button
              onPress={this.openApp.bind(this, car.link)}
              style={styles.buttonsContainer}
            >
              Usar Agora
            </Button>
          </View>
        </View>
      );
    });

    return <Swipper>{cards}</Swipper>;
  };

  render() {
    const { dispatch } = this.props;
    return (
      <View style={styles.mainContainer}>
        <Header
          title="Alugar Carro"
          left={{
            type: headerActionTypes.CLOSE,
            onPress: () => dispatch(NavigationActions.back())
          }}
          right={null}
        />

        <ScrollView style={styles.scrollView}>
          {this.renderCardsOfCars()}
        </ScrollView>
      </View>
    );
  }
}

const Zazcar = connect()(ZazcarView);

export default Zazcar;
