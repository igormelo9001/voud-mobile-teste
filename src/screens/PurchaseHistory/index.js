// NPM imports
import React, { Component } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import Moment from "moment";

// VouD imports
import Header, { headerActionTypes } from "../../components/Header";
import Icon from "../../components/Icon";
import {
  fetchPurchaseList,
  viewPurchaseDetails,
  requestPurchaseListClear,
  paymentCardTypes
} from "../../redux/financial";
import TouchableNative from "../../components/TouchableNative";
import BrandText from "../../components/BrandText";
import SystemText from "../../components/SystemText";
import TouchableText from "../../components/TouchableText";
import RequestFeedback from "../../components/RequestFeedback";
import { formatCurrency } from "../../utils/parsers-formaters";
import PurchaseStatus from "./PurchaseStatus";
import { colors } from "../../styles";
import { routeNames } from "../../shared/route-names";
import { navigateToRoute } from "../../redux/nav";
import {
  isMobileProduct,
  isTransportCardProduct,
  getPurchaseStatusText,
  getPurchaseStatusTextScoo,
  isScoo,
  isFirstMeans,
  isQrCode
} from "../../utils/purchase-history";
import { getPurchaseListUI } from "../../redux/selectors";
import { getPaddingForNotch } from "../../utils/is-iphone-with-notch";
import { fetchPurchaseHistoricRide } from "../../flows/scooter/store/ducks/purchaseHistoricRide";

// Screen component
class PurchaseHistoryView extends Component {
  componentDidMount() {
    this._fetchPurchaseHistory();
  }

  componentWillUnmount() {
    this.props.dispatch(requestPurchaseListClear());
  }

