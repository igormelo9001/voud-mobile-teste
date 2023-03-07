import React          from 'react';
import { 
    View,
    StyleSheet
} from 'react-native';

// VouD imports
import BrandText       from '../../components/BrandText';
import { colors }      from '../../styles/constants';
import TouchableNative from '../../components/TouchableNative';

// Component
const ProfileInfoItem = ({ mainInfo, mainTextStyle, subInfo, left, right, style, onPress }) => {

    const renderLeft = () =>
        <View style={styles.leftContainer}>
            {left()}
        </View>;

    const renderRight = () =>
        <View style={styles.rightContainer}>
            {right()}
        </View>;

    const getMainTextStyle = () => StyleSheet.flatten([styles.mainInfo, mainTextStyle]);

    const renderMain = () => {
        if (Array.isArray(mainInfo)) {
            return mainInfo.map((info, i) => (
                <BrandText
                    style={getMainTextStyle()}
                    key={i}
                >
                    {info}
                </BrandText>
            ));
        }

        return <BrandText style={getMainTextStyle()}>{mainInfo}</BrandText>;
    };

    const ItemWrapper = onPress ? TouchableNative : View;

    return (
        <ItemWrapper
            onPress={onPress}
            style={StyleSheet.flatten([style, styles.mainContainer])}
        >
            { left ? renderLeft() : null }
            <View style={styles.centerContainer}>
                { renderMain() }
                { subInfo ? <BrandText style={styles.subInfo}>{subInfo}</BrandText> : null }
            </View>
            { right ? renderRight() : null }
        </ItemWrapper>
    );
}

// Styles
const styles = {
    mainContainer: {
        flex: 1,
        flexDirection: 'row',
		paddingHorizontal: 16,
		paddingVertical: 14
    },
    mainInfo: {
        color: colors.GRAY_DARKER,
        fontSize: 16,
        lineHeight: 20
    },
    subInfo: {
        color: colors.GRAY,
        fontSize: 14,
        lineHeight: 16,
        marginTop: 4
    },
    centerContainer: {
        flex: 1
    },    
    leftContainer: {
        marginRight: 32,
        justifyContent: 'center'        
    },
    rightContainer: {
        marginLeft: 8,
        justifyContent: 'center'
    }
}

export default ProfileInfoItem;