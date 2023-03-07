// consts
const productCategories = {
  MOBILE: 'mobile',
  TRANSPORT_CARD: 'transportCard',
  SCOO: 'scoo',
  FIRST_MEANS: 'Solicitação 1.via cartão',
  QRCODE: 'QRCODE',
};

export const acquirerNames = {
  CIELO: 'CIELO',
  ADYEN: 'ADYEN',
};

// functions
export const isMobileProduct = productCategory => productCategory === productCategories.MOBILE;

export const isTransportCardProduct = productCategory =>
  productCategory === productCategories.TRANSPORT_CARD;

export const isScoo = productCategory => productCategory === productCategories.SCOO;

export const isFirstMeans = productCategory => productCategory === productCategories.FIRST_MEANS;

export const isQrCode = productCategory => productCategory === productCategories.QRCODE;

export const getPurchaseStatusText = (status, isDebit, isMobile) => {
  switch (status) {
    case 'ERROR':
    case 'CANCELED':
      return isMobile ? 'Recarga não realizada' : 'Carga não realizada';
    case 'PROCESSING':
      return isDebit
        ? 'Aguardando confirmação'
        : `Aguardando liberação da ${isMobile ? 'recarga' : 'carga'}`;
    case 'PROCCESSED':
      return isMobile ? 'Recarga de celular confirmada' : 'Pagamento confirmado';
  }
};

export const getPurchaseStatusTextScoo = status => {
  switch (status) {
    case 'ERROR':
    case 'CANCELED':
      return 'Pagamento não processado';
    case 'PROCESSING':
      return 'Aguardando confirmação';
    case 'PROCCESSED':
      return 'Pagamento confirmado';
    case 'PENDING':
      return 'Pagamento pendente';
  }
};

export const getPurchaseStatusTextQrCode = status => {
  switch (status) {
    case 'ERROR':
    case 'CANCELED':
      return 'Pagamento não processado';
    case 'PROCESSING':
      return 'Aguardando confirmação';
    case 'PROCCESSED':
      return 'Pagamento confirmado';
    case 'PENDING':
      return 'Pagamento pendente';
  }
};

export const getPurchaseStatusTextFirstMeans = status => {
  switch (status) {
    case 'ERROR':
    case 'CANCELED':
      return 'Pagamento não processado';
    case 'PROCESSING':
      return 'Aguardando confirmação';
    case 'PROCCESSED':
      return 'Pagamento confirmado';
  }
};
