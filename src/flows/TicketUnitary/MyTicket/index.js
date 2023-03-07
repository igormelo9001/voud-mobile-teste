import React, { Component } from "react";

import { View, Image, ScrollView, AppState } from "react-native";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import Swiper from "react-native-swiper";

import Moment from "moment";
import Header, { headerActionTypes } from "../../../components/Header";
import { navigateToRoute } from "../../../redux/nav";
import { routeNames } from "../../../shared/route-names";
import { colors } from "../../../styles";
import { fetchTicketUnitaryList } from "../store/ducks/ticketUnitary";
import {
  clearTicketUnitaryListExtract,
  fetchTicketUnitaryListExtract
} from "../store/ducks/ticketUnitaryExtract";

import styles from "./style";
import BrandText from "../../../components/BrandText";
import CardView from "../component/card";
import SystemText from "../../../components/SystemText";
import TouchableText from "../../../components/TouchableText";
import Button from "../../../components/Button";
import Loader from "../../../components/Loader";

import ExtractList from "./component/ExtractList";

const errorImage = require("../../../images/error.png");
const qrCodeEmpty = require("./images/qrcode.png");

import LoadMask from "../../../components/LoadMask";
import { getQrCodeExtractVisible } from "../../../shared/remote-config";

class MyTicketView extends Component {
  state = {
    isLoadingExtract: false,
    appState: AppState.currentState,
    isExtract: false
  };
  async componentDidMount() {
    const response = await getQrCodeExtractVisible();
    const extract = JSON.parse(response);
    this.loadingData();

    AppState.addEventListener("change", this.handleAppStateChange);
    this.setState({ isExtract: extract.visible });
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  handleAppStateChange = nextAppState => {
    const { appState } = this.state;
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      this.loadingData();
    }
    this.setState({ appState: nextAppState });
  };

  loadingData = () => {
    const {
      navigation: { dispatch }
    } = this.props;
    dispatch(fetchTicketUnitaryList());
  };

  renderColor = selected => {
    if (selected) return "#A84D97";
    return "#787878";
  };

  handlerScanCode = item => {
    const {
      navigation: { dispatch }
    } = this.props;
    dispatch(
      navigateToRoute(routeNames.SCAN_CODE, {
        item: {
          qrCodeBase64: item.qrCodeBase64,
          validade: Moment(item.validade).format("DD/MM/YYYY"),
          status: item.status,
          saleBrokerCardSessionId: item.saleBrokerCardSessionId,
          idQrcodeExternal: item.idQrcodeExternal,
          idTransactionExternal: item.idTransactionExternal
        }
      })
    );
  };

  close = () => {
    const {
      navigation: { dispatch }
    } = this.props;
    dispatch(NavigationActions.back());
  };

  add = () => {
    const {
      navigation: { dispatch }
    } = this.props;
    dispatch(navigateToRoute(routeNames.PURCHASE_TICKET, {}));
  };

  renderText = () => {
    const {
      listTicket: { data }
    } = this.props;

    if (data !== undefined) {
      if (data.length === 0) return `Você não tem bilhetes`;
      const unityText = data.length === 1 ? "unidade" : "unidades";
      return `Você tem ${data.length} ${unityText}`;
    }
    return "";
  };

  renderHeader = () => {
    const { data, isFetching, error } = this.props.extract;
    const { isLoadingExtract } = this.state;

    if (!isFetching && (!error || error === ""))
      if (!isLoadingExtract) {
        return null;
      }

    return (
      <View style={styles.containerResultLastMove}>
        <View style={[styles.containerLastMove]}>
          <BrandText style={styles.textLastMove}>
            Últimas movimentações
          </BrandText>
        </View>

        {isFetching && (
          <View style={styles.loaderContainer}>
            <Loader iconSize={60} text="Carregando..." style={styles.loader} />
          </View>
        )}

        {isLoadingExtract && !isFetching && error !== "" && (
          <View style={styles.stateMessage}>
            <Image source={errorImage} style={styles.stateIcon} />
            <View style={styles.errorStateTextContainer}>
              <BrandText style={styles.errorStateText}>
                Ocorreu um erro na sua requisição
              </BrandText>
              <TouchableText
                onPress={this.handlerExtractRefresing}
                style={styles.errorStateButton}
                color={colors.BRAND_PRIMARY}
              >
                Tentar novamente
              </TouchableText>
            </View>
          </View>
        )}

        {isLoadingExtract && !isFetching && data.length === 0 && error === "" && (
          <View style={styles.stateMessage}>
            <BrandText style={styles.emptyStateText}>
              Nenhum registro encontrado
            </BrandText>
          </View>
        )}
      </View>
    );
  };

