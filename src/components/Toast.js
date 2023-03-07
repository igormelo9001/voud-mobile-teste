// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Animated,
    StyleSheet
} from 'react-native';

// VouD imports
import BrandText from './BrandText';
import TouchableNative from './TouchableNative';
import { colors } from '../styles';
import { toastStyles, dismissToast } from '../redux/toast';
import { getHasConfigError } from '../redux/selectors';

// Component
class Toast extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active: false
        };

        this._timeout = null;

        this._animValue = new Animated.Value(0);
        this._animValue.addListener(({ value }) => { this.setState({ active: value > 0 ? true : false }) });

        this._animOpacity = this._animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });

        this._animTop = this._animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [24, 0]
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.toast.active) {
            this._show();
            this._timeout = setTimeout(() => { this.props.dispatch(dismissToast()); }, 6000);
        }
        else {
            this._dismiss();
        }
    }

    componentWillUnmount() {
        if (this._timeout) clearTimeout(this._timeout);
    }

    _show = () => {
        Animated.timing(this._animValue, {
            toValue: 1,
            duration: 500
        }).start();
    };

    _dismiss = () => {
        if (this._timeout) clearTimeout(this._timeout);

        Animated.timing(this._animValue, {
            toValue: 0,
            duration: 250
        }).start(() => {
            if (this.props.onDismiss) this.props.onDismiss();
        });
    };

    _getStyle = () => {
        switch (this.props.toast.type) {
            case toastStyles.SUCCESS:
                return styles.success;
            case toastStyles.ERROR:
                return styles.error;
            default:
                return styles.default;
        }
    };

    render() {
        const { toast, hasConfigError } = this.props;

        const animStyle = {
            opacity: this._animOpacity,
            transform: [
                { translateY: this._animTop }
            ]
        };

        if (hasConfigError) return null;

        return (
            <Animated.View
                pointerEvents={this.state.active ? 'auto' : 'none'}
                style={StyleSheet.flatten([styles.container, animStyle])}
            >
                <TouchableNative
                    onPress={this._dismiss}
                    style={StyleSheet.flatten([styles.content, this._getStyle()])}
                >
                    <BrandText style={styles.text}>
                        {toast.message}
                    </BrandText>
                </TouchableNative>
            </Animated.View>
        );
    }
}

// Styles
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 8,
        right: 8,
        bottom: 8
    },
    content: {
        padding: 16,
        borderRadius: 2
    },
    default: {
        backgroundColor: colors.GRAY_DARKER
    },
    success: {
        backgroundColor: colors.BRAND_SUCCESS
    },
    error: {
        backgroundColor: colors.BRAND_ERROR
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        color: 'white'
    }
});

// Redux
const mapStateToProps = (state) => {
    return {
        toast: state.toast,
        hasConfigError: getHasConfigError(state)
    }
};

export default connect(mapStateToProps)(Toast);
