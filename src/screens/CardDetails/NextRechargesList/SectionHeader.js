import React          from 'react';
import { View } from 'react-native';

// VouD imports
import { colors } from '../../../styles';

// Group imports
import SystemText from '../../../components/SystemText';

const NextRechargeSectionHeader = ({ title, isFirst }) => {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.sectionHeaderContainer}>
                <SystemText style={styles.sectionHeader}>{title}</SystemText>
            </View>
        </View>
    );
}

const styles = {
    mainContainer: {
        flexDirection: 'row',
    },
    sectionHeaderContainer: {
        marginTop: 24,
        marginBottom: 8,
        marginLeft: 16,

    },
    sectionHeader: {
        color: "#A3A3A3",
        fontWeight: 'bold',
        fontSize: 14
    }
}

export default NextRechargeSectionHeader;
