import React          from 'react';
import { View } from 'react-native';
import PropTypes      from 'prop-types';

// VouD imports
import { colors } from '../../../styles';

// Group imports
import CardStatementTimeline from './Timeline';
import SystemText from '../../../components/SystemText';

const CardStatementSectionHeader = ({ title, isFirst }) => {

    return (
        <View style={styles.mainContainer}>
            {/* <CardStatementTimeline isTransparent={isFirst}/> */}
            <View style={styles.sectionHeaderContainer}>
                <SystemText style={styles.sectionHeader}>{title}</SystemText>
            </View>
        </View>
    );
}

const styles = {
    mainContainer: {
        flexDirection: 'row'
    },
    sectionHeaderContainer: {
        marginTop: 24,
        marginBottom: 8
    },
    sectionHeader: {
        color: "#A3A3A3",
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 16,
    }
}

// prop types
CardStatementSectionHeader.propTypes = {
    title: PropTypes.string.isRequired,
};

export default CardStatementSectionHeader;