  handlerExtract = () => {
    const { isLoadingExtract } = this.state;
    const { dispatch } = this.props;

    if (isLoadingExtract) {
      dispatch(clearTicketUnitaryListExtract());
      this.setState({ isLoadingExtract: false });
    } else {
      dispatch(fetchTicketUnitaryListExtract());
      this.setState({ isLoadingExtract: true });
    }
  };

  handlerExtractRefresing = () => {
    const { dispatch } = this.props;
    dispatch(fetchTicketUnitaryListExtract());
  };

  info = () => {
    const {
      navigation: { dispatch }
    } = this.props;
    dispatch(navigateToRoute(routeNames.TICKET_INFO, { myticket: true }));
  };

  render() {
    const {
      listTicket: { data, isFetching }
    } = this.props;

    const { isLoadingExtract, isExtract } = this.state;
    const titleExtract = !isLoadingExtract ? "Ver extrato" : "Ocultar extrato";
    const height = data.length > 0 ? 190 : 168;

    return (
      <View style={styles.container}>
        <Header
          title="Meus Bilhetes QR Code"
          left={{
            type: headerActionTypes.BACK,
            onPress: this.close
          }}
          right={{
            type: headerActionTypes.INFO,
            onPress: this.info
          }}
          isRequestCard
        />
        <View style={{ backgroundColor: colors.BRAND_PRIMARY, height }}>
          <View>
            <View style={styles.containerDescription}>
              <BrandText
                style={[
                  styles.description,
                  { fontWeight: "bold", marginTop: 8 }
                ]}
              >
                {this.renderText()}
              </BrandText>
            </View>
          </View>
          <View style={[styles.containerSwipper]}>
            {data.length === 0 && (
              <View style={styles.containerEmptyQrCode}>
                <Image source={qrCodeEmpty} resizeMode="contain" />
              </View>
            )}
            {data.length > 0 && (
              <Swiper
                dot={
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: "rgba(255,255,255,.1)" }
                    ]}
                  />
                }
                activeDot={
                  <View style={[styles.dot, { backgroundColor: "#FFF" }]} />
                }
                dotStyle={styles.pagerDot}
                activeDotStyle={styles.pagerDot}
                horizontal
                paginationStyle={styles.pagination}
                loop
              >
                {data.length > 0 &&
                  data.map((item, index) => {
                    return (
                      <View style={styles.containerCard} key={index.toString()}>
                        <CardView
                          onPress={() => this.handlerScanCode(item)}
                          ticket={item.idQrcodeExternal}
                        />
                      </View>
                    );
                  })}
              </Swiper>
            )}
          </View>
        </View>
        <ScrollView scrollEventThrottle={16} style={{ flex: 1 }}>
          <View style={styles.containerContent}>
            <Button
              style={styles.buttonPurchase}
              sm
              onPress={this.add}
              textStyle={{ fontSize: 14 }}
            >
              COMPRAR BILHETE
            </Button>
            {isExtract && (
              <TouchableText
                textStyle={styles.titleExtract}
                onPress={this.handlerExtract}
              >
                {titleExtract}
              </TouchableText>
            )}
          </View>
          {isExtract && this.renderHeader()}
          {isExtract &&
            isLoadingExtract &&
            this.props.extract.data.length > 0 && (
              <ExtractList itemList={this.props.extract.data} />
            )}
        </ScrollView>
        {isFetching && <LoadMask />}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    listTicket: state.ticketUnitary,
    extract: state.ticketUnitaryExtract
  };
};

export const MyTicket = connect(mapStateToProps)(MyTicketView);
