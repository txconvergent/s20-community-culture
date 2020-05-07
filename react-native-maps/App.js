import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, StatusBar} from 'react-native';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapView from 'react-native-maps';
import { Camera } from "expo-camera";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TitleScreen({navigation}) {
  return(
    <NavigationContainer independent = {true}>
      <View style={styles.container}>
          <StatusBar barStyle = "light-content"/>
          <TouchableOpacity onPress = {() => navigation.navigate('UserScreen')} >
            <Image
                style = {styles.logo}
                source = {require('./images/TitleLogo.png')}
                resizeMode = "contain"
            />
            <Text adjustsFontSizeToFit = {true}
                numberOfLines= {1}
                style = {styles.titleText}>PictureThis!</Text>
          </TouchableOpacity>
      </View>
    </NavigationContainer>
  );
}

function UserScreen({navigation}) {
  return (
    <NavigationContainer independent = {true}>
      <View style = {styles.container}>
        <Image
          style = {styles.loginLogo}
          source = {require('./images/PictureThisLogo.png')}
          resizeMode = 'contain'
        />
      </View>
      <Text style = {styles.userTitle}>PictureThis!</Text>
      <KeyboardAvoidingView behavior= "padding" style = {styles.container}>
        <StatusBar barStyle = "light-content"/>
        <TextInput
            style = {styles.input}
            placeholder = "username or email"
            placeholderTextColor = '#ffffff'
            returnKeyType = "next"
            onSubmitEditing = {() => this.password.focus()}
            keyboardType = "email-address"
            autoCapitalize="none"
            autoCorrect={false}
        />
        <TextInput
            style = {styles.input}
            placeholder = "password"
            placeholderTextColor = '#ffffff'
            secureTextEntry = {true}
        />
        <TouchableOpacity onPress ={() => navigation.navigate('TabScreen')} style = {styles.buttonContainer}>
          <Text style = {styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style = {styles.LoginSignUp}>
            <Text style = {styles.SignUpText}>Don't have an Account? </Text>
            <Text  onPress = {() => navigation.navigate('SignUpScreen')} style = {styles.SignUpButton}>Sign Up!</Text>
        </View>
      </KeyboardAvoidingView>
    </NavigationContainer>
  );
}

function SignUpScreen({navigation}) {
  return(
    <NavigationContainer independent = {true}>
      <View style = {styles.container}>
        <Image
          style = {styles.loginLogo}
          source = {require('./images/PictureThisLogo.png')}
          resizeMode = 'contain'
        />
      </View>
      <KeyboardAvoidingView behavior= "padding" style = {styles.container}>
        <StatusBar barStyle = "light-content"/>
        <TextInput
            style = {styles.input}
            placeholder = "first and last name"
            placeholderTextColor = '#ffffff'
            returnKeyType = "next"
            autoCapitalize="none"
            autoCorrect={false}
        />
         <TextInput
            style = {styles.input}
            placeholder = "username or email"
            placeholderTextColor = '#ffffff'
            returnKeyType = "next"
            keyboardType = "email-address"
            autoCapitalize="none"
            autoCorrect={false}
        />
        <TextInput
            style = {styles.input}
            placeholder = "password"
            placeholderTextColor = '#ffffff'
            secureTextEntry = {true}
        />
        <TouchableOpacity onPress ={() => navigation.navigate('TabScreen')} style = {styles.buttonContainer}>
          <Text style = {styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </NavigationContainer>
  );
}

function TabScreen({navigation}) {
  return (
    <NavigationContainer independent = {true}>
      <StatusBar barStyle = "light-content"/>
      <Tab.Navigator
        screenOptions = {({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'HotSpotScreen') {
              return (
                <Image source = {require('./images/fire.png')} style = {styles.icon} />
              );
            } else if (route.name === 'SettingsScreen') {
              return (
                <Image source = {require('./images/user.png')} style = {styles.icon}/>
              );
            } else if (route.name === 'CameraScreen') {
              return(
                <Image source = {require('./images/camera.png')} style = {styles.icon}/>
              );
            } else if (route.name === 'HomeScreen') {
                return(
                  <Image source = {require('./images/home.png')} style = {styles.icon}/>
                );
            }
          }
        })}
        tabBarOptions = {{
          style: styles.buttonRow,
          showLabel: false,
        }}
      >
        <Tab.Screen name = "HomeScreen" component = {MapPinContainer} />
        <Tab.Screen name = "HotSpotScreen" component = {HotSpotScreen} />
        <Tab.Screen name = "CameraScreen" component = {CameraNav} />
        <Tab.Screen name = "SettingsScreen" component = {SettingsScreen} />

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

function PhotoScreen({route}){
  console.log(route.params.uri);

  return (
    <Image
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      source={{
        isStatic: true,
        uri: route.params.uri
      }}
    />
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


function HotSpotScreen() {
  return (
    <ScrollView style={styles.pages}>
        <StatusBar barStyle = "light-content"/>
        <Image source = {require('./images/tower.jpg')} style = {styles.galleryImages}/>
        <Image source = {require('./images/nightTower.jpg')} style = {styles.galleryImages}/>
        <Image source = {require('./images/tower3.jpg')} style = {styles.galleryImages}/>
        <Image source = {require('./images/tower4.jpg')} style = {styles.galleryImages}/>
        <Image source = {require('./images/tower5.jpg')} style = {styles.galleryImages}/>
    </ScrollView>
  );
}

function PinScreen({ route, navigation }) {
  return (
    <>

      <View style={styles.ratingBar}>
        <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center'}}> {route.params.name}</Text>
        <Text style={{fontSize: 25, textAlign: 'center'}}>Rating: {route.params.rating}</Text>
      </View>

      <View style={{height:175}}>
        <ScrollView style={styles.pinImageGallery} horizontal={true} showsHorizontalScrollIndicator={false}>
          <Image source={require('./images/nightTower.jpg')} style={styles.pinImage}/>
          <Image source={require('./images/tower.jpg')} style={styles.pinImage}/>
        </ScrollView>
      </View>

      <ScrollView style={styles.commentFeed}>
        <View style={styles.comment}>
          <Text style={styles.pinCommentUsername}>@dannyp24 rates this 5.0</Text>
          <Text style={styles.pinCommentText}>Man, I love a good Tower pic</Text>
        </View>

        <View style={styles.comment}>
          <Text style={styles.pinCommentUsername}>@NotJimmyFallon rates this 5.0</Text>
          <Text style={styles.pinCommentText}>Couldn't care less about the tower. Sick fountain in front</Text>
        </View>

        <View style={styles.comment}>
          <Text style={styles.pinCommentUsername}>@GregFenves rates this 5.0</Text>
          <Text style={styles.pinCommentText}>I'm gonna work here forever!</Text>
        </View>

        <View style={styles.comment}>
          <Text style={styles.pinCommentUsername}>@BevoXV rates this 5.0</Text>
          <Text style={styles.pinCommentText}>It's so hard to type without opposable thumbs</Text>
        </View>

        <View style={styles.comment}>
          <Text style={styles.pinCommentUsername}>@GrandpaJoeTruther rates this 5.0</Text>
          <Text style={styles.pinCommentText}>Cool tower. But don't let it distract you from the fact that Grandpa Joe in Charlie and the Chocolate Factory pretended to be bedridden until Charlie found the golden ticket</Text>
        </View>
      </ScrollView>
    </>
  );
}

function MapPinContainer(){
  return (
    <Stack.Navigator  screenOptions={{ headerShown: false  }}>
      <Stack.Screen name="Map" component={MapScreen} options={({ route }) => ({title: "Picture This!"})}/>
      <Stack.Screen name="Pin" component={PinScreen} options={({ route }) => ({ title: route.params.name })}/>
    </Stack.Navigator>
  );
}

function SettingsScreen() {
  return(
    <View style={styles.pages}>
        <StatusBar barStyle = "light-content"/>
        <View style = {styles.rectangle}>
          <Text styles = {styles.settingsText}>PROFILE</Text>
        </View>
        <View style = {styles.rectangle}>
          <Text styles = {styles.settingsText}>NOTIFICATIONS</Text>
        </View>
        <View style = {styles.rectangle}>
          <Text styles = {styles.settingsText}>HELP CENTER</Text>
        </View>

    </View>
  );
}

export default function App() {
  return(
    <NavigationContainer independent = {true}>
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName = "Home">
        <Stack.Screen name = "TitleScreen" component = {TitleScreen} />
        <Stack.Screen name = "UserScreen" component = {UserScreen} />
        <Stack.Screen name = "TabScreen" component = {TabScreen} />
        <Stack.Screen name = "SignUpScreen" component = {SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

class MapScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      markers: [],
      currRegion: {
        latitude: 30.267032,
        longitude: -97.742209,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      press: {
        latitude: 0,
        longitude: 0,
      },
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
          initialRegion={{
            latitude: 30.267032,
            longitude: -97.742209,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}

          onRegionChangeComplete = {(region) => {
            this.setState({
              currRegion: region,
            })
          }}

          onPress = {e => {
            console.log("Press logged");
            this.setState({
              press: {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              }},
              () => {
                this.fetchMarkerData();
            });
          }}
        >

      { this.state.isLoading ? null : this.state.markers.map((marker, index) => {
        const coords = {
           latitude: marker.location.coordinates[1],
           longitude: marker.location.coordinates[0],
         };

       const descrip = `User Rating: ${marker.rating}`;

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
              pinColor={'red'}
           />
       );
        })}

      </MapView>
    );
  }


  componentDidMount() {
    // this.fetchMarkerData();
  }

  fetchMarkerData() {
    const degreeLatInMeters = 111120;
    const radius = degreeLatInMeters * (this.state.currRegion.latitudeDelta + this.state.currRegion.longitudeDelta) / 2;
    const link = 'https://peaceful-falls-21154.herokuapp.com/post/search_nearby?lon=' +
      this.state.press.longitude.toString() + '&lat=' + this.state.press.latitude.toString() + '&dist=' + radius;
    console.log(link);
    fetch(link, {
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
  //general page style guidelines
  container: {
    flex: 1,
    backgroundColor: '#aa192f',
    justifyContent: "center",
    alignItems: 'center',
  },
  //title page
  titleText: {
    fontSize : 50,
    fontWeight : '500',
    paddingLeft: 25,
    color: "#ffffff",
    paddingBottom: 250,
    textShadowColor: '#880E4F',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },

  logo: {
    flex: 1,
    height: 150,
    width: 300,
    top: 100,
  },

  //Login Screen
  loginLogo: {
    flexGrow: 1,
    width: 300,
  },

  userTitle: {
    fontSize: 50,
    fontWeight: '500',
    paddingBottom: 70,
    paddingLeft: 90,
    backgroundColor: '#aa192f',
    alignItems: 'center',
    color: 'white',

  },

  input: {
    height: 60,
    width: 300,
    fontSize: 16,
    backgroundColor: '#EF9A9A',
    color: 'white',
    paddingHorizontal: 20,
    marginBottom: 30,
    borderRadius: 50,
  },

  buttonContainer: {
    backgroundColor: "#E57373",
    width: 200,
    height: 40,
    paddingVertical: 5,
    borderRadius: 50,
  },

  buttonText: {
    fontSize: 24,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
    fontWeight: '500',
    color: '#ffffff'
  },

  LoginSignUp: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: 16,
    flexDirection: 'row',
  },

  SignUpText: {
    color: 'white',
    fontSize: 16,
    textShadowColor: '#000',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
  },

  SignUpButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
  },

  //Tab Navigation
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#aa192f',
    height: 65,
  },

  icon: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },

  pages: {
    flex: 1,
    backgroundColor: '#EF9A9A',
  },

  titleLogo: {
    width: 150,
    marginBottom: 250,
  },

  galleryImages: {
    flexDirection: 'row',
    width: 450,
    marginVertical: 2,
    height: 200
  },

  rectangle: {
    flexDirection: 'row',
    width: 380,
    height: 150,
    backgroundColor: '#E57373',
    marginVertical: 25,
    marginHorizontal: 15,
    borderRadius: 10,
  },

  ratingBar: {
    paddingBottom: 10,
    paddingTop: 20,
  },

  pinImageGallery: {
    flex: 1,
    paddingBottom: 10,
  },

  pinImage: {
    justifyContent: 'center',
    flexDirection: 'row',
    width: 300,
    height: 175,
  },

  commentFeed: {
    paddingTop: 0,
    backgroundColor: 'white',
  },

  comment: {
    paddingTop: 0,
    paddingBottom: 5,
    paddingLeft: 10,
    marginBottom: 2,
    backgroundColor: '#faeded',
  },

  pinCommentUsername: {
    fontSize: 15,
    paddingTop: 10,
    fontWeight: 'bold',
  },

  pinCommentText: {
    fontSize: 15,
    paddingBottom: 10,
  }

});
