// NPM imports
import React from 'react';

import {
    StyleSheet,
    View
} from 'react-native';

// VouD imports
import BrandText       from '../../components/BrandText';
import Icon from '../../components/Icon';
import TouchableNative from '../../components/TouchableNative';
import { colors }      from '../../styles';
import getIconName     from '../../utils/get-icon-name';

// component
const MenuItem = ({ text, icon, onPress, isSecondary }) => {
    return onPress ?
    (
        <TouchableNative
            onPress={onPress}
            style={styles.container}
        >
            <Icon
                style={(!isSecondary ? styles.icon : styles.iconSecondary)}
                name={getIconName(icon)}
            />
            <BrandText style={styles.text}>
                {text}
            </BrandText>
        </TouchableNative>
    ) :
    (
        <View style={styles.container} >
            <Icon
                style={StyleSheet.flatten([styles.icon, styles.iconNoTouch])}
                name={getIconName(icon)}
            />
            <BrandText style={StyleSheet.flatten([styles.text, styles.textNoTouch])}>
                {text}
            </BrandText>
        </View>
    );
};

// styles
const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        paddingHorizontal: 16
    },
    icon: {
        width: 24,
        marginRight: 16,
        fontSize: 24,
        textAlign: 'center',
        color: colors.BRAND_SECONDARY
    },
    iconSecondary: {
        width: 24,
        marginRight: 16,
        fontSize: 24,
        textAlign: 'center',
        color: colors.BRAND_PRIMARY_LIGHTER
    },
    iconNoTouch: {
        color: colors.BRAND_PRIMARY_LIGHTER
    },
    text: {
        flex: 1,
        fontSize: 16,
        color: 'white'
    },
    textNoTouch: {
        opacity: 0.75
    }
});

export default MenuItem;
