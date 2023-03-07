// NPM imports
import React from 'react';
import { StyleSheet } from 'react-native';
// import { MKProgress } from 'react-native-material-kit';

// VouD imports
import { colors } from '../styles';
import MKIndeterminateProgress from './MKIndeterminateProgress';

// Component
const Progress = ({ style, withHeight }) => {
    return (
        <MKIndeterminateProgress
            style={StyleSheet.flatten([styles.progress, withHeight ? { marginBottom: 0 } : {}, style])}
            progressColor={colors.BRAND_SECONDARY}
            progressAniDuration={1000}
        />
    );
}

// Styles
const styles = StyleSheet.create({
    progress: {
        alignSelf: 'stretch',
        height: 4,
        marginBottom: -4,
        backgroundColor: colors.BRAND_PRIMARY_DARKER
    }
});

export default Progress;
