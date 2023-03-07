// VouD imports
import { voudRequest } from '../shared/services';
import { requestErrorHandler } from '../shared/request-error-handler';

// Actions

const REQUEST_LIST         = 'voud/help/REQUEST_LIST';
const REQUEST_LIST_SUCCESS = 'voud/help/REQUEST_LIST_SUCCESS';
const REQUEST_LIST_FAILURE = 'voud/help/REQUEST_LIST_FAILURE';

const VIEW_DETAILS = 'voud/help/VIEW_DETAILS';

// Reducer

const initialState = {
    list: {
        isFetching: false,
        error: '',
        requested: null,
        data: []
    },
    currentHelpTopicId: null
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_LIST:
            return {
                ...state,
                list: {
                    ...state.list,
                    requested: new Date(),
                    isFetching: true
                }
            };
        case REQUEST_LIST_SUCCESS:
            return {
                ...state,
                list: {
                    isFetching: false,
                    error: '',
                    data: action.response.payload
                }
            };
        case REQUEST_LIST_FAILURE:
            return {
                ...state,
                list: {
                    ...state.list,
                    isFetching: false,
                    error: action.error
                }
            };
        case VIEW_DETAILS:
            return {
                ...state,
                currentHelpTopicId: action.helpTopicId
            };
        default:
            return state;
    }
}

export default reducer;

// Actions creators

// Request help topics
function requestHelpTopics() {
    return { type: REQUEST_LIST };
}
function requestHelpTopicsSuccess(response) {
    return {
        type: REQUEST_LIST_SUCCESS,
        response
    }
}
function requestHelpTopicsFailure(error) {
    return {
        type: REQUEST_LIST_FAILURE,
        error
    }
}

// View details
export function viewHelpDetails(helpTopicId) {
    return {
        type: VIEW_DETAILS,
        helpTopicId
    }
}

// Thunk action creators

export function fetchHelpTopics() {
    return function (dispatch) {
        // dispatch request action
        dispatch(requestHelpTopics());

        (async () => {
            try {
                let response = await voudRequest('/content/faq/list', 'GET');
                dispatch(requestHelpTopicsSuccess(response));
            }
            catch(error) {
                if (__DEV__) console.tron.log(error.message, true);
                requestErrorHandler(dispatch, error, requestHelpTopicsFailure(error.message));
            }
        })();
    }
}
