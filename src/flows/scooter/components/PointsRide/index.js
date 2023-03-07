import React, { PureComponent } from "react";

//3rd party components
import { Marker, Callout } from 'react-native-maps';
import RideTooltip from "./RideToolTip";

import scooActive from '../../image/scooActive.png';
import scooInactive from '../../image/scooInactive.png';

export default class PointsRide extends PureComponent {
    constructor(props) {
        super(props);
        this._tracksViewChanges = true;
    }
    componentDidUpdate() {
        this._tracksViewChanges = false;
    }

    _renderMarker = (data) => (

        data.map((item, index) => {
            return (
                <Marker key={index}
                    coordinate={{
                        latitude: item.latitude,
                        longitude: item.longitude,
                    }}
                    image={item.hasScooter ? scooActive : scooInactive}
                    tracksViewChanges={this._tracksViewChanges}
                >

                    <Callout tooltip>
                        <RideTooltip
                            item={item}
                            image={item.hasScooter ? scooActive : scooInactive}
                        />
                    </Callout>
                </Marker>
            )
        })
    )

    render() {
        const { data } = this.props;
        return (
            this._renderMarker(data)
        )
    }
}

