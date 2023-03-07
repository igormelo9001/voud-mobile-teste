import firebase from "react-native-firebase";

export const initiateRemoteConfig = () => {
  if (__DEV__) {
    firebase.config().enableDeveloperMode();
  }

  firebase.config().setDefaults({
    HOST_URL_BASE: "no_value",
    GOOGLE_MAPS_BASE_URL: "no_value",
    VAH_BASE_URL: "no_value",
    VAH_BEARER_TOKEN: "no_value",
    STATION_QRCODE: "no_value",
    VOUD_BASE_URL: "no_value",
    QRCODE_VISIBLE: "no_value",
    QRCODE_EXTRACT: "no_value",
    HOST_POINTS_OF_INTEREST: "no_value",
    LEGAL_TEXT_SUCESS: "no_value"
  });
};

export const getVAHBearerToken = () => {
  return firebase
    .config()
    .fetch()
    .then(() => {
      return firebase.config().activateFetched();
    })
    .then(activated => {
      return firebase.config().getValue("VAH_BEARER_TOKEN");
    })
    .then(snapshot => {
      const VAH_BEARER_TOKEN = snapshot.val();
      if (VAH_BEARER_TOKEN) {
        return VAH_BEARER_TOKEN;
      }
    })
    .catch(console.error);
};

export const getVAHHostUrl = () => {
  return firebase
    .config()
    .fetch()
    .then(() => {
      return firebase.config().activateFetched();
    })
    .then(activated => {
      return firebase.config().getValue("VAH_BASE_URL");
    })
    .then(snapshot => {
      const VAH_BASE_URL = snapshot.val();
      if (VAH_BASE_URL) {
        return VAH_BASE_URL;
      }
    })
    .catch(console.error);
};

export const getGoogleMapsHostUrl = () => {
  return firebase
    .config()
    .fetch()
    .then(() => {
      return firebase.config().activateFetched();
    })
    .then(activated => {
      return firebase.config().getValue("GOOGLE_MAPS_BASE_URL");
    })
    .then(snapshot => {
      const GOOGLE_MAPS_BASE_URL = snapshot.val();
      if (GOOGLE_MAPS_BASE_URL) {
        return GOOGLE_MAPS_BASE_URL;
      }
    })
    .catch(console.error);
};

export const getHostUrl = () => {
  return firebase
    .config()
    .fetch()
    .then(() => {
      return firebase.config().activateFetched();
    })
    .then(activated => {
      //PRODUÇÃO
      // return firebase.config().getValue("HOST_URL_BASE");

      //PRODUÇÃO
      return firebase.config().getValue("HOST_URL_BASE");
    })
    .then(snapshot => {
      const HOST_URL_BASE = snapshot.val();
      if (HOST_URL_BASE) {
        return HOST_URL_BASE;
      }
    })
    .catch(console.error);
};

export const getHostQrCode = () => {
  return firebase
    .config()
    .fetch(300)
    .then(() => {
      return firebase.config().activateFetched();
    })
    .then(activated => {
      return firebase.config().getValue("STATION_QRCODE");
    })
    .then(snapshot => {
      const STATION_QRCODE = snapshot.val();
      if (STATION_QRCODE) {
        return STATION_QRCODE;
      }
    })
    .catch(console.error);
};

export const getHostQrCodeValidate = () => {
  return firebase
    .config()
    .fetch(300)
    .then(() => {
      return firebase.config().activateFetched();
    })
    .then(activated => {
      return firebase.config().getValue("QRCODE_VALIDATE");
    })
    .then(snapshot => {
      const QRCODE_VALIDATE = snapshot.val();
      if (QRCODE_VALIDATE) {
        return QRCODE_VALIDATE;
      }
    })
    .catch(console.error);
};

export const getQrCodeVisible = () => {
  return firebase
    .config()
    .fetch(0)
    .then(() => {
      return firebase.config().activateFetched();
    })
    .then(activated => {
      return firebase.config().getValue("QRCODE_VISIBLE");
    })
    .then(snapshot => {
      const QRCODE_VISIBLE = snapshot.val();
      if (QRCODE_VISIBLE) {
        return QRCODE_VISIBLE;
      }
    })
    .catch(console.error);
};

export const getQrCodeExtractVisible = () => {
  return firebase
    .config()
    .fetch(300)
    .then(() => {
      return firebase.config().activateFetched();
    })
    .then(activated => {
      return firebase.config().getValue("QRCODE_EXTRACT");
    })
    .then(snapshot => {
      const QRCODE_EXTRACT = snapshot.val();
      if (QRCODE_EXTRACT) {
        return QRCODE_EXTRACT;
      }
    })
    .catch(console.error);
};

export const getPointsOfInterestVisible = () => {
  return firebase
    .config()
    .fetch(0)
    .then(() => {
      return firebase.config().activateFetched();
    })
    .then(activated => {
      return firebase.config().getValue("HOST_POINTS_OF_INTEREST");
    })
    .then(snapshot => {
      const HOST_POINTS_OF_INTEREST = snapshot.val();
      if (HOST_POINTS_OF_INTEREST) {
        return HOST_POINTS_OF_INTEREST;
      }
    })
    .catch(console.error);
};

export const getLegalTextVisible = () => {
  return firebase
    .config()
    .fetch(300)
    .then(() => {
      return firebase.config().activateFetched();
    })
    .then(activated => {
      return firebase.config().getValue("LEGAL_TEXT_SUCESS");
    })
    .then(snapshot => {
      const LEGAL_TEXT_SUCESS = snapshot.val();
      if (LEGAL_TEXT_SUCESS) {
        return LEGAL_TEXT_SUCESS;
      }
    })
    .catch(console.error);
};
