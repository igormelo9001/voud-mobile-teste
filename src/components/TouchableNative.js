// NPM imports
import React     from 'react';
import PropTypes from 'prop-types';

import {
    Platform,
    TouchableNativeFeedback,
    TouchableOpacity,
    View
} from 'react-native';

// VouD imports
import { withPreventDoubleTap } from './WithPreventDoubleTap';

// Andriod component
const NativeFeedbackMD = ({ onPress, borderless, style, children }) => {
    const background = Platform['Version'] >= 21 ?
        TouchableNativeFeedback.Ripple('rgba(0,0,0,0.5)', !!borderless) :
        TouchableNativeFeedback.SelectableBackground();

    return (
        <TouchableNativeFeedback
            background={background}
            onPress={onPress}
        >
            <View style={style}>
                {children}
            </View>
        </TouchableNativeFeedback>
    );
};

// iOS component
const NativeFeedbackIOS = ({ onPress, style, children }) => {
    return (
        <TouchableOpacity
            style={style}
            onPress={onPress}
        >
            {children}
        </TouchableOpacity>
    );
};

// main component
const DefaultTouchableNativeContainer = Platform.OS === 'ios' ? NativeFeedbackIOS : NativeFeedbackMD;
const PreventDoubleTapHOC = withPreventDoubleTap(DefaultTouchableNativeContainer);

const TouchableNative = ({ onPress, style, borderless, children, disablePreventDoubleTap }) => {
    
    const Container = disablePreventDoubleTap ? DefaultTouchableNativeContainer : PreventDoubleTapHOC;

    return (
        <Container
            onPress={onPress}
            style={style}
            borderless={borderless}
        >
            { children }
        </Container>
    );
};

// prop types
TouchableNative.propTypes = {
    onPress: PropTypes.func.isRequired,
    style: PropTypes.oneOfType([ PropTypes.object, PropTypes.number ]),
    children: PropTypes.node.isRequired
};

export default TouchableNative;
