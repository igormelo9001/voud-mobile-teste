import RatingRequester from "react-native-rating-request";
import moment from "moment";
import { showToast } from "./redux/toast";

const init = store => {
  global.RatingTracker = new RatingRequester(
    "1325804882",
    "br.com.autopass.voud",
    {
      title: "Obrigado por escolher o VouD!",
      message: "Deseja avaliar o app?",
      actionLabels: {
        accept: "Sim",
        delay: "Lembrar mais tarde",
        decline: "Não"
      },
      callbacks: {
        delay: () => {
          store.dispatch(showToast("Obrigado!"));
        },
        decline: () => {
          store.dispatch(showToast("Obrigado!"));
        }
      },
      showIsEnjoyingDialog: false,
      timingFunction: (
        config,
        ratedTimestamp,
        declinedTimestamp,
        lastSeenTimestamp,
        usesCount,
        eventCounts
      ) => {
        const now = moment();
        const declined = moment(Number(declinedTimestamp));
        const rated = moment(Number(ratedTimestamp));
        const lastSeen = moment(Number(lastSeenTimestamp));

        if (
          declinedTimestamp &&
          declined.isAfter(rated) &&
          (declined.isAfter(lastSeen) || declined.diff(lastSeen, "days") == 0)
        ) {
          const declinedDays = now.diff(declined, "days");

          return declinedDays >= 150;
        } else if (
          ratedTimestamp &&
          (rated.isAfter(lastSeen) || rated.diff(lastSeen, "days") == 0)
        ) {
          const ratedDays = now.diff(rated, "days");

          return ratedDays >= 120;
        } else if (lastSeenTimestamp) {
          const lastSeenDays = now.diff(lastSeen, "days");
          return lastSeenDays >= 30;
        } else return eventCounts >= 3;
      },
      debug: __DEV__
    }
  );
};

export default init;
