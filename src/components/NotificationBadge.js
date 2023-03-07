// NPM imports
import React from 'react';
import { 
    View,
    StyleSheet
} from 'react-native';

// VouD imports
import { colors } from '../styles/constants';
import SystemText from './SystemText';

// component
const NotificationBadge = ({ count }) => {
    return (
        <View style={styles.badge}>
            <SystemText style={styles.count}>{count}</SystemText>
        </View>
    )
};

const styles = StyleSheet.create({
    badge: {
        backgroundColor: colors.BRAND_ERROR,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 2
    },
    count: {
        color: 'white',
        fontSize: 14,
        lineHeight: 16
    },
});

export default NotificationBadge;
