import React from "react";
import { View } from "react-native";

//Import Voud
import VoudText from '../../../../../../components/VoudText';
import Icon from '../../../../../../components/Icon';
import StageLine from "../StageLine";

import styles from "./style";

const StageWalk = ({ description,index }) => (
    <View style={[styles.container]} key={index}>
        <Icon name="directions-walk" style={styles.iconVoud} />
        <VoudText style={styles.text} ellipsizeMode={'tail'}>{description}</VoudText>
       
    </View>  
);

export default StageWalk;