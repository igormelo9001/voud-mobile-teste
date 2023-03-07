import React, { Component } from 'react';
import debounce from 'lodash.debounce';

export const withPreventDoubleTap = (WrappedComponent) => {

	class WithPreventDoubleTap extends Component {

		debouncedOnPress = () => {
			this.props.onPress && this.props.onPress();
		};

		onPress = debounce(this.debouncedOnPress, 300, { leading: true, trailing: false });

		render() {
			return <WrappedComponent {...this.props} onPress={this.onPress} />;
		}
	}

	WithPreventDoubleTap.displayName = `withPreventDoubleTap(${WrappedComponent.displayName || WrappedComponent.name})`;
	return WithPreventDoubleTap;
};
