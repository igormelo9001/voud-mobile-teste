// NPM imports
import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import { View, ScrollView, StyleSheet, Image, Platform } from "react-native";
import { connect } from "react-redux";
import Moment from "moment";

// VouD imports
import _ from "lodash";
import Header, { headerActionTypes } from "../../components/Header";
import BrandText from "../../components/BrandText";
import SystemText from "../../components/SystemText";
import RequestFeedback from "../../components/RequestFeedback";
import Icon from "../../components/Icon";
import PurchaseStatus from "./PurchaseStatus";

import { colors } from "../../styles";
import {
  getPurchaseHistoryTransportCard,
  getPurchaseHistoryDetail,
  getPurchaseListUI
} from "../../redux/selectors";
import { fetchPurchaseList, paymentCardTypes } from "../../redux/financial";
import { issuerTypes } from "../../redux/transport-card";
import ScooReceipt from "../../flows/scooter/components/ScooReceipt";

import {
  generateDisplayMask,
  getLogoForBrand,
  getPaymentMethodName,
  formatPaymentMethodName
} from "../../utils/payment-card";

import {
  getBUCreditTypeLabel,
  getBUPeriodTypeLabel,
  getBUTransportTypeLabel,
  buCreditTypeLabels
} from "../../utils/transport-card";
import {
  formatCurrency,
  formatCnpj,
  formatBomCardNumber
} from "../../utils/parsers-formaters";
import TransportCardSm from "../../components/TransportCardSm";
import {
  isMobileProduct,
  isTransportCardProduct,
  getPurchaseStatusText,
  acquirerNames,
  isScoo,
  getPurchaseStatusTextScoo,
  isFirstMeans,
  getPurchaseStatusTextFirstMeans,
  isQrCode,
  getPurchaseStatusTextQrCode
} from "../../utils/purchase-history";
import { getPaddingForNotch } from "../../utils/is-iphone-with-notch";

const cieloLogo = require("../../images/logo-cielo.png");
const adyenLogo = require("../../images/logo-adyen.png");

// Screen component
class PurchaseHistoryDetailView extends Component {
  componentDidMount() {
    const {
      navigation: {
        state: {
          params: { refreshPurchaseList }
        }
      }
    } = this.props;

    if (refreshPurchaseList) this._fetchPurchaseList();
  }

  _fetchPurchaseList = () => {
    const { dispatch, customerId } = this.props;
    dispatch(fetchPurchaseList(customerId, 0));
  };

