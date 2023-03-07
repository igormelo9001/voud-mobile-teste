// NPM imports
import Moment from "moment";

// VOUD IMPORTS
import { voudRequest } from "../shared/services";
import { requestErrorHandler } from "../shared/request-error-handler";
import { GAEventParams, GATrackEvent } from "../shared/analytics";

export const reportTypes = {
  FRAUD_MISUSE: "FRAUD_MISUSE",
  SEXUAL_HARASSMENT: "SEXUAL_HARASSMENT",
  THEFT: "THEFT",
  AGGRESSION: "AGGRESSION",
  VANDALISM: "VANDALISM",
  TRAFFICKING: "TRAFFICKING",
  DRIVER: "DRIVER",
  POOR_CONSERVATION: "POOR_CONSERVATION",
  STREET_VENDOR: "STREET_VENDOR"
};

export const reportTypeLabels = {
  [reportTypes.FRAUD_MISUSE]: "Fraude / Mau uso",
  [reportTypes.SEXUAL_HARASSMENT]: "Assédio sexual",
  [reportTypes.THEFT]: "Furto / Roubo",
  [reportTypes.AGGRESSION]: "Agressão",
  [reportTypes.VANDALISM]: "Vandalismo",
  [reportTypes.TRAFFICKING]: "Uso / Tráfico de drogas",
  [reportTypes.DRIVER]: "Motorista / Condutor",
  [reportTypes.POOR_CONSERVATION]: "Má conservação / Ventilação",
  [reportTypes.STREET_VENDOR]: "Ambulante"
};

export const getReportTypeLabel = reportType => reportTypeLabels[reportType];

export const reportModalTypes = {
  BUS: "BUS",
  TRAIN: "TRAIN",
  SUBWAY: "SUBWAY",
  STATION: "STATION"
};

export const reportModalTypeLabels = {
  [reportModalTypes.BUS]: "Ônibus",
  [reportModalTypes.TRAIN]: "Trem",
  [reportModalTypes.SUBWAY]: "Metrô",
  [reportModalTypes.STATION]: "Na parada ou estação"
};

export const getReportModalTypeLabel = modalType =>
  reportModalTypeLabels[modalType];

// actions
export const ADD_REPORT = "voud/report/ADD_REPORT";
export const ADD_REPORT_SUCCESS = "voud/report/ADD_REPORT_SUCCESS";
export const ADD_REPORT_FAILURE = "voud/report/ADD_REPORT_FAILURE";
export const ADD_REPORT_CLEAR = "voud/report/ADD_REPORT_CLEAR";

export const FINISH_REPORT = "voud/report/FINISH_REPORT";
export const FINISH_REPORT_SUCCESS = "voud/report/FINISH_REPORT_SUCCESS";
export const FINISH_REPORT_FAILURE = "voud/report/FINISH_REPORT_FAILURE";
export const FINISH_REPORT_CLEAR = "voud/report/FINISH_REPORT_CLEAR";

export const reportActions = {
  ADD_REPORT_SUCCESS
};

// reducer
export const initialState = {
  add: {
    isFetching: false,
    error: ""
  },
  finish: {
    isFetching: false,
    error: ""
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_REPORT:
      return {
        ...state,
        add: {
          isFetching: true,
          error: ""
        }
      };
    case ADD_REPORT_FAILURE:
      return {
        ...state,
        add: {
          isFetching: false,
          error: action.error
        }
      };
    case ADD_REPORT_SUCCESS:
    case ADD_REPORT_CLEAR:
      return {
        ...state,
        add: {
          isFetching: false,
          error: ""
        }
      };
    case FINISH_REPORT:
      return {
        ...state,
        finish: {
          isFetching: true,
          error: ""
        }
      };
    case FINISH_REPORT_FAILURE:
      return {
        ...state,
        finish: {
          isFetching: false,
          error: action.error
        }
      };
    case FINISH_REPORT_SUCCESS:
    case FINISH_REPORT_CLEAR:
      return {
        ...state,
        finish: {
          isFetching: false,
          error: ""
        }
      };
    default:
      return state;
  }
}

