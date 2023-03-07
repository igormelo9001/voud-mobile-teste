import React, { Component } from "react";
import { View } from "react-native";

//Import Voud

import VoudText from "../../../../../../components/VoudText";
import Icon from "../../../../../../components/Icon";
import { adaptColor } from "../../../../../search-points-of-interest/utils/adapt-route-json";

import styles from "./style";

class StageTransit extends Component {

    constructor(props) {
        super(props)
    }

    _getHoursAndMinutesFromSeconds(durationInSeconds) {
        const hours = durationInSeconds / 3600;
        const minutes = (hours % 1) * 60;

        return {
            hours: Math.trunc(hours),
            minutes: Math.trunc(minutes),
        }
    }

    _getVehicleFromType = (type) => {
        switch(type){
            
            case "heavy_rail" :
                return "train";
            
            default :
            return type;
        }
    }


    render() {

        const { item, index } = this.props;
        const { line: { vehicle, shortName, color, textColor, name }, headsign, departureStop, arrivalStop, numStops } = item.transitDetails;
        const { hours, minutes } = this._getHoursAndMinutesFromSeconds(item.duration.inSeconds);
        const descriptionHour = hours ? `(${hours}h)` : `(${minutes} min)`;
        const titleColor = textColor === undefined ? "#000" :  adaptColor(textColor);
        const barColor = color === undefined ? "#8c8c8c" : adaptColor(color);
        const lineTitle = shortName === undefined ? name : "";

        return (

            <View style={[styles.container]} key={index}>
                <View style={[styles.containerIcon,]}>
                    <Icon name={this._getVehicleFromType(vehicle.type.toLowerCase())} style={styles.iconVoud} />
                </View>
                <View style={[styles.barStage, { backgroundColor: barColor }]}>
                    <View style={styles.line} />
                </View>

                <View style={styles.containerDescription}>
                    <View style={{ marginLeft: 15 }}>
                        <View style={{ marginTop: 0 }}>
                            <VoudText numberOfLines={2} style={styles.titleLine}>{departureStop.name}</VoudText>
                        </View>
                        <View style={[styles.containerDescriptionLine]}>
                            {!!shortName && 
                                <View style={[styles.descriptionLine,{backgroundColor: barColor }]}>
                                    <VoudText style={[styles.textLine, { color:  titleColor}]}>{shortName}</VoudText>
                                </View>
                            }

                            <View style={styles.textLineDescripiton}>
                                <VoudText style={styles.title}>{lineTitle}</VoudText>
                            </View>

                        </View>
                        <View style={styles.containerTrace}>
                            <View style={styles.trace}></View>
                        </View>
                        <View style={styles.descriptionOption}>
                            <VoudText style={styles.title}>{`A ${numStops} parada  ${descriptionHour}`}</VoudText>
                        </View>
                        <View style={styles.containerTrace}>
                            <View style={styles.trace}></View>
                        </View>
                        <View style={{ marginTop:25  }}>
                            <VoudText style={styles.titleLine}>{arrivalStop.name}</VoudText>
                        </View>

                    </View>
                </View>

            </View>
        )
    }
}


export default StageTransit;