import React from "react";
import MapView from "react-native-maps";
import { Fragment, View } from "react-native";

const listImage = [
  {
    type: "METRÔ",
    color: "#0455A1",
    image: require("../../images/ic-subway-1-Azul.png")
  },
  {
    type: "METRÔ",
    color: "#007E5E",
    image: require("../../images/ic-subway-2-Verde.png")
  },
  {
    type: "METRÔ",
    color: "#EE372F",
    image: require("../../images/ic-subway-3-Vermelha.png")
  },
  {
    type: "METRÔ",
    color: "#F0C800",
    image: require("../../images/ic-subway-4-Amarela.png")
  },
  {
    type: "CAMINHADA",
    color: "#007AFF",
    image: require("../../images/ic-walk.png")
  },
  {
    type: "ÔNIBUS",
    color: "#782F40",
    image: require("../../images/ic-bus-Bordo.png")
  },
  {
    type: "ÔNIBUS",
    color: "#F0C800",
    image: require("../../images/ic-bus-Amarela.png")
  },
  {
    type: "ÔNIBUS",
    color: "#002F6C",
    image: require("../../images/ic-bus-AzulEscuro.png")
  },
  {
    type: "ÔNIBUS",
    color: "#0082BA",
    image: require("../../images/ic-bus-Azul.png")
  },
  {
    type: "ÔNIBUS",
    color: "#808080",
    image: require("../../images/ic-bus-Cinza.png")
  },
  {
    type: "ÔNIBUS",
    color: "#FF671F",
    image: require("../../images/ic-bus-Laranja.png")
  },
  {
    type: "ÔNIBUS",
    color: "#0082BA",
    image: require("../../images/ic-bus-VerdeClaro.png")
  },
  {
    type: "ÔNIBUS",
    color: "#509E2F",
    image: require("../../images/ic-bus-VerdeEscuro.png")
  },
  {
    type: "ÔNIBUS",
    color: "#782F40",
    image: require("../../images/ic-bus-Vermelha.png")
  },

  {
    type: "TREM",
    color: "#CA016B",
    image: require("../../images/ic-cptm-Rubi.png")
  },
  {
    type: "TREM",
    color: "#97A098",
    image: require("../../images/ic-cptm-Diamante.png")
  },
  {
    type: "TREM",
    color: "#01A9A7",
    image: require("../../images/ic-cptm-Esmeralda.png")
  },

  {
    type: "TREM",
    color: "#049FC3",
    image: require("../../images/ic-cptm-Turquesa.png")
  },

  {
    type: "TREM",
    color: "#F68368",
    image: require("../../images/ic-cptm-Coral.png")
  },

  {
    type: "TREM",
    color: "#0455A1",
    image: require("../../images/ic-cptm-Safira.png")
  },

  {
    type: "TREM",
    color: "#509E2F",
    image: require("../../images/ic-cptm-Jade.png")
  },



];

const imageDefault = require("../../images/ic-null.png");

const Directions = ({ way }) =>
  way.map((item, index) => {
    let imageMarker = undefined;
    imageMarker = listImage.filter(
      f =>
        f.type === item.transportType &&
        f.color === item.lineColor.toUpperCase()
    )[0];

    const latitudeLongitue = item.lngLtn[0];

    if (index > 0) {
      return (
        <View  key={index}>
          <MapView.Marker
            key={index}
            coordinate={latitudeLongitue}
            anchor={{ x: 0, y: 0 }}
            image={imageMarker  === undefined ? imageDefault : imageMarker.image}
            calloutOffset={{ x: 0, y: 0 }}
          />
           <MapView.Polyline
          key={index}
          coordinates={item.lngLtn}
          strokeWidth={5}
          strokeColor={item.lineColor}
          lineCap="round"
        />
        </View>
      );
    } else {
      return (
        <MapView.Polyline
          key={index}
          coordinates={item.lngLtn}
          strokeWidth={5}
          strokeColor={item.lineColor}
          lineCap="round"
        />
      );
    }
  });

export default Directions;
