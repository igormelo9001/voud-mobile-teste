// NPM imports
import React from 'react';
import {
    Image,
    StyleSheet,
    View
} from 'react-native';

// VouD imports
import { colors } from '../../styles';

// Images
const helpImageUp = require('../../images/card-helpers/up.png');
const helpImagePic = require('../../images/card-helpers/pic.png');
const helpImageDown = require('../../images/card-helpers/down.png');

// Constants
export const helperTypes = {
    BOM: 1,
    BOM_WITH_PIC: 2,
    BOM_PLUS: 3
};

// Component
const AddCardHelper = ({ style, type }) => {

    const getImageSource = () => {
        switch (type) {
            case helperTypes.BOM_WITH_PIC:
                return helpImagePic;
            case helperTypes.BOM_PLUS:
                return helpImageDown;
            default: // case helperTypes.BOM:
                return helpImageUp;
        }
    };

    const getImageStyle = () => {
        switch (type) {
            case helperTypes.BOM_WITH_PIC:
                return styles.bomWithPic;
            case helperTypes.BOM_PLUS:
                return styles.bomPlus;
            default: // case helperTypes.BOM:
                return styles.bom;
        }
    };

    return (
        <View style={StyleSheet.flatten([styles.container, style])}>
            <Image
                source={getImageSource()}
                style={getImageStyle()}
            />
        </View>
    )
};

// Styles
const styles = StyleSheet.create({
    container: {
        height: 64,
        borderWidth: 1,
        borderColor: colors.GRAY_LIGHT,
        borderRadius: 2
    },
    bom: {
        position: 'absolute',
        top: 4,
        right: 4
    },
    bomWithPic: {
        position: 'absolute',
        right: 4,
        bottom: 10
    },
    bomPlus: {
        position: 'absolute',
        bottom: 8,
        left: 16
    }
});

export default AddCardHelper;