  _back = () => {
    this.props.dispatch(NavigationActions.back());
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

  _getCanceledInfoText = () => {
    const { purchaseDetail } = this.props;
    return `Fique tranquilo: ${
      purchaseDetail && purchaseDetail.type === paymentCardTypes.DEBIT
        ? "o valor debitado em sua conta será estornado de acordo com seu banco e poderá levar até 5 dias úteis. Em caso de dúvida, entre em contato com seu banco."
        : "Caso o valor tenha sido descontado do seu cartão, o estorno ocorrerá automaticamente, o prazo varia de acordo com o seu banco."
    }`;
  };

  _getCanceledInfoTextScoo = () => {
    return `Entre em contato com atendimento`;
  };

  _renderTransactionStatus = () => {
    const { purchaseDetail } = this.props;

    const status =
      purchaseDetail && purchaseDetail.status ? purchaseDetail.status : "";
    const statusCode = this._getStatusCode(status);
    const newStatusCode = statusCode === 4 ? 0 : statusCode;
    const isDebit =
      purchaseDetail && purchaseDetail.type === paymentCardTypes.DEBIT;
    const productType =
      purchaseDetail && purchaseDetail.productType
        ? purchaseDetail.productType
        : "";
    const transportCardStatusLabels = [
      isDebit ? "Aguardando confirmação" : "Pagamento processado",
      "Pagamento confirmado",
      "Carga liberada"
    ];

    return (
      <View>
        <BrandText style={styles.sectionLabel}>Status</BrandText>
        {statusCode > 0 && (
          <View style={styles.statusPointsContainer}>
            {isMobileProduct(productType) && (
              <PurchaseStatus
                maxStatus={1}
                currentStatus={statusCode}
                labels={[
                  getPurchaseStatusText(
                    status,
                    isDebit,
                    isMobileProduct(productType)
                  )
                ]}
              />
            )}
            {isTransportCardProduct(productType) &&
              !isQrCode(purchaseDetail.issuerType) && (
                <PurchaseStatus
                  maxStatus={3}
                  currentStatus={statusCode}
                  labels={transportCardStatusLabels}
                />
              )}
            {isScoo(productType) && (
              <PurchaseStatus
                maxStatus={1}
                currentStatus={newStatusCode}
                labels={[getPurchaseStatusTextScoo(status)]}
              />
            )}
            {isFirstMeans(productType) && (
              <PurchaseStatus
                maxStatus={1}
                currentStatus={statusCode}
                labels={[getPurchaseStatusTextFirstMeans(status)]}
              />
            )}
            {isQrCode(purchaseDetail.issuerType) && (
              <PurchaseStatus
                maxStatus={1}
                currentStatus={newStatusCode}
                labels={[getPurchaseStatusTextQrCode(status)]}
              />
            )}
          </View>
        )}
        {statusCode === 0 && (
          <View style={styles.canceledStatusContainer}>
            <View style={styles.canceledStatusBox}>
              <BrandText style={styles.canceledLabel}>
                {isMobileProduct(productType)
                  ? "Recarga não realizada"
                  : isScoo(productType) ||
                    isFirstMeans(productType) ||
                    isQrCode(purchaseDetail.issuerType)
                  ? "Pagamento não processado"
                  : "Carga não realizada"}
              </BrandText>
            </View>
            <BrandText style={styles.canceledInfoLabel}>
              {isScoo(productType)
                ? this._getCanceledInfoTextScoo()
                : this._getCanceledInfoText()}
            </BrandText>
          </View>
        )}
      </View>
    );
  };

  _renderAcquirerLogo = acquirer =>
    acquirer ? (
      <Image
        style={styles.paymentLogo}
        source={acquirer === acquirerNames.CIELO ? cieloLogo : adyenLogo}
      />
    ) : null;

  _getTotal() {
    // const { purchaseDetail } = this.props;
    // return purchaseDetail.transactionValue - purchaseDetail.discountValue;

    const { purchaseDetail } = this.props;
    const valueTotal = purchaseDetail.discountValue
      ? purchaseDetail.transactionValue - purchaseDetail.discountValue
      : purchaseDetail.transactionValue;
    return valueTotal;
  }

  // _renderCreditPurchaseDetails = () => {
  //   const { purchaseDetail, purchaseHistoryTransportCard } = this.props;
  //   const statusCode = this._getStatusCode(
  //     purchaseDetail ? purchaseDetail.status : null
  //   );
  //   const isBu = purchaseDetail
  //     ? purchaseDetail.issuerType === issuerTypes.BU
  //     : false;
  //   const applicationId =
  //     purchaseDetail &&
  //     purchaseDetail.transportCard &&
  //     purchaseDetail.transportCard.wallets &&
  //     purchaseDetail.transportCard.wallets[0]
  //       ? purchaseDetail.transportCard.wallets[0].applicationId
  //       : null;
  //   let buCreditTypeLabel =
  //     isBu && applicationId ? getBUCreditTypeLabel(applicationId) : "";
  //   if (buCreditTypeLabel === buCreditTypeLabels.TEMPORAL) {
  //     buCreditTypeLabel = `${getBUPeriodTypeLabel(
  //       applicationId
  //     )} ${getBUTransportTypeLabel(applicationId)}`;
  //   }
  //   const cardFlag =
  //     purchaseDetail && purchaseDetail.brand ? purchaseDetail.brand : "";
  //   const transportCardNumber =
  //     purchaseDetail &&
  //     purchaseDetail.transportCard &&
  //     purchaseDetail.transportCard.cardNumber
  //       ? purchaseDetail.transportCard.cardNumber
  //       : "";
  //   const acquirer =
  //     purchaseDetail && purchaseDetail.acquirer ? purchaseDetail.acquirer : "";

  //   let textTransportCard = isBu ? "Bilhete Único" : "Cartão BOM";

  //   if (purchaseDetail.issuerType === "QRCODE") {
  //     textTransportCard = "Bilhete QrCode";
  //   }

  //   return (
  //     <View>
  //       {statusCode === 3 && (
  //         <View>
  //           <BrandText style={styles.sectionLabel}>
  //             Comprovante de pagamento
  //           </BrandText>
  //           <View style={styles.paymentInfoContaier}>
  //             {this._renderAcquirerLogo(acquirer)}
  //             <BrandText style={styles.paymentInfoLabelMargin}>
  //               {purchaseDetail.merchantName}
  //             </BrandText>
  //             <BrandText style={styles.paymentInfoLabel}>
  //               CNPJ {formatCnpj(purchaseDetail.merchantDocument)}
  //             </BrandText>
  //             <BrandText style={styles.paymentInfoLabel}>
  //               {purchaseDetail.merchantCity}/{purchaseDetail.merchantState}
  //             </BrandText>
  //             <BrandText style={styles.paymentInfoLabelMargin}>
  //               {getPaymentMethodName(purchaseDetail.brand)} -{" "}
  //               {purchaseDetail.transactionTypeDescription}
  //             </BrandText>
  //             <BrandText style={styles.paymentInfoLabel}>
  //               {generateDisplayMask(
  //                 purchaseDetail.brand,
  //                 purchaseDetail.cardNumber
  //               )}
  //             </BrandText>
  //           </View>
  //           <View style={styles.paymentDetailsContaier}>
  //             <View style={styles.detailInfoContainer}>
  //               <BrandText style={styles.detailInfoLabel}>Valor</BrandText>
  //               <SystemText style={styles.detailInfoValue}>
  //                 R$ {formatCurrency(purchaseDetail.transactionValue)}
  //               </SystemText>
  //             </View>
  //             <View style={styles.detailInfoContainer}>
  //               <BrandText style={styles.detailInfoLabel}>
  //                 Data e Hora
  //               </BrandText>
  //               <SystemText style={styles.detailInfoValue}>
  //                 {Moment(purchaseDetail.transactionDate).format(
  //                   "DD/MM/YYYY, HH:mm"
  //                 )}
  //               </SystemText>
  //             </View>
  //             <View style={styles.detailInfoContainer}>
  //               <BrandText style={styles.detailInfoLabel}>TID</BrandText>
  //               <SystemText style={styles.detailInfoValue}>
  //                 {purchaseDetail.acquirerTransactionId}
  //               </SystemText>
  //             </View>
  //           </View>
  //         </View>
  //       )}
  //       <View>
  //         <BrandText style={styles.sectionLabel}>Detalhes</BrandText>
  //         {purchaseHistoryTransportCard && (
  //           <TransportCardSm
  //             style={styles.transportCard}
  //             cardName={purchaseHistoryTransportCard.nick}
  //             cardNumber={purchaseHistoryTransportCard.cardNumber}
  //             layoutType={purchaseHistoryTransportCard.layoutType}
  //           />
  //         )}
  //         {!purchaseHistoryTransportCard && (
  //           <View style={styles.detailInfoContainer}>
  //             <BrandText style={styles.detailInfoLabel}>
  //               {textTransportCard}
  //             </BrandText>
  //             <SystemText style={styles.detailInfoValue}>
  //               {isBu
  //                 ? transportCardNumber
  //                 : formatBomCardNumber(transportCardNumber)}
  //             </SystemText>
  //           </View>
  //         )}
  //         <View style={styles.detailInfoContainer}>
  //           <BrandText style={styles.detailInfoLabel}>
  //             Data de solicitação
  //           </BrandText>
  //           <SystemText style={styles.detailInfoValue}>
  //             {Moment(purchaseDetail.createdDate).format("DD/MM/YYYY, HH:mm")}
  //           </SystemText>
  //         </View>
  //         {isBu && (
  //           <View style={styles.detailInfoContainer}>
  //             <BrandText style={styles.detailInfoLabel}>
  //               Tipo do crédito
  //             </BrandText>
  //             <SystemText style={styles.detailInfoValue}>
  //               {buCreditTypeLabel}
  //             </SystemText>
  //           </View>
  //         )}
  //         {purchaseDetail.productQuantity > 0 && (
  //           <View style={styles.detailInfoContainer}>
  //             <BrandText style={styles.detailInfoLabel}>
  //               Quantidade de cotas
  //             </BrandText>
  //             <SystemText style={styles.detailInfoValue}>
  //               {purchaseDetail.productQuantity}
  //             </SystemText>
  //           </View>
  //         )}
  //         <View style={styles.detailInfoContainer}>
  //           <BrandText style={styles.detailInfoLabel}>
  //             Valor do crédito
  //           </BrandText>
  //           <SystemText
  //             style={
  //               statusCode > 0
  //                 ? styles.detailInfoValue
  //                 : styles.detailInfoValueCanceled
  //             }
  //           >
  //             R$ {formatCurrency(purchaseDetail.rechargeValue)}
  //           </SystemText>
  //         </View>
  //         <View style={styles.detailInfoContainer}>
  //           <BrandText style={styles.detailInfoLabel}>Tarifa</BrandText>
  //           <SystemText
  //             style={
  //               statusCode > 0
  //                 ? styles.detailInfoValue
  //                 : styles.detailInfoValueCanceled
  //             }
  //           >
  //             R$ {formatCurrency(purchaseDetail.serviceValue)}
  //           </SystemText>
  //         </View>

  //         <View style={styles.detailInfoContainer}>
  //           <BrandText style={styles.detailInfoLabel}>Desconto</BrandText>
  //           <SystemText
  //             style={
  //               statusCode > 0
  //                 ? styles.detailInfoValue
  //                 : styles.detailInfoValueCanceled
  //             }
  //           >
  //             R$ {formatCurrency(purchaseDetail.discountValue)}
  //           </SystemText>
  //         </View>

  //         <View style={styles.detailInfoContainer}>
  //           <BrandText style={styles.detailInfoLabelBold}>
  //             Valor total
  //           </BrandText>
  //           <SystemText
  //             style={
  //               statusCode > 0
  //                 ? styles.detailInfoValueBold
  //                 : styles.detailInfoValueBoldCanceled
  //             }
  //           >
  //             R$ {formatCurrency(this._getTotal())}
  //           </SystemText>
  //         </View>
  //         <View style={styles.creditCardInfoContainer}>
  //           <View style={styles.creditCardInfo}>
  //             <BrandText style={styles.creditCardInfoValue}>
  //               {formatPaymentMethodName(cardFlag, purchaseDetail.cardNumber)}
  //             </BrandText>
  //             <BrandText style={styles.creditCardInfoLabel}>
  //               Forma de pagamento
  //             </BrandText>
  //           </View>
  //           <Image
  //             style={styles.creditCardInfoImage}
  //             source={getLogoForBrand(cardFlag.toLowerCase())}
  //           />
  //         </View>
  //       </View>
  //       {purchaseDetail.recurrent && (
  //         <View style={styles.recurrentIndicator}>
  //           <Icon name="automatic-purchase" style={styles.recurrentIcon} />
  //           <BrandText style={styles.recurrentText}>
  //             Esta foi uma compra programada
  //           </BrandText>
  //         </View>
  //       )}
  //     </View>
  //   );
  // };

  renderFirstMeans = () => {
    const { purchaseDetail } = this.props;

    const statusCode = this._getStatusCode(
      purchaseDetail ? purchaseDetail.status : null
    );

    const cardFlag =
      purchaseDetail && purchaseDetail.brand ? purchaseDetail.brand : "";
    const acquirer =
      purchaseDetail && purchaseDetail.acquirer ? purchaseDetail.acquirer : "";

    return (
      <View>
        {statusCode === 3 && (
          <View>
            <BrandText style={styles.sectionLabel}>
              Comprovante de pagamento
            </BrandText>
            <View style={styles.paymentInfoContaier}>
              {this._renderAcquirerLogo(acquirer)}
              <BrandText style={styles.paymentInfoLabelMargin}>
                {purchaseDetail.merchantName}
              </BrandText>
              <BrandText style={styles.paymentInfoLabel}>
                CNPJ {formatCnpj(purchaseDetail.merchantDocument)}
              </BrandText>
              <BrandText style={styles.paymentInfoLabel}>
                {purchaseDetail.merchantCity}/{purchaseDetail.merchantState}
              </BrandText>
              <BrandText style={styles.paymentInfoLabelMargin}>
                {getPaymentMethodName(purchaseDetail.brand)} -{" "}
                {purchaseDetail.transactionTypeDescription}
              </BrandText>
              <BrandText style={styles.paymentInfoLabel}>
                {generateDisplayMask(
                  purchaseDetail.brand,
                  purchaseDetail.cardNumber
                )}
              </BrandText>
            </View>
            <View style={styles.paymentDetailsContaier}>
              <View style={styles.detailInfoContainer}>
                <BrandText style={styles.detailInfoLabel}>Valor</BrandText>
                <SystemText style={styles.detailInfoValue}>
                  R$ {formatCurrency(purchaseDetail.transactionValue)}
                </SystemText>
              </View>
              <View style={styles.detailInfoContainer}>
                <BrandText style={styles.detailInfoLabel}>
                  Data e Hora
                </BrandText>
                <SystemText style={styles.detailInfoValue}>
                  {Moment(purchaseDetail.transactionDate).format(
                    "DD/MM/YYYY, HH:mm"
                  )}
                </SystemText>
              </View>
              <View style={styles.detailInfoContainer}>
                <BrandText style={styles.detailInfoLabel}>TID</BrandText>
                <SystemText style={styles.detailInfoValue}>
                  {purchaseDetail.acquirerTransactionId}
                </SystemText>
              </View>
            </View>
          </View>
        )}
        <View>
          <BrandText style={styles.sectionLabel}>Detalhes</BrandText>
          <View
            style={{
              marginTop: 8,
              justifyContent: "space-between",
              flexDirection: "row",
              marginHorizontal: 16,
              padding: 8
            }}
          >
            <BrandText style={styles.detailInfoLabel}>
              Data de solicitação
            </BrandText>
            <SystemText style={styles.detailInfoValue}>
              {Moment(purchaseDetail.createdDate).format("DD/MM/YYYY, HH:mm")}
            </SystemText>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginHorizontal: 16,
              padding: 8
            }}
          >
            <BrandText
              style={{
                marginVertical: 2,
                fontSize: 14,
                lineHeight: 16,
                textAlign: "left",
                color: colors.GRAY_DARKER
              }}
            >
              Tarifa entrega em domicílio
            </BrandText>
            <SystemText
              style={
                statusCode > 0
                  ? styles.detailInfoValue
                  : styles.detailInfoValueCanceled
              }
            >
              R$ {formatCurrency(this._getTotal())}
            </SystemText>
          </View>

          <View
            style={{
              marginTop: 8,
              justifyContent: "space-between",
              flexDirection: "row",
              marginHorizontal: 16,
              padding: 8
            }}
          >
            <BrandText style={styles.detailInfoLabelBold}>
              Valor total
            </BrandText>
            <SystemText
              style={
                statusCode > 0
                  ? styles.detailInfoValueBold
                  : styles.detailInfoValueBoldCanceled
              }
            >
              R$ {formatCurrency(this._getTotal())}
            </SystemText>
          </View>
          <View style={styles.creditCardInfoContainer}>
            <View style={styles.creditCardInfo}>
              <BrandText style={styles.creditCardInfoValue}>
                {formatPaymentMethodName(cardFlag, purchaseDetail.cardNumber)}
              </BrandText>
              <BrandText style={styles.creditCardInfoLabel}>
                Forma de pagamento
              </BrandText>
            </View>
            <Image
              style={styles.creditCardInfoImage}
              source={getLogoForBrand(cardFlag.toLowerCase())}
            />
          </View>
        </View>
        {purchaseDetail.recurrent && (
          <View style={styles.recurrentIndicator}>
            <Icon name="automatic-purchase" style={styles.recurrentIcon} />
            <BrandText style={styles.recurrentText}>
              Esta foi uma compra programada
            </BrandText>
          </View>
        )}
      </View>
    );
  };

  _renderAcquirerLogo = acquirer =>
    acquirer ? (
      <Image
        style={styles.paymentLogo}
        source={acquirer === acquirerNames.CIELO ? cieloLogo : adyenLogo}
      />
    ) : null;

  _getTotal() {
    // const { purchaseDetail } = this.props;
    // return purchaseDetail.transactionValue - purchaseDetail.discountValue;

    const { purchaseDetail } = this.props;
    const valueTotal = purchaseDetail.discountValue
      ? purchaseDetail.transactionValue - purchaseDetail.discountValue
      : purchaseDetail.transactionValue;
    return valueTotal;
  }

  _renderCreditPurchaseDetails = () => {
    const {
      purchaseDetail,
      purchaseHistoryTransportCard,
      cardData
    } = this.props;

    const statusCode = this._getStatusCode(
      purchaseDetail ? purchaseDetail.status : null
    );
    const isBu = purchaseDetail
      ? purchaseDetail.issuerType === issuerTypes.BU
      : false;
    const applicationId =
      purchaseDetail &&
      purchaseDetail.transportCard &&
      purchaseDetail.transportCard.wallets &&
      purchaseDetail.transportCard.wallets[0]
        ? purchaseDetail.transportCard.wallets[0].applicationId
        : null;
    let buCreditTypeLabel =
      isBu && applicationId ? getBUCreditTypeLabel(applicationId) : "";
    if (buCreditTypeLabel === buCreditTypeLabels.TEMPORAL) {
      buCreditTypeLabel = `${getBUPeriodTypeLabel(
        applicationId,
        cardData.activeMonth
      )} ${getBUTransportTypeLabel(applicationId)}`;
    }
    const cardFlag =
      purchaseDetail && purchaseDetail.brand ? purchaseDetail.brand : "";
    const transportCardNumber =
      purchaseDetail &&
      purchaseDetail.transportCard &&
      purchaseDetail.transportCard.cardNumber
        ? purchaseDetail.transportCard.cardNumber
        : "";
    const acquirer =
      purchaseDetail && purchaseDetail.acquirer ? purchaseDetail.acquirer : "";
    let textTransportCard = isBu ? "Bilhete Único" : "Cartão BOM";

    if (purchaseDetail.issuerType === "QRCODE") {
      textTransportCard = "";
      // const dateExpiration = Moment(purchaseDetail.validateQrcode).diff(Moment(), "days");
    }

    return (
      <View>
        {statusCode === 3 && (
          <View>
            <BrandText style={styles.sectionLabel}>
              Comprovante de pagamento
            </BrandText>
            <View style={styles.paymentInfoContaier}>
              {this._renderAcquirerLogo(acquirer)}
              <BrandText style={styles.paymentInfoLabelMargin}>
                {purchaseDetail.merchantName}
              </BrandText>
              <BrandText style={styles.paymentInfoLabel}>
                CNPJ {formatCnpj(purchaseDetail.merchantDocument)}
              </BrandText>
              <BrandText style={styles.paymentInfoLabel}>
                {purchaseDetail.merchantCity}/{purchaseDetail.merchantState}
              </BrandText>
              <BrandText style={styles.paymentInfoLabelMargin}>
                {getPaymentMethodName(purchaseDetail.brand)} -{" "}
                {purchaseDetail.transactionTypeDescription}
              </BrandText>
              <BrandText style={styles.paymentInfoLabel}>
                {generateDisplayMask(
                  purchaseDetail.brand,
                  purchaseDetail.cardNumber
                )}
              </BrandText>
            </View>
            <View style={styles.paymentDetailsContaier}>
              <View style={styles.detailInfoContainer}>
                <BrandText style={styles.detailInfoLabel}>Valor</BrandText>
                <SystemText style={styles.detailInfoValue}>
                  R$ {formatCurrency(this._getTotal())}
                </SystemText>
              </View>
              <View style={styles.detailInfoContainer}>
                <BrandText style={styles.detailInfoLabel}>
                  Data e Hora
                </BrandText>
                <SystemText style={styles.detailInfoValue}>
                  {Moment(purchaseDetail.transactionDate).format(
                    "DD/MM/YYYY, HH:mm"
                  )}
                </SystemText>
              </View>
              <View style={styles.detailInfoContainer}>
                <BrandText style={styles.detailInfoLabel}>TID</BrandText>
                <SystemText style={styles.detailInfoValue}>
                  {purchaseDetail.acquirerTransactionId}
                </SystemText>
              </View>
            </View>
          </View>
        )}
        {purchaseDetail.issuerType === "QRCODE" && (
          <View>
            <BrandText style={styles.sectionLabel}>Detalhes QrCode</BrandText>
            <View style={styles.detailInfoContainer}>
              <BrandText
                style={[styles.detailInfoLabelBold, { fontWeight: "normal" }]}
              >
                Ticket
              </BrandText>
              <SystemText
                style={[styles.detailInfoValueBold, { fontWeight: "normal" }]}
              >
                {purchaseDetail.idQrcodeExternalQrcode}
              </SystemText>
            </View>
            <View style={styles.detailInfoContainer}>
              <BrandText
                style={[styles.detailInfoLabelBold, { fontWeight: "normal" }]}
              >
                Transação
              </BrandText>
              <SystemText
                style={[styles.detailInfoValueBold, { fontWeight: "normal" }]}
              >
                {purchaseDetail.idTransactionExternalQrcode}
              </SystemText>
            </View>
            {/* <View style={styles.detailInfoContainer}>
              <BrandText
                style={[styles.detailInfoLabelBold, { fontWeight: "normal" }]}
              >
                Validade
              </BrandText>
              <SystemText
                style={[styles.detailInfoValueBold, { fontWeight: "normal" }]}
              >
                {Moment(purchaseDetail.validateQrcode).format("DD/MM/YYYY")}
              </SystemText>
            </View> */}
          </View>
        )}
        <View>
          <BrandText style={styles.sectionLabel}>Detalhes transação</BrandText>
          {purchaseHistoryTransportCard && (
            <TransportCardSm
              style={styles.transportCard}
              cardName={purchaseHistoryTransportCard.nick}
              cardNumber={purchaseHistoryTransportCard.cardNumber}
              layoutType={purchaseHistoryTransportCard.layoutType}
            />
          )}
          {!purchaseHistoryTransportCard && (
            <View style={styles.detailInfoContainer}>
              <BrandText style={styles.detailInfoLabel}>
                {textTransportCard}
              </BrandText>
              <SystemText style={styles.detailInfoValue}>
                {isBu
                  ? transportCardNumber
                  : formatBomCardNumber(transportCardNumber)}
              </SystemText>
            </View>
          )}
          <View style={styles.detailInfoContainer}>
            <BrandText style={styles.detailInfoLabel}>
              Data de solicitação
            </BrandText>
            <SystemText style={styles.detailInfoValue}>
              {Moment(purchaseDetail.createdDate).format("DD/MM/YYYY, HH:mm")}
            </SystemText>
          </View>
          {isBu && (
            <View style={styles.detailInfoContainer}>
              <BrandText style={styles.detailInfoLabel}>
                Tipo do crédito
              </BrandText>
              <SystemText style={styles.detailInfoValue}>
                {buCreditTypeLabel}
              </SystemText>
            </View>
          )}
          {purchaseDetail.productQuantity > 0 && (
            <View style={styles.detailInfoContainer}>
              <BrandText style={styles.detailInfoLabel}>
                Quantidade de cotas
              </BrandText>
              <SystemText style={styles.detailInfoValue}>
                {purchaseDetail.productQuantity}
              </SystemText>
            </View>
          )}
          <View style={styles.detailInfoContainer}>
            <BrandText style={styles.detailInfoLabel}>
              Valor do crédito
            </BrandText>
            <SystemText
              style={
                statusCode > 0
                  ? styles.detailInfoValue
                  : styles.detailInfoValueCanceled
              }
            >
              R$ {formatCurrency(purchaseDetail.rechargeValue)}
            </SystemText>
          </View>
          <View style={styles.detailInfoContainer}>
            <BrandText style={styles.detailInfoLabel}>Tarifa</BrandText>
            <SystemText
              style={
                statusCode > 0
                  ? styles.detailInfoValue
                  : styles.detailInfoValueCanceled
              }
            >
              R$ {formatCurrency(purchaseDetail.serviceValue)}
            </SystemText>
          </View>

          <View style={styles.detailInfoContainer}>
            <BrandText style={styles.detailInfoLabel}>Desconto</BrandText>
            <SystemText
              style={
                statusCode > 0
                  ? styles.detailInfoValue
                  : styles.detailInfoValueCanceled
              }
            >
              R$ {formatCurrency(purchaseDetail.discountValue)}
            </SystemText>
          </View>

          <View style={styles.detailInfoContainer}>
            <BrandText style={styles.detailInfoLabelBold}>
              Valor total
            </BrandText>
            <SystemText
              style={
                statusCode > 0
                  ? styles.detailInfoValueBold
                  : styles.detailInfoValueBoldCanceled
              }
            >
              R$ {formatCurrency(this._getTotal())}
            </SystemText>
          </View>
          <View style={styles.creditCardInfoContainer}>
            <View style={styles.creditCardInfo}>
              <BrandText style={styles.creditCardInfoValue}>
                {formatPaymentMethodName(cardFlag, purchaseDetail.cardNumber)}
              </BrandText>
              <BrandText style={styles.creditCardInfoLabel}>
                Forma de pagamento
              </BrandText>
            </View>
            <Image
              style={styles.creditCardInfoImage}
              source={getLogoForBrand(cardFlag.toLowerCase())}
            />
          </View>
        </View>

        {purchaseDetail.recurrent && (
          <View style={styles.recurrentIndicator}>
            <Icon name="automatic-purchase" style={styles.recurrentIcon} />
            <BrandText style={styles.recurrentText}>
              Esta foi uma compra programada
            </BrandText>
          </View>
        )}
      </View>
    );
  };

  _renderPhoneRechargeDetails = () => {
    const { purchaseDetail } = this.props;
    const statusCode = this._getStatusCode(
      purchaseDetail ? purchaseDetail.status : null
    );
    const acquirer =
      purchaseDetail && purchaseDetail.acquirer ? purchaseDetail.acquirer : "";
    return (
      <View>
        {statusCode === 3 && (
          <View style={styles.rechargeReceipt}>
            {purchaseDetail.rechargeReceipt && (
              <SystemText style={styles.rechargeReceiptText}>
                {purchaseDetail.rechargeReceipt.receiptCustomer}
              </SystemText>
            )}
          </View>
        )}
        <View style={styles.receiptDetails}>
          {this._renderAcquirerLogo(acquirer)}
          <View style={styles.receiptCompanyInfo}>
            <BrandText style={styles.receiptCompanyInfoText}>
              {purchaseDetail.merchantName} {"\n"}
              CNPJ {formatCnpj(purchaseDetail.merchantDocument)} {"\n"}
              {purchaseDetail.merchantCity}/{purchaseDetail.merchantState}
            </BrandText>
          </View>
          <BrandText style={styles.receiptCompanyInfoText}>
            {getPaymentMethodName(purchaseDetail.brand)} -{" "}
            {purchaseDetail.transactionTypeDescription}
          </BrandText>
          <BrandText style={styles.receiptCompanyInfoText}>
            {generateDisplayMask(
              purchaseDetail.brand,
              purchaseDetail.cardNumber
            )}
          </BrandText>
        </View>
      </View>
    );
  };

  _renderPursacheHistoric = () => {
    const { purchaseDetail } = this.props;

    const statusCode = this._getStatusCode(
      purchaseDetail ? purchaseDetail.status : null
    );
    const cardFlag =
      purchaseDetail && purchaseDetail.brand ? purchaseDetail.brand : "";

    return (
      <View style={{ flex: 1, marginVertical: 10, marginHorizontal: 16 }}>
        <BrandText style={styles.detailInfoLabel}>
          Data de solicitação
        </BrandText>
        <SystemText style={styles.detailInfoValue}>
          {Moment(purchaseDetail.createdDate).format("DD/MM/YYYY, HH:mm")}
        </SystemText>
        <View>
          <BrandText style={styles.detailInfoLabel}>Valor</BrandText>
          <SystemText
            style={
              statusCode > 0
                ? styles.detailInfoValue
                : styles.detailInfoValueCanceled
            }
          >
            R$ {formatCurrency(purchaseDetail.rechargeValue)}
          </SystemText>
        </View>
        <View>
          <BrandText style={styles.detailInfoLabelBold}>Valor total</BrandText>
          <SystemText
            style={
              statusCode > 0
                ? styles.detailInfoValueBold
                : styles.detailInfoValueBoldCanceled
            }
          >
            R$ {formatCurrency(purchaseDetail.transactionValue)}
          </SystemText>
        </View>
        <View style={styles.creditCardInfoContainer}>
          <View style={styles.creditCardInfo}>
            <BrandText style={styles.creditCardInfoValue}>
              {formatPaymentMethodName(cardFlag, purchaseDetail.cardNumber)}
            </BrandText>
            <BrandText style={styles.creditCardInfoLabel}>
              Forma de pagamento
            </BrandText>
          </View>
          <Image
            style={styles.creditCardInfoImage}
            source={getLogoForBrand(cardFlag.toLowerCase())}
          />
        </View>
      </View>
    );
  };

  _renderScooDetails = () => {
    const { purchaseDetail, purchaseHistoricRide } = this.props;

    const statusCode = this._getStatusCode(
      purchaseDetail ? purchaseDetail.status : null
    );

    const acquirer =
      purchaseDetail && purchaseDetail.acquirer ? purchaseDetail.acquirer : "";

    let data = {};

    if (!_.isEmpty(purchaseHistoricRide)) {
      data = {
        start: {
          address: purchaseHistoricRide.startPoint.point,
          date: purchaseHistoricRide.startPoint.date
        },
        end: {
          address: purchaseHistoricRide.finishPoint.point,
          date: purchaseHistoricRide.finishPoint.date
        },
        scoo: purchaseHistoricRide.scoo.code,
        tax: purchaseHistoricRide.rate.initialValue,
        valuePerMinute: purchaseHistoricRide.rate.valuePerMinute,
        timeSeconds: purchaseHistoricRide.timeSeconds,
        minutesValue: purchaseHistoricRide.rate.initialValue,
        totalValue: purchaseHistoricRide.amount,
        quantity: purchaseHistoricRide.items[0].quantity,
        minuteFree: purchaseHistoricRide.rate.minuteFree
      };
    }
    return (
      <View>
        {statusCode === 3 && (
          <View>
            <BrandText style={styles.sectionLabel}>
              Comprovante de pagamento
            </BrandText>
            <View style={styles.paymentInfoContaier}>
              {this._renderAcquirerLogo(acquirer)}
              <BrandText style={styles.paymentInfoLabelMargin}>
                {purchaseDetail.merchantName}
              </BrandText>
              <BrandText style={styles.paymentInfoLabel}>
                CNPJ {formatCnpj(purchaseDetail.merchantDocument)}
              </BrandText>
              <BrandText style={styles.paymentInfoLabel}>
                {purchaseDetail.merchantCity}/{purchaseDetail.merchantState}
              </BrandText>
              <BrandText style={styles.paymentInfoLabelMargin}>
                {getPaymentMethodName(purchaseDetail.brand)} -{" "}
                {purchaseDetail.transactionTypeDescription}
              </BrandText>
              <BrandText style={styles.paymentInfoLabel}>
                {generateDisplayMask(
                  purchaseDetail.brand,
                  purchaseDetail.cardNumber
                )}
              </BrandText>
            </View>
            <View style={styles.paymentDetailsContaier}>
              <View style={styles.detailInfoContainer}>
                <BrandText style={styles.detailInfoLabel}>Valor</BrandText>
                <SystemText style={styles.detailInfoValue}>
                  R$ {formatCurrency(purchaseDetail.transactionValue)}
                </SystemText>
              </View>
              <View style={styles.detailInfoContainer}>
                <BrandText style={styles.detailInfoLabel}>
                  Data e Hora
                </BrandText>
                <SystemText style={styles.detailInfoValue}>
                  {Moment(purchaseDetail.transactionDate).format(
                    "DD/MM/YYYY, HH:mm"
                  )}
                </SystemText>
              </View>
              <View style={styles.detailInfoContainer}>
                <BrandText style={styles.detailInfoLabel}>TID</BrandText>
                <SystemText style={styles.detailInfoValue}>
                  {purchaseDetail.acquirerTransactionId}
                </SystemText>
              </View>
            </View>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <BrandText style={styles.sectionLabel}>Detalhes da corrida</BrandText>

          {_.isEmpty(purchaseHistoricRide) && this._renderPursacheHistoric()}
          {!_.isEmpty(purchaseHistoricRide) && (
            <View>
              <ScooReceipt data={data} />
            </View>
          )}
        </View>
      </View>
    );
  };

  render() {
    const { purchaseDetail, purchaseListUi } = this.props;
    const productType =
      purchaseDetail && purchaseDetail.productType
        ? purchaseDetail.productType
        : "";

    return (
      <View style={styles.container}>
        <Header
          title="Detalhe da compra"
          left={{
            type: headerActionTypes.CLOSE,
            onPress: this._back
          }}
        />
        {/* ================ */}
        {/* REQUEST FEEDBACK */}
        {/* ================ */}
        {(purchaseListUi.isFetching ||
          purchaseListUi.error !== "" ||
          !purchaseDetail) && (
          <View style={styles.requestFeedbackContainer}>
            <RequestFeedback
              loadingMessage="Carregando detalhes da compra..."
              errorMessage={purchaseListUi.error}
              emptyMessage="Detalhes da compra não encontrado"
              retryMessage="Tentar novamente"
              isFetching={purchaseListUi.isFetching}
              onRetry={this._fetchPurchaseList}
            />
          </View>
        )}
        {/* ========================== */}
        {/* === TRANSACTION STATUS === */}
        {/* ========================== */}
        {!purchaseListUi.isFetching &&
          purchaseListUi.error === "" &&
          purchaseDetail && (
            <ScrollView>
              {this._renderTransactionStatus()}
              {/* ========================== */}
              {/* === TRANSACTION DETAIL === */}
              {/* ========================== */}

              {isTransportCardProduct(productType) &&
                this._renderCreditPurchaseDetails()}
              {isFirstMeans(productType) && this.renderFirstMeans()}
              {isMobileProduct(productType) &&
                this._renderPhoneRechargeDetails()}
              {isScoo(productType) && this._renderScooDetails()}
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
  requestFeedbackContainer: {
    flex: 1,
    justifyContent: "center"
  },
  sectionLabel: {
    height: 48,
    padding: 16,
    backgroundColor: colors.GRAY_LIGHTER,
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16,
    color: colors.BRAND_PRIMARY
  },
  statusPointsContainer: {
    padding: 24,
    paddingHorizontal: 48
  },
  canceledStatusContainer: {
    padding: 16
  },
  canceledStatusBox: {
    padding: 16,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_LIGHT
  },
  canceledLabel: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    textAlign: "center",
    color: colors.GRAY
  },
  canceledInfoLabel: {
    marginTop: 16,
    fontSize: 12,
    lineHeight: 16,
    color: colors.GRAY_DARKER
  },
  paymentLogo: {
    height: 24,
    width: 72
  },
  paymentInfoContaier: {
    padding: 24,
    paddingHorizontal: 16
  },
  paymentInfoLabelMargin: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    color: colors.GRAY_DARKER
  },
  paymentInfoLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.GRAY_DARKER
  },
  paymentDetailsContaier: {
    padding: 16,
    paddingHorizontal: 0,
    borderTopWidth: 1,
    borderTopColor: colors.GRAY_LIGHT2
  },
  transportCard: {
    margin: 16
  },
  detailInfoContainer: {
    flexDirection: "row",
    height: 20,
    marginVertical: 10,
    marginHorizontal: 16
  },
  detailInfoLabel: {
    flex: 1,
    height: 16,
    marginVertical: 2,
    fontSize: 14,
    lineHeight: 16,
    textAlign: "left",
    color: colors.GRAY_DARKER
  },
  detailInfoValue: {
    flex: 1,
    height: 20,
    fontSize: 16,
    lineHeight: 20,
    textAlign: "right",
    color: colors.GRAY_DARKER
  },
  detailInfoValueCanceled: {
    flex: 1,
    height: 20,
    fontSize: 16,
    lineHeight: 20,
    textAlign: "right",
    textDecorationLine: "line-through",
    color: colors.GRAY_LIGHT
  },
  detailInfoLabelBold: {
    flex: 1,
    height: 16,
    marginTop: 2,
    marginBottom: 2,
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16,
    textAlign: "left",
    color: colors.GRAY_DARKER
  },
  detailInfoValueBold: {
    flex: 1,
    height: 20,
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 20,
    textAlign: "right",
    color: colors.GRAY_DARKER
  },
  detailInfoValueBoldCanceled: {
    flex: 1,
    height: 20,
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 20,
    textAlign: "right",
    textDecorationLine: "line-through",
    color: colors.GRAY_LIGHT
  },
  creditCardInfoContainer: {
    flexDirection: "row",
    height: 72,
    marginTop: 16,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.GRAY_LIGHT2
  },
  creditCardInfo: {
    flex: 1,
    flexDirection: "column"
  },
  creditCardInfoValue: {
    height: 20,
    fontSize: 16,
    lineHeight: 20,
    color: colors.GRAY_DARKER
  },
  creditCardInfoLabel: {
    height: 16,
    marginTop: 4,
    fontSize: 14,
    lineHeight: 16,
    color: colors.GRAY
  },
  creditCardInfoImage: {
    height: 32,
    width: 32,
    marginTop: 4,
    marginBottom: 4
  },
  recurrentIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.BRAND_PRIMARY
  },
  recurrentIcon: {
    marginRight: 8,
    fontSize: 24,
    color: "white"
  },
  recurrentText: {
    fontSize: 16,
    color: "white"
  },

  rechargeReceipt: {
    backgroundColor: "#FFFCDA",
    padding: 16
  },
  rechargeReceiptText: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 14,
    lineHeight: 16,
    color: colors.GRAY_DARKER
  },
  receiptDetails: {
    padding: 16
  },
  receiptCompanyInfo: {
    marginVertical: 16
  },
  receiptCompanyInfoText: {
    lineHeight: 20,
    color: colors.GRAY_DARKER
  }
});

function mapStateToProps(state) {
  return {
    customerId: state.profile.data.id,
    purchaseDetail: getPurchaseHistoryDetail(state),
    purchaseHistoryTransportCard: getPurchaseHistoryTransportCard(state),
    purchaseListUi: getPurchaseListUI(state),
    purchaseHistoricRide: state.purchaseHistoricRide.data
  };
}

export const PurchaseHistoryDetail = connect(mapStateToProps)(
  PurchaseHistoryDetailView
);
