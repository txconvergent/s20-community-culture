import * as React from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, StatusBar, ImageBackground} from 'react-native';
import {KeyboardAvoidingView, ScrollView} from 'react-native';
import {NavigationContainer, TabActions} from '@react-navigation/native';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Constants from 'expo-constants';

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
      <KeyboardAvoidingView behavior= "padding" style = {styles.container}>
        <StatusBar barStyle = "light-content"/>
        {/* <Image 
          source = {require('./images/PictureThisLogo.png')} 
          style = {styles.titleLogo}
          resizeMode = 'contain'
        /> */}
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
          <Text style = {styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </NavigationContainer>
  );
}

function TabScreen({navigation}) {
  return (
    <NavigationContainer independent = {true}>
      <StatusBar barStyle = "dark-content"/>
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
        <Tab.Screen name = "HomeScreen" component = {HomeScreen} />
        <Tab.Screen name = "HotSpotScreen" component = {HotSpotScreen} />
        <Tab.Screen name = "CameraScreen" component = {CameraScreen} />
        <Tab.Screen name = "SettingsScreen" component = {SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


function HomeScreen() {
  return (
    <View style={styles.pages}>
        <StatusBar barStyle = "light-content"/>
        <Image source = {require('./images/menu.jpg')} style = {styles.menuIcon}/>
        <Text 
          style = {{
            marginVertical: 250,
            marginHorizontal: 60,
            fontSize: 50}}>HOME PAGE</Text>
    </View>
  );
}

function HotSpotScreen() {
  return (
    <ScrollView style={styles.pages}>
        <StatusBar barStyle = "dark-content"/>
        <Image source = {require('./images/tower.jpg')} style = {styles.galleryImages}/>
        <Image source = {require('./images/nightTower.jpg')} style = {styles.galleryImages}/>
        <Image source = {require('./images/tower3.jpg')} style = {styles.galleryImages}/>
        <Image source = {require('./images/tower4.jpg')} style = {styles.galleryImages}/>
        <Image source = {require('./images/tower5.jpg')} style = {styles.galleryImages}/>
    </ScrollView>
  );
}

function CameraScreen() {
  return(
    <View style={styles.pages}>
        <StatusBar barStyle = "light-content"/>
        <Text 
          style = {{
            marginVertical: 250,
            marginHorizontal: 30,
            fontSize: 50}}>CAMERA PAGE</Text>
    </View>
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

function App() {
  return(
    <NavigationContainer independent = {true}>
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName = "Home">
        <Stack.Screen name = "TitleScreen" component = {TitleScreen} />
        <Stack.Screen name = "UserScreen" component = {UserScreen} />
        <Stack.Screen name = "TabScreen" component = {TabScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#C2185B',
    justifyContent: "center",
    alignItems: 'center',
  },

  titleText: {
    fontSize : 50,
    fontWeight : '500',
    fontFamily: "Times New Roman",
    paddingLeft: 25,
    color: "#ffffff",
    paddingBottom: 250,
  },

  logo: {
    flex: 1,
    height: 150,
    width: 300,
    top: 100,
  },

  input: {
    height: 60,
    width: 250,
    backgroundColor: '#EF9A9A',
    //text input color -> need to change
    color: 'white',
    paddingHorizontal: 20,
    marginBottom: 40,
    borderRadius: 10,
  },

  buttonContainer: {
    backgroundColor: "#E57373",
    width: 125,
    height: 40,
    paddingVertical: 5,
  },

  buttonText: {
    fontSize: 25,
    textAlign: 'center',
    fontFamily: 'Times New Roman',
    fontWeight: '500',
    color: '#ffffff'
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#C2185B',
    height: 75,
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

  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    margin: 20,
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

  
});

export default App;
