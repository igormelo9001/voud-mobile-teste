// NPM imports
import { voudRequest } from '../../../../shared/services';

const Types = {
  REPORT_PROBLEM_RIDE: 'voud/scooter/REPORT_PROBLEM_RIDE',
  REPORT_PROBLEM_RIDE_SUCCESS: 'voud/scooter/REPORT_PROBLEM_RIDE_SUCCESS',
  REPORT_PROBLEM_RIDE_FAILARE: 'vou/scooter/REPORT_PROBLEM_RIDE_FAILARE',
}

// Reducer
const initialState = {
  isFetching: false,
  error: "",
  data: {},
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Types.REPORT_PROBLEM_RIDE:
      return {
        ...state,
        isFetching: true,
      };
    case Types.REPORT_PROBLEM_RIDE_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isFetching: false,
      }
    case Types.REPORT_PROBLEM_RIDE_FAILARE:
      return {
        ...state,
        data: {},
        isFetching: false,
      }
    default:
      return state;
  }
}

// Actions Creators
function reportProblem() {
  return {
    type: Types.REPORT_PROBLEM_RIDE,
  }
}

function reportProblemSuccess(payload) {
  return {
    type: Types.REPORT_PROBLEM_RIDE_SUCCESS,
    payload,
  }
}

function reportProblemFailure(error) {
  return {
    type: Types.REPORT_PROBLEM_RIDE_FAILARE,
    error: error,
  }
}

// Thunk c reators

export function fetchReportProblem(code, problems) {
  return async function (dispatch) {
    dispatch(reportProblem());

    try {

      const resquesbody = { code, problems };
      const response = await voudRequest('/scoo/report', 'POST', resquesbody, true, true);
      dispatch(reportProblemSuccess(response.payload));
      return response;
    } catch (error) {
      if (__DEV__) console.tron.log(error.message, true);
      dispatch(reportProblemFailure("Ocorreu um erro durante processamento, tente novamente"));
      throw error;
    }
  }

}




