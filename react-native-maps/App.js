import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import sample_markers from './sample_markers.json';

export default class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      markers: [],
    };
  }

  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        provider="google"
        region={{
          latitude: 40.76727216,
          longitude: -73.99392888,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {this.state.isLoading ? null : this.state.markers.map((marker, index) => {
      const coords = {
         latitude: marker.latitude,
         longitude: marker.longitude,
     };

     const descrip = `Time Status: ${marker.timeStatus}\n
                      User Rating: ${marker.userRating}\n
                      Address: ${marker.stAddress}\n
                      Top comment: ${marker.topComment}`;

     return (
         <MapView.Marker
            key={index}
            coordinate={coords}
            title={marker.attractionName}
            description={descrip}
         />
     );
      })}
    </MapView>
    );
  }

  componentDidMount() {
    this.fetchMarkerData();
  }

  fetchMarkerData() {
    this.setState({
      isLoading: false,
      markers: sample_markers.attractionList,
    });

    }
};
