// NPM imports
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, SectionList } from 'react-native';

// VouD imports
import InfoListItem from '../../components/InfoList/InfoListItem';

// Component
const QuestionsList = ({ itemList, onPress }) => {

    const _mapListToSections = () => {
        return itemList
            .map(section => {
                const items = section.items ? [...section.items] : [];

                return {
                    data: items.map((item, i) => {
                        return {
                            ...item,
                            row: i + 1
                        };
                    }),
                    title: section.name,
                    id: section.id
                };
            })
            .filter(section => section.data.length > 0);
    }

    const _renderSectionHeader = ({ section }) => {
        return (
            <InfoListItem 
                itemContent={section.title}
                isHeader
            />
        );
    };

    const _getRowStyles = (row, sectionLength) => {
        const isFirst = row === 1;
        const isLast = row === sectionLength;

        let rowStyles = [];
        if (isFirst) rowStyles.push(styles.firstRow);
        if (isLast) rowStyles.push(styles.lastRow);

        return StyleSheet.flatten(rowStyles);
    };

    const _renderItem = ({ item, section }) => {
        return (
            <InfoListItem
                style={_getRowStyles(item.row, section.data.length)}
                itemContent={item.question}
                onPress={() => onPress(item.id)}
            />
        );
    };

    return (
        <SectionList
            renderItem={_renderItem}
            renderSectionHeader={_renderSectionHeader}
            sections={_mapListToSections()}
            keyExtractor={(item) => item.id}
        />
    );
}

// Prop types
QuestionsList.propTypes = {
    itemList: PropTypes.array.isRequired
};

// Styles
const styles = {
    container: {
		paddingTop: 8,
        paddingBottom: 16
    },
    denseContainer: {
		paddingTop: 4,
    },
    firstRow: {
        marginTop: 8
    },
    lastRow: {
        marginBottom: 16
    }
};

export default QuestionsList;
