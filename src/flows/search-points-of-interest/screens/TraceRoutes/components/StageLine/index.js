import React from "react";
import { View } from "react-native";

import styles from "./style";

const StageLine = (index) => (

    <View style={styles.container} key={index}>
        <View>
            <View style={styles.circle}/>
            <View style={styles.circle}/>
        </View>
        <View style={styles.line}/>
    </View>

);

export default StageLine;