  _close = () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.back());
  };

  _goToDetail = (purchaseId, productType, idCustomer) => {
    const { dispatch } = this.props;
    if (isScoo(productType))
      dispatch(fetchPurchaseHistoricRide(idCustomer, purchaseId));

    dispatch(viewPurchaseDetails(purchaseId));
    dispatch(navigateToRoute(routeNames.PURCHASE_HISTORY_DETAIL));
  };

  _getStatusCode = status => {
    switch (status) {
      case "ERROR":
      case "CANCELED":
        return 0;
      case "PROCESSING":
        return 1;
      case "PROCCESSED":
        return 3;
      case "PENDING":
        return 4;
    }
  };

  _fetchPurchaseHistory = () => {
    const { dispatch, customerId, page } = this.props;
    dispatch(fetchPurchaseList(customerId, page));
  };

  _loadMore = () => {
    const { dispatch, customerId, page } = this.props;
    dispatch(fetchPurchaseList(customerId, page));
  };

  _formatDate = date => {
    return Moment(date)
      .format("DD MMM")
      .toUpperCase();
  };

  _formatHour = date => {
    return Moment(date)
      .format("HH:mm")
      .toUpperCase();
  };

  _renderTitleRecharge = (productType, issuerType) => {
    if (isMobileProduct(productType)) {
      return "Recarga de Telefone";
    }
    if (isTransportCardProduct(productType) && !isQrCode(issuerType)) {
      return "Recarga Cartão de Transporte";
    }
    if (isScoo(productType)) {
      return "Corrida de Patinete";
    }
    if (isFirstMeans(productType)) {
      return "Solicitação 1.via cartão";
    }
    if (isQrCode(issuerType)) {
      return "Compra de Bilhete QrCode";
    }
    return "";
  };

  _renderStatusPayment = codeStatus => {
    switch (codeStatus) {
      case 0:
        return "Recarga não realizada";
      case 1:
        return "Processando pagamento";
      case 3:
        return "Pagamento confirmado";

      case 4:
        return "Pagamento não processado";

      default:
        return "";
    }
  };

  _renderColorStatusPayment = codeStatus => {
    switch (codeStatus) {
      case 0:
        return "#F94949";
      case 1:
        return "#FDC300";
      case 3:
        return "#5DDA74";

      default:
        return "#5DDA74";
    }
  };

  _renderTitleCard = (productType, issuerType, fullNumber) => {
    if (isMobileProduct(productType)) {
      const phoneNumberDDD = fullNumber.substring(2, 4);
      const phoneNumber = fullNumber.substring(4, fullNumber.length);
      return `Nº (${phoneNumberDDD}) ${phoneNumber} `;
    }

    if (isTransportCardProduct(productType) && !isQrCode(issuerType)) {
      return `Cartão: ${issuerType}`;
    }
    if (isScoo(productType)) {
      return "Voud Patinete";
    }
    if (isQrCode(issuerType)) {
      return "QRCODE";
    }

    return "";
  };

  render() {
    const { historyList, purchaseListUi, reachedEnd } = this.props;

    return (
      <View style={styles.container}>
        <Header
          title="Histórico de compras"
          left={{
            type: headerActionTypes.CLOSE,
            onPress: this._close
          }}
        />

        {/* ================ */}
        {/* REQUEST FEEDBACK */}
        {/* ================ */}
        {((purchaseListUi.isFetching && historyList.length === 0) ||
          historyList.length === 0 ||
          purchaseListUi.error !== "") && (
          <View style={styles.requestFeedbackContainer}>
            <RequestFeedback
              loadingMessage="Carregando histórico de compras..."
              errorMessage={purchaseListUi.error}
              emptyMessage="Não foi encontrado histórico de compras"
              retryMessage="Tentar novamente"
              isFetching={purchaseListUi.isFetching}
              onRetry={this._fetchPurchaseHistory}
            />
          </View>
        )}

        {/* =============== */}
        {/* === CONTENT === */}
        {/* =============== */}
        {purchaseListUi.error === "" && historyList && historyList.length > 0 && (
          <ScrollView>
            {historyList.map(history => {
              const statusCode = this._getStatusCode(history.status);
              const isDebit = history.type === paymentCardTypes.DEBIT;
              const productType = history.productType
                ? history.productType
                : "";

              let stateCodePayment = this._getStatusCode(history.status);
              if (
                (isFirstMeans(productType) && statusCode === 0) ||
                (isScoo(productType) && statusCode === 0) ||
                (isQrCode(history.issuerType) && statusCode === 0)
              ) {
                stateCodePayment = 4;
              }

              return (
                <TouchableNative
                  key={history.id}
                  style={styles.historyListContainer}
                  onPress={() =>
                    this._goToDetail(
                      history.id,
                      productType,
                      history.idCustomer
                    )
                  }
                >
                  <View style={styles.historyListStatus}>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                      <View style={[styles.historyListData]}>
                        {history.recurrent && (
                          <Icon
                            name="automatic-purchase"
                            style={styles.purchaseTypeIcon}
                          />
                        )}
                        {isMobileProduct(productType) && (
                          <Icon name="mobile" style={styles.purchaseTypeIcon} />
                        )}
                        {isScoo(productType) && (
                          <Icon
                            name="scooter"
                            style={styles.purchaseTypeIcon}
                          />
                        )}
                        {isTransportCardProduct(productType) &&
                          !isQrCode(history.issuerType) && (
                            <Icon
                              name="bom-card"
                              style={styles.purchaseTypeIcon}
                            />
                          )}
                        {isFirstMeans(productType) && (
                          <Icon
                            name="bom-card"
                            style={styles.purchaseTypeIcon}
                          />
                        )}

                        {isQrCode(history.issuerType) && (
                          <Icon
                            name="qrcode-historico"
                            style={styles.purchaseTypeIcon}
                          />
                        )}
                      </View>
                      <View style={{ justifyContent: "center" }}>
                        <SystemText style={styles.textDate}>
                          {this._formatDate(history.transactionDate)}{" "}
                          {`(${this._formatHour(history.transactionDate)})`}
                        </SystemText>
                        <SystemText style={styles.textTitleRecharge}>
                          {this._renderTitleRecharge(
                            history.productType,
                            history.issuerType
                          )}
                        </SystemText>
                        <SystemText
                          style={StyleSheet.flatten([
                            styles.titleStatusPayment,
                            {
                              color: this._renderColorStatusPayment(statusCode)
                            }
                          ])}
                        >
                          {this._renderStatusPayment(stateCodePayment)}
                        </SystemText>
                        <SystemText style={styles.titleCardNumber}>
                          {this._renderTitleCard(
                            history.productType,
                            history.issuerType,
                            history.fullNumber
                          )}
                        </SystemText>
                      </View>
                      <View style={styles.containerValue}>
                        <SystemText style={styles.titleValue}>
                          R$ {formatCurrency(history.transactionValue)}
                        </SystemText>
                      </View>
                    </View>
                  </View>
                  <Icon
                    name="arrow-forward-thin"
                    style={styles.iconArrowForward}
                  />
                </TouchableNative>
              );
            })}

            {/* =============== */}
            {/* == LOAD MORE == */}
            {/* =============== */}
            {!reachedEnd && !purchaseListUi.isFetching && (
              <TouchableText
                onPress={this._loadMore}
                style={styles.nextPageButton}
              >
                Carregar mais
              </TouchableText>
            )}

            {purchaseListUi.isFetching && (
              <BrandText style={styles.loadingText}>Carregando...</BrandText>
            )}
          </ScrollView>
        )}
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: getPaddingForNotch()
  },
  historyListContainer: {
    flexDirection: "row",
    // padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_LIGHTER
  },
  historyListStatus: {
    flex: 1
    // padding: 16,
    // paddingLeft: 0,
    // borderRadius: 2
  },
  historyListStatusText: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
    color: colors.GRAY_DARKER,
    textAlign: "center"
  },
  historyListStatusTextCanceled: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.GRAY,
    textAlign: "center"
  },
  historyListData: {
    // flex: 1,
    // justifyContent: 'center',
    marginLeft: 16,
    marginTop: 36
  },
  historyListValueContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  purchaseTypeIcon: {
    marginRight: 8,
    fontSize: 24,
    color: "#F39200"
  },
  historyListValueText: {
    fontSize: 20,
    lineHeight: 24,
    color: colors.BRAND_PRIMARY
  },
  historyListValueTextCanceled: {
    fontSize: 20,
    lineHeight: 24,
    textDecorationLine: "line-through",
    color: colors.GRAY_LIGHT
  },
  historyListDateText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: colors.GRAY
  },
  historyListCard: {
    justifyContent: "center"
  },
  nextPageButton: {
    marginVertical: 24,
    marginHorizontal: 16
  },
  requestFeedbackContainer: {
    flex: 1,
    justifyContent: "center"
  },
  loadingText: {
    height: 32,
    marginVertical: 24,
    fontSize: 14,
    textAlign: "center",
    color: colors.BRAND_PRIMARY
  },
  iconArrowForward: {
    fontSize: 32,
    // marginLeft: 16,
    // color: colors.BRAND_PRIMARY,
    // alignSelf: 'center',
    color: "#ACACAC",
    marginTop: 28
  },
  textDate: {
    fontSize: 14,
    lineHeight: 16,
    color: "#ACACAC",
    marginTop: 16
  },
  textTitleRecharge: {
    fontSize: 14,
    lineHeight: 16,
    color: "#000000",
    fontWeight: "bold",
    marginTop: 8
  },
  titleValue: {
    fontSize: 14,
    lineHeight: 16,
    color: "#000000"
  },
  titleStatusPayment: {
    fontSize: 12,
    lineHeight: 14,
    color: "#5DDA74",
    marginTop: 4
  },
  titleCardNumber: {
    fontSize: 14,
    lineHeight: 16,
    color: "#727272",
    marginTop: 4,
    marginBottom: 17
  },
  containerValue: {
    flex: 1,
    alignItems: "flex-end",
    marginTop: 40
  }
});

function mapStateToProps(state) {
  return {
    page: state.financial.purchaseList.page,
    purchaseListUi: getPurchaseListUI(state),
    reachedEnd: state.financial.purchaseList.reachedEnd,
    historyList: state.financial.purchaseList.data,
    customerId: state.profile.data.id
  };
}

export const PurchaseHistory = connect(mapStateToProps)(PurchaseHistoryView);

export * from "./PurchaseHistoryDetail";
