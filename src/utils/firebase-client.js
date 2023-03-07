import { Platform, Alert } from "react-native";

import { colors } from "../styles";
import { routeNames } from "../shared/route-names";
import axios from "axios";

const API_URL = "https://fcm.googleapis.com/fcm/send";

const FirebaseConstants = {
  KEY:
    "AAAAVHlBr60:APA91bEzsfWU_2h5Z1LMD3GJc4xZhpJL9QpnrNRah4e3suG5C2WWZNrf0-gQLtZk7KLrnWjQoFFcNfLjGXHbkphE_Zj4yZP4OwN_Y-9E8ydK34HpmsclkxIbvz0sXnY_MwUKaVrlxsIB"
};

const _getPurchaseHistoryDetailBody = token => {
  let body = {
    to: token,
    notification: {
      title: "Simple FCM Client",
      body: "This is a notification with only NOTIFICATION.",
      sound: "default"
    },
    data: {
      sound: "default",
      routeName: routeNames.PURCHASE_HISTORY_DETAIL,
      routeParams: {
        message: {
          data: {
            purchaseId: 203
          }
        }
      }
    },
    priority: "high"
  };

  if (Platform.OS === "android") {
    body = {
      to: token,
      notification: {
        title: "Simple FCM Client",
        body: "This is a notification with only NOTIFICATION.",
        sound: "default"
      },
      data: {
        sound: "default",
        icon: "ic_stat_voud",
        color: colors.BRAND_PRIMARY,
        routeName: routeNames.PURCHASE_HISTORY_DETAIL,
        routeParams: {
          message: {
            data: {
              purchaseId: 203
            }
          }
        }
      },
      priority: "high"
    };
  }
  return body;
};

const _getNotificationDetailBody = token => {
  const routeParams = {
    id: 4,
    type: "CAMPAIGN",
    title: "Alerta Padrão",
    subject: "Assunto do comunicado",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin orci nec nibh volutpat, a ornare enim volutpat. In vehicula diam vel lectus lobortis porta. Mauris sed ipsum ullamcorper, blandit arcu quis, placerat dui. Morbi pretium nibh et nisl bibendum luctus. Phasellus sagittis aliquet felis sed lacinia. Aenean malesuada efficitur ante, eget imperdiet erat consectetur sed. Pellentesque lobortis diam ac elit laoreet, at tincidunt massa laoreet. Vivamus sed scelerisque augue. Curabitur pulvinar lacinia nibh, ut fermentum ex vulputate ac. Integer a volutpat purus, ut eleifend elit. Nullam consectetur viverra ante posuere viverra. Vestibulum rhoncus, lorem vitae placerat laoreet, velit magna fringilla urna, nec consectetur dolor quam eu felis. Nunc laoreet est eu dignissim finibus. Aliquam erat volutpat. Integer molestie non felis sed tempor.",
    urlMedia:
      "https://images.endeavor.org.br/uploads/2017/08/Do-l%C3%B3gico-para-o-psicol%C3%B3gico_-copiar-1.png",
    urlDeepLink: "https://nqek6.app.goo.gl/3EvT",
    voucherCode: "84bgid43vl",
    urlPartner: "",
    read: false
  };

  let body = {
    to: token,
    notification: {
      title: "Assunto do comunicado",
      body:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin orci nec nibh volutpat, a ornare enim volutpat. In vehicula diam vel lectus lobortis porta. Mauris sed ipsum ullamcorper, blandit arcu quis, placerat dui. Morbi pretium nibh et nisl bibendum luctus. Phasellus sagittis aliquet felis sed lacinia. Aenean malesuada efficitur ante, eget imperdiet erat consectetur sed. Pellentesque lobortis diam ac elit laoreet, at tincidunt massa laoreet. Vivamus sed scelerisque augue. Curabitur pulvinar lacinia nibh, ut fermentum ex vulputate ac. Integer a volutpat purus, ut eleifend elit. Nullam consectetur viverra ante posuere viverra. Vestibulum rhoncus, lorem vitae placerat laoreet, velit magna fringilla urna, nec consectetur dolor quam eu felis. Nunc laoreet est eu dignissim finibus. Aliquam erat volutpat. Integer molestie non felis sed tempor.",
      sound: "default"
    },
    data: {
      sound: "default",
      routeName: routeNames.NOTIFICATION_DETAIL,
      routeParams: {
        ...routeParams
      }
    },
    priority: "high"
  };

  if (Platform.OS === "android") {
    body = {
      ...body,
      data: {
        ...body.data,
        icon: "ic_stat_voud",
        color: colors.BRAND_PRIMARY
      }
    };
  }
  return body;
};

export const sendNotification = token => {
  const body = _getPurchaseHistoryDetailBody(token);
  // const body = _getNotificationDetailBody(token);

  _send(JSON.stringify(body));
};

const _send = async body => {
  let headers = new Headers({
    "Content-Type": "application/json",
    Authorization: "key=" + FirebaseConstants.KEY
  });

  try {
    // let response = await fetch(API_URL, { method: "POST", headers, body });
    // response = await response.json();

    let response = await axios(API_URL, { method: "POST", headers, body });
    response = response.data;

    if (!response.success) {
      Alert.alert("Failed to send notification, check error log");
    }
  } catch (err) {
    const response = error.response;
    const responseJson = response.data;
    Alert.alert(err && responseJson.message);
  }
};
