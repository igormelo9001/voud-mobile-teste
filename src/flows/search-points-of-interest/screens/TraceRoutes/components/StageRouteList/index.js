import React, { Component } from 'react';
import { View } from 'react-native';

import moment from 'moment';

//Import Voud

import StageRouteItemStartEnd from "../StageRouteItemStartEnd";
import StageLine from "../StageLine";
import StageWalk from "../StageWalk";
import StageTransit from "../StageTransit";
import VoudText from "../../../../../../components/VoudText";

import styles from "./style";

class StageRouteList extends Component {
  constructor(props) {
    super(props);
  }

    _formatFare(fare) {
    if(!fare) return '-';
    return String(fare.value.toFixed(2)).replace('.',',');
    }

    _getHoursAndMinutesFromSeconds(durationInSeconds) {

        const hours = durationInSeconds / 3600;
        const minutes = (hours % 1) * 60;

        return {
            hours: Math.trunc(hours),
            minutes: Math.trunc(minutes),
        }
    }
    _getkilometersAndMetersFromDistance(distance){
        const kilometers = (distance.inMeters > 1000) ? distance.inMeters / 1000 : 0;
        const meters = distance.inMeters;

        return {
            kilometers ,
            meters 
        }
    }

    _stageWalk(item,index) {
      
        const {hours, minutes} = this._getHoursAndMinutesFromSeconds(item.duration.inSeconds);
        const {kilometers, meters} = this._getkilometersAndMetersFromDistance(item.distance);

        let description = '';

         if(item.distance.inMeters === 0){
            description = 'Baldeação';
         } else {

            let descriptionHour = '';
    
            if(hours === 0 && minutes === 0 && item.distance.inMeters > 0){
                descriptionHour = `Ande ${item.duration.humanReadable}`;
            } else {
                descriptionHour = hours ? ` Ande ${hours}h` : `Ande ${minutes} min`;
           
            }

            const descriptionKm = kilometers ? `(${ String(kilometers.toFixed(1)).replace('.',',')} km)` : `(${meters} m)`;

            description = `${descriptionHour} ${descriptionKm}`;
         }

        return (
           <View key={index}>
            <StageWalk key={index} description = {description}/>
            <StageLine index={index}/>
           </View> 
        )
    }

    getHourFromDepartureTime = (hour,min) => {
        return moment(new Date().setHours(hour,min)).format('HH:mm')
    }

    getHourFromArrivalTime = (hour, min, inSeconds) => {
        return moment(new Date().setHours(hour,min)).add(inSeconds,'seconds').format('HH:mm');
    }
  
    render() {
      const {item} = this.props;
      const {steps, startAddress, endAddress, departureTime, arrivalTime, duration} = item.legs[0];
      const departureTimeHour = this.getHourFromDepartureTime(departureTime[3],departureTime[4]);
      const arrivalTimeHour = this.getHourFromArrivalTime(departureTime[3],departureTime[4],duration.inSeconds);   

      return (

        <View style={styles.container}>
            <StageRouteItemStartEnd address={startAddress} hourNow={departureTimeHour}/>
            <StageLine/>

            {steps.map((item, index) => {
                if(item.travelMode === "WALKING") {
                    return (this._stageWalk(item,index))
                }  
                
                if(item.travelMode === "TRANSIT"){
                    return ( 
                            <View key={index}>
                                <StageTransit item={item} index={index}/>
                                <StageLine index={index}/>     
                            </View>
                    )

                }

            })}
      
            <StageRouteItemStartEnd address={endAddress} hourNow={arrivalTimeHour}/>
        </View>
    
    );
  }
}

export default StageRouteList;
