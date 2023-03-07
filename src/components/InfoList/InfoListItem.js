// NPM imports
import React from 'react';
import { View, StyleSheet } from 'react-native';

// VouD imports
import { colors } from '../../styles';
import BrandText from '../BrandText';
import NotificationBadge from '../NotificationBadge';
import TouchableNative from '../TouchableNative';

const InfoListItem = ({ itemContent, style, onPress, isHeader, dense, badge, ...props }) => {

    const getContainerStyles = () => {
        let containerStyles = [style, styles.container];
        if (isHeader) containerStyles.push(styles.headerContainer);
        else if (dense) containerStyles.push(styles.denseContainer);
        return StyleSheet.flatten(containerStyles);
    };

    const getTextStyles = () => {
        let textStyles = [styles.text];
        if (isHeader) textStyles.push(styles.headerText);
        else if (dense) textStyles.push(styles.denseText);
        return StyleSheet.flatten(textStyles);
    };
    
    const ItemWrapper = onPress ? TouchableNative : View;

    return (
        <ItemWrapper
            onPress={onPress}
            style={getContainerStyles()}
            {...props}
        >
            <View style={styles.mainContainer}>
                {
                    typeof itemContent === 'string' ?
                        <BrandText style={getTextStyles()}>{itemContent}</BrandText> :
                        itemContent()
                }
            </View>
            { badge && +badge > 0 ? <NotificationBadge count={badge}/> : null }
        </ItemWrapper>
    )
}

const styles = {
    headerContainer: {
        backgroundColor: colors.GRAY_LIGHTER,
        paddingVertical: 12
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.BRAND_PRIMARY
    },
    container: {
        flex: 1,
        flexDirection: 'row',
		paddingHorizontal: 16,
		paddingVertical: 14
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    text: {
        fontSize: 16,
        lineHeight: 20,
        color: colors.GRAY_DARKER,
    },
    denseContainer: {
		paddingVertical: 12
    },
    denseText: {
        fontSize: 13,
	    lineHeight: 16
    }
};

export default InfoListItem;
