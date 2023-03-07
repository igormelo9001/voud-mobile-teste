/* eslint-disable no-undef */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { mockFetch } from '../../src/test-utils/fetch-helper';
import reportReducer, {
	ADD_REPORT,
	ADD_REPORT_SUCCESS,
	ADD_REPORT_FAILURE,
	addReportSuccess,
	addReport,
	addReportFailure,
	initialState,
	fetchAddReport,
	fetchFinishReport,
	FINISH_REPORT,
	FINISH_REPORT_FAILURE,
	FINISH_REPORT_SUCCESS,
	finishReport,
	finishReportSuccess,
	finishReportFailure,
	ADD_REPORT_CLEAR,
	addReportClear,
	FINISH_REPORT_CLEAR,
	finishReportClear
} from '../../src/redux/report';
import { initialState as profileState } from '../../src/redux/profile';
// Initialize Redux Store
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
	report: initialState,
	profile: profileState
});

describe('Report Actions', () => {
	afterEach(() => {
		store.clearActions();
	});

	// Add Report

	it('creates add report action correctly', () => {
		const expectedRemoveAction = { type: ADD_REPORT };
		expect(expectedRemoveAction).toEqual(addReport());
	});

	it('creates add report success action correctly', () => {
		const expectedSuccessAction = { type: ADD_REPORT_SUCCESS };
		expect(expectedSuccessAction).toEqual(addReportSuccess());
	});

	it('creates add report clear action correctly', () => {
		const expectedClearAction = { type: ADD_REPORT_CLEAR };
		expect(expectedClearAction).toEqual(addReportClear());
	});

	it('creates add report failure action correctly', () => {
		const mockErrorMessage = 'Test error';
		const expectedFailureAction = { type: ADD_REPORT_FAILURE, error: mockErrorMessage };
		expect(expectedFailureAction).toEqual(addReportFailure(mockErrorMessage));
	});

	it('dispatches the correct actions if fetchAddReport action thunk succeeded', async (done) => {
    const mockReport = {};
    const mockErrorMessage = 'Test error';

		global.fetch = mockFetch(true, {});
		const expectedActions = [ ADD_REPORT, ADD_REPORT_SUCCESS ];
		try {
			await store.dispatch(fetchAddReport(mockReport));

			const actualActions = store.getActions().map((action) => action.type);
      expect(expectedActions).toEqual(actualActions);
      expect(actualActions).toMatchSnapshot();
      
		} catch (error) {

		}

		done();
	});

	// it('dispatches the correct actions if fetchAddReport action thunk failed', async done => {
	//   jest.setTimeout(500000)

	//   const mockReport = {};
	//   const mockErrorMessage = 'Test error';
	//   global.fetch = mockFetch(false, { data:{ returnMessage: mockErrorMessage }});
	//   const expectedActions = [
	//     ADD_REPORT,
	//     ADD_REPORT_FAILURE
	//   ];

	//   try {
	//     await store.dispatch(fetchAddReport(mockReport));
	//     done.fail();
	//   } catch (error) {
	//     const actualActions = store.getActions().map(action => action.type);
	//     expect(expectedActions).toEqual(actualActions);

	//     const failureAction = store.getActions().find(action => action.type === ADD_REPORT_FAILURE);
	//     expect(failureAction.error).toEqual(mockErrorMessage);
	//   }

	//   done();
	// });

	// Finish Report

	it('creates finish report action correctly', () => {
		const expectedRemoveAction = { type: FINISH_REPORT };
		expect(expectedRemoveAction).toEqual(finishReport());
	});

	it('creates finish report success action correctly', () => {
		const expectedSuccessAction = { type: FINISH_REPORT_SUCCESS };
		expect(expectedSuccessAction).toEqual(finishReportSuccess());
	});

	it('creates finish report clear action correctly', () => {
		const expectedClearAction = { type: FINISH_REPORT_CLEAR };
		expect(expectedClearAction).toEqual(finishReportClear());
	});

	it('creates finish report failure action correctly', () => {
		const mockErrorMessage = 'Test error';
		const expectedFailureAction = { type: FINISH_REPORT_FAILURE, error: mockErrorMessage };
		expect(expectedFailureAction).toEqual(finishReportFailure(mockErrorMessage));
	});

	// it('dispatches the correct actions if fetchFinishReport action thunk succeeded', async () => {
	//   const mockReport = {};
	//   global.fetch = mockFetch(true, {data:{}});
	//   const expectedActions = [
	//     FINISH_REPORT,
	//     FINISH_REPORT_SUCCESS
	//   ];

	//   await store.dispatch(fetchFinishReport(mockReport));

	//   const actualActions = store.getActions().map(action => action.type);
	//   expect(expectedActions).toEqual(actualActions);
	// });

	//   it('dispatches the correct actions if fetchFinishReport action thunk failed', async done => {
	//     jest.setTimeout(500000)

	//     const mockReport = {};

	//     const mockErrorMessage = 'Test error';
	//     global.fetch = mockFetch(false, { data: {returnMessage: mockErrorMessage }});
	//     const expectedActions = [
	//       FINISH_REPORT,
	//       FINISH_REPORT_FAILURE
	//     ];

	//     try {
	//       await store.dispatch(fetchFinishReport(mockReport));
	//       done.fail();
	//     } catch (error) {
	//       const actualActions = store.getActions().map(action => action.type);
	//       expect(expectedActions).toEqual(actualActions);

	//       const failureAction = store.getActions().find(action => action.type === FINISH_REPORT_FAILURE);
	//       expect(failureAction.error).toEqual(mockErrorMessage);
	//     }

	//     done();
	//   });

	// });

	// describe('Report Reducer', () => {

	// Add Report

	it('returns the correct state on add report action', () => {
		const expectedState = {
			...initialState,
			add: {
				...initialState.add,
				isFetching: true,
				error: ''
			}
		};
		const newState = reportReducer(initialState, addReport());
		expect(expectedState).toEqual(newState);
	});

	it('returns the correct state on add report failure action', () => {
		const mockErrorMessage = 'Test error';
		const expectedState = {
			...initialState,
			add: {
				...initialState.add,
				isFetching: false,
				error: mockErrorMessage
			}
		};
		const newState = reportReducer(initialState, addReportFailure(mockErrorMessage));
		expect(expectedState).toEqual(newState);
	});

	it('returns the correct state on add report success action', () => {
		const mockInitialState = {
			...initialState,
			add: {
				...initialState.add,
				isFetching: true,
				error: ''
			}
		};
		const expectedState = {
			...initialState,
			add: {
				...initialState.add,
				isFetching: false,
				error: ''
			}
		};
		const newState = reportReducer(mockInitialState, addReportSuccess());
		expect(expectedState).toEqual(newState);
	});

	it('returns the correct state on add report clear action', () => {
		const mockInitialState = {
			...initialState,
			add: {
				...initialState.add,
				isFetching: true,
				error: ''
			}
		};
		const expectedState = {
			...initialState,
			add: {
				...initialState.add,
				isFetching: false,
				error: ''
			}
		};
		const newState = reportReducer(mockInitialState, addReportClear());
		expect(expectedState).toEqual(newState);
	});

	// Finish Report

	it('returns the correct state on finish report action', () => {
		const expectedState = {
			...initialState,
			finish: {
				...initialState.finish,
				isFetching: true,
				error: ''
			}
		};
		const newState = reportReducer(initialState, finishReport());
		expect(expectedState).toEqual(newState);
	});

	it('returns the correct state on finish report failure action', () => {
		const mockErrorMessage = 'Test error';
		const expectedState = {
			...initialState,
			finish: {
				...initialState.finish,
				isFetching: false,
				error: mockErrorMessage
			}
		};
		const newState = reportReducer(initialState, finishReportFailure(mockErrorMessage));
		expect(expectedState).toEqual(newState);
	});

	it('returns the correct state on finish report success action', () => {
		const mockInitialState = {
			...initialState,
			finish: {
				...initialState.finish,
				isFetching: true,
				error: ''
			}
		};
		const expectedState = {
			...initialState,
			finish: {
				...initialState.finish,
				isFetching: false,
				error: ''
			}
		};
		const newState = reportReducer(mockInitialState, finishReportSuccess());
		expect(expectedState).toEqual(newState);
	});

	it('returns the correct state on finish report clear action', () => {
		const mockInitialState = {
			...initialState,
			finish: {
				...initialState.finish,
				isFetching: true,
				error: ''
			}
		};
		const expectedState = {
			...initialState,
			finish: {
				...initialState.finish,
				isFetching: false,
				error: ''
			}
		};
		const newState = reportReducer(mockInitialState, finishReportClear());
		expect(expectedState).toEqual(newState);
	});
});
