const reduxform = {
	change: jest.fn(),
	reduxForm: () => jest.fn(),
	Field: () => ({}),
	untouch: () => jest.fn(),
	touch: () => jest.fn(),
	formValueSelector: () => jest.fn()
};
export const { change, reduxForm, Field, untouch, touch, formValueSelector } = reduxform;
