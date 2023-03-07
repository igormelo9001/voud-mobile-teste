import React from 'react';
import { View, StyleSheet } from 'react-native';

// VouD imports
import { colors }      from '../../../styles';
import Icon from '../../../components/Icon';

// Component
const CardStatementTimeline = ({ icon, isFirst, isLast, isTransparent }) => {

    const getTimelineStyles = () => {
        let timelineStyles = [styles.timeline];

        // if (isFirst) timelineStyles.push(styles.firstTimeline);
        // if (isLast) timelineStyles.push(styles.lastTimeline);
        // if (isTransparent || (isFirst && isLast)) timelineStyles.push(styles.transparent);

        return StyleSheet.flatten(timelineStyles);
    }

    const renderIcon = () => {
        if (icon) {
            return (
                <View style={styles.entryIcon}>
                    <Icon
                        name={icon}
                        size={24}
                        color={colors.BRAND_SECONDARY_DARKER}
                    />
                </View>
            );
        }
    }

    return (
        <View style={styles.timelineContainer}>
            <View style={getTimelineStyles()}></View>
            {renderIcon()}
        </View>
    );
}

const timelineIconTopOffset = 28;

const styles = {
    timelineContainer: {
        position: 'relative',
        width: 56
    },
    entryIcon: {
        position: 'absolute',
        backgroundColor: 'white',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        top: timelineIconTopOffset,
        left: '50%',
        marginLeft: -20,
        borderRadius: 20
    },
    timeline: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '50%',
        borderLeftColor: colors.BRAND_PRIMARY,
        borderLeftWidth: 1,
    },
    firstTimeline: {
        top: timelineIconTopOffset,
    },
    lastTimeline: {
        height: timelineIconTopOffset,
        bottom: 'auto',
    },
    transparent: {
        borderLeftColor: 'transparent'
    }
}

export default CardStatementTimeline;
