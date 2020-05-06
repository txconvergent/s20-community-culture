import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground } from "react-native";
import MapView from "react-native-maps";
import sample_markers from './sample_markers.json';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Camera } from "expo-camera";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
            } else if (route.name === 'MapContainer') {
              return (
                <Image source={require('./icons/mapicon.png')} style={styles.icon}/>
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
        <Tab.Screen name="MapContainer" component={MapPinContainer} />
        <Tab.Screen name="Camera" component={CameraNav} />
        <Tab.Screen name="Search" component={SearchScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function CameraNav() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="CameraScreen" component={CameraScreen}/>
        <Stack.Screen name="PhotoScreen" component={PhotoScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function PhotoScreen({route, navigation}){
  var formData = new FormData();
  formData.append("title", "0");
  formData.append("lat", "1");
  formData.append("lon", "2");
  formData.append('attraction_img', {
    uri: route.params.uri,
    name: 'file.jpg'
  });

  return (
    <ImageBackground
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      source={{
        isStatic: true,
        uri: route.params.uri
      }}>
      <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              console.log("Submit Photo");
              console.log(formData);
              fetch('https://peaceful-falls-21154.herokuapp.com/post/create/', {
                method: 'POST',
                body: formData
              })
              .then(response => {
                return JSON.stringify(response);
              })
              .then(result => {
                console.log('Success:', result);
              })
              .catch(error => {
                console.error(error);
              })
              navigation.pop();
            }
          }
        >
        <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Submit </Text>
      </TouchableOpacity>
    </ImageBackground>
    
  );
}

function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={ref=>{
          this.camera = ref;
        }}
        style={{ flex: 1 }}
        type={type}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={async () => {
              if (this.camera) {
                let photo = await this.camera.takePictureAsync();
                console.log(photo);
                navigation.navigate("PhotoScreen", {uri: photo.uri});
              }
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Take Picture </Text>
          </TouchableOpacity>

        </View>
      </Camera>
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

function PinScreen({ route, navigation }) {
  return (
    <>
      <View style={styles.ratingBar}>
        <Text>Rating: {route.params.rating}</Text>
      </View>

      <View style={styles.imagesFeed}>
        <Text>You clicked Pin ID: {route.params.pinId}</Text>
      </View>
    </>
  );
}

function MapPinContainer(){
  return (
    <Stack.Navigator  screenOptions={{ headerShown: true  }}>
      <Stack.Screen name="Map" component={MapScreen} options={({ route }) => ({title: "Picture This!"})}/>
      <Stack.Screen name="Pin" component={PinScreen} options={({ route }) => ({ title: route.params.name })}/>
    </Stack.Navigator>
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
        <MapView
          style={{ flex: 1 }}
          provider="google"
          mapType="hybrid"
          showsMyLocationButton
          showsUserLocation
          region={{
            latitude: 30.267032,
            longitude: -97.742209,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >

      { this.state.isLoading ? null : this.state.markers.map((marker, index) => {
        const coords = {
           latitude: marker.location.coordinates[1],
           longitude: marker.location.coordinates[0],
         };

       const descrip = `User Rating: ${marker.rating}\nDate Created: ${marker.date_created}`;

       return (
           <MapView.Marker
              onPress={() => {
                this.props.navigation.push('Pin', {
                  pinId: marker._id.$oid,
                  name: marker.title,
                  rating: marker.rating,
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                });
              }}
              key={index}
              coordinate={coords}
              title={marker.title}
              description={descrip}
              pinColor={'blue'}
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
    fetch('https://peaceful-falls-21154.herokuapp.com/posts', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(json => {
        this.setState({
          isLoading: false,
          markers: json,
        });
      })
      .catch(error =>{
        console.error(error);
      })
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  icon: {
    width: 40,
    height: 40,
  },
  ratingBar: {
    height: 20,
  },
  imagesFeed: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
