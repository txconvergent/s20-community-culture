import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import MapView from "react-native-maps";
import sample_markers from './sample_markers.json';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function App(){
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Camera') {
              return (
                <Image source={require('./icons/camera.png')} style={styles.icon}/>
              );
            } else if (route.name === 'Account') {
              return (
                <Image source={require('./icons/account.png')} style={styles.icon}/>
              );
            } else if (route.name === 'Map') {
              return (
                <Image source={require('./icons/account.png')} style={styles.icon}/>
              );
            } else if (route.name === 'Search'){
              return (
                <Image source={require('./icons/search.png')} style={styles.icon}/>
              );
            }
          },
        })}
        tabBarOptions={{
          style: styles.buttonRow,
          showLabel: false,
        }}
      >
        <Tab.Screen name="Account" component={AccountScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function CameraScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Camera</Text>
    </View>
  );
}

function AccountScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Account</Text>
    </View>
  );
}

function SearchScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Search</Text>
    </View>
  );
}

class MapScreen extends React.Component {

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
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#bdeaff',
    paddingBottom: 20,
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
