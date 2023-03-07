import React from "react";
import {View,} from "react-native";
import styles from './style';

import VoudText from '../../../../../../components/VoudText';
import Icon from '../../../../../../components/Icon';

const StageRouteItemStartEnd = ({ address, hourNow }) => (
    
    <View style={styles.container}>
        <Icon name="pin" style={styles.iconLocation} color="#6e3e91"/>
        <View style={styles.containerAddress}>
            <VoudText numberOfLines={3} style={styles.textAddress}>{address}</VoudText>
        </View>
        <VoudText style={styles.textHour}>{hourNow}</VoudText>
    </View>
);

export default StageRouteItemStartEnd;