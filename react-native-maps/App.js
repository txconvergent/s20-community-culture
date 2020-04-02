import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
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
      <>
        <MapView
          style={{ flex: 1 }}
          provider="google"
          region={{
            latitude: 30.267032,
            longitude: -97.742209,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {this.state.isLoading ? null : this.state.markers.map((marker, index) => {
        const coords = {
           latitude: marker.latitude,
           longitude: marker.longitude,
       };

       const descrip = `Time Status: ${marker.timeStatus}\nUser Rating: ${marker.userRating}\nAddress: ${marker.stAddress}\nTop comment: ${marker.topComment}`;

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

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button}>
          <Image source={require('./icons/account.png')} style={styles.icon}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Image source={require('./icons/camera.png')} style={styles.icon}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Image source={require('./icons/search.png')} style={styles.icon}/>
        </TouchableOpacity>
      </View>

    </>
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

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#bdeaff',
  },
  button: {
    bottom: 0,
    backgroundColor: '#bdeaff',
    padding: 5,
  },
  icon: {
    width: 50,
    height: 50,
  }
});