// actions creators

// Add report
export function addReport() {
  return { type: ADD_REPORT };
}
export function addReportSuccess() {
  return {
    type: ADD_REPORT_SUCCESS
  };
}
export function addReportFailure(error) {
  return {
    type: ADD_REPORT_FAILURE,
    error
  };
}
export function addReportClear() {
  return { type: ADD_REPORT_CLEAR };
}

// Finish report
export function finishReport() {
  return { type: FINISH_REPORT };
}
export function finishReportSuccess() {
  return {
    type: FINISH_REPORT_SUCCESS
  };
}
export function finishReportFailure(error) {
  return {
    type: FINISH_REPORT_FAILURE,
    error
  };
}
export function finishReportClear() {
  return { type: FINISH_REPORT_CLEAR };
}

// thunk action creators

export function fetchAddReport({
  category,
  line,
  carId,
  station,
  details,
  occurDate,
  occurTime,
  latitude,
  longitude,
  address,
  transport,
  happening
}) {
  return async function(dispatch, getState) {
    // dispatch request action
    dispatch(addReport());

    try {
      const momentDate =
        occurDate && occurTime
          ? Moment(`${occurDate}${occurTime}`, "DDMMYYYYHHmm")
          : Moment();
      // const categoryTemporary =
      //   category === "FRAUD_MISUSE" ? "DRIVER" : category;
      const requestBody = {
        category: category,
        line: line ? line : "",
        carId: carId ? carId : "",
        station: station ? station : "",
        details: details ? details : "",
        date: momentDate.format("YYYY-MM-DDTHH:mm:ss"),
        latitude,
        longitude,
        address: address ? address : "",
        transport,
        happening: happening ? true : false,
        fcmToken: getState().profile.fcmToken
      };

      const response = await voudRequest(
        "/report/save",
        "POST",
        requestBody,
        true
      );

      const {
        categories: { FORM },
        actions: { SUBMIT },
        labels: { SUBMIT_REPORT }
      } = GAEventParams;
      GATrackEvent(FORM, SUBMIT, SUBMIT_REPORT);

      dispatch(addReportSuccess());
      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);

      const {
        categories: { ERROR },
        actions: { SUBMIT },
        labels: { SUBMIT_REPORT }
      } = GAEventParams;
      GATrackEvent(ERROR, SUBMIT, SUBMIT_REPORT);

      if (
        !requestErrorHandler(dispatch, error, addReportFailure(error.message))
      ) {
        throw error;
      }
    }
  };
}

export function fetchFinishReport({
  id,
  date,
  category,
  line,
  carId,
  station,
  details,
  latitude,
  longitude,
  address,
  transport,
  happening
}) {
  return async function(dispatch) {
    // dispatch request action
    dispatch(finishReport());

    try {
      const requestBody = {
        id,
        date,
        category,
        line,
        carId,
        station,
        details,
        latitude,
        longitude,
        address,
        transport,
        happening
      };

      const response = await voudRequest(
        "/report/finish",
        "POST",
        requestBody,
        true
      );

      const {
        categories: { FORM },
        actions: { SUBMIT },
        labels: { SUBMIT_REPORT_FINISH }
      } = GAEventParams;
      GATrackEvent(FORM, SUBMIT, SUBMIT_REPORT_FINISH);

      dispatch(finishReportSuccess());
      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);

      const {
        categories: { ERROR },
        actions: { SUBMIT },
        labels: { SUBMIT_REPORT }
      } = GAEventParams;
      GATrackEvent(ERROR, SUBMIT, SUBMIT_REPORT);

      if (
        !requestErrorHandler(
          dispatch,
          error,
          finishReportFailure(error.message)
        )
      ) {
        throw error;
      }
    }
  };
}
