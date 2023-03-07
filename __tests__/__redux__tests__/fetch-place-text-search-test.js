import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import actionTypes, {
// Action creators
	_fetchPlaceSearch,
	_fetchPlaceSearchFailure,
	_fetchPlaceSearchSuccess,
	clearPredictions,

	// Thunks
	fetchPlaceTextSearch
} from '../../src/flows/mobility-services/actions';
import { uuidv4 } from '../../src/utils/uuid-util';
import { mockFetch } from '../../src/test-utils/fetch-helper';
import { initialState } from '../../src/flows/mobility-services/reducer';

// Initialize redux store
const requestUid = uuidv4();
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
	...initialState,
	mobilityServices: {
		predictions: {
			sessionToken: ''
		}
	},
	profile: {
		position: {}
	}
});

describe('Search points of interest actions > FETCH_PLACE_SEARCH_*', () => {
	afterEach(() => {
		store.clearActions();
	});

	it('creates the FETCH_PLACE_SEARCH action correctly', () => {
		const expectedAction = {
			type: actionTypes.FETCH_PLACE_SEARCH
		};

		expect(expectedAction).toEqual(_fetchPlaceSearch());
	});

	it('creates the FETCH_PLACE_SEARCH_SUCCESS action correctly', () => {
		const mockData = [];

		const expectedAction = {
			type: actionTypes.FETCH_PLACE_SEARCH_SUCCESS,
			response: mockData
		};

		expect(expectedAction).toEqual(_fetchPlaceSearchSuccess(mockData));
	});

	it('creates the FETCH_PLACE_SEARCH_FAILURE action correctly', () => {
		const mockError = 'mockError';

		const expectedAction = {
			type: actionTypes.FETCH_PLACE_SEARCH_FAILURE,
			error: mockError
		};

		expect(expectedAction).toEqual(_fetchPlaceSearchFailure(mockError));
	});

	it('creates the FETCH_PLACE_SEARCH_CLEAR action correctly', () => {
		const expectedAction = {
			type: actionTypes.PREDICTIONS_CLEAR
		};

		expect(expectedAction).toEqual(clearPredictions());
	});

	// Thunks
	it('dispatches the correct actions if fetchPlaceTextSearch thunk succeeds', async () => {
		global.fetch = mockFetch(true, {
			payload: '',
			status: 'OK'
		});

    const expectedActions = [ 
      actionTypes.FETCH_PLACE_SEARCH, 
      actionTypes.FETCH_PLACE_SEARCH_SUCCESS 
    ];
		const expectedTypes = expectedActions.map((a) => a.actionTypes);

    await store.dispatch(fetchPlaceTextSearch('a'));
    const actions = store.getActions().map((a) => a.actionTypes);
    actions && expect(actions).toEqual(expectedTypes);
    
	});

	it('dispatches the correct actions if fetchPlaceTextSearch thunk fails', async () => {
		const mockErrorMessage = '';
		global.fetch = mockFetch(false, { returnMessage: mockErrorMessage });

		const expectedActions = [ actionTypes.FETCH_PLACE_SEARCH, actionTypes.FETCH_PLACE_SEARCH_FAILURE ];
		const expectedTypes = expectedActions.map((a) => a.actionTypes);

		try {
			await store.dispatch(fetchPlaceTextSearch('a'));
			done.fail(mockErrorMessage);
		} catch (error) {
			const actions = store.getActions().map((a) => a.actionTypes);
			actions && expect(actions).toEqual(expectedTypes);

			const failureAction = store
				.getActions()
				.find((action) => action.type === actionTypes.FETCH_PLACE_SEARCH_FAILURE);

			expect(failureAction.error).toEqual(mockErrorMessage);
		}
	});
});
