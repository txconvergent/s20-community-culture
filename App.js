import * as React from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity} from 'react-native';
import {KeyboardAvoidingView, StatusBar} from 'react-native';
import {NavigationContainer, TabActions} from '@react-navigation/native';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TitleScreen({navigation}) {
  return(
    <NavigationContainer independent = {true}>
      <View style={styles.container}>
          <TouchableOpacity onPress = {() => navigation.navigate('UserScreen')} >
            <Text 
                adjustsFontSizeToFit = {true}
                numberOfLines= {1}
                style = {styles.titleText}>PictureThis!
              </Text>
              <Image 
                style = {styles.logo}
                source = {require('./images/PictureThisLogo.png')} 
                resizeMode = "contain"
              />
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
        <TextInput 
            style = {styles.input}
            placeholder = "username or email"
            returnKeyType = "next"
            onSubmitEditing = {() => this.password.focus()}
            keyboardType = "email-address"
            autoCapitalize="none"
            autoCorrect={false}
        />
        <TextInput 
            style = {styles.input}
            placeholder = "password"
            secureTextEntry
            ref = {(input) => this.password = input}
        />
        <TouchableOpacity onPress ={() => navigation.navigate('HomeScreen')} style = {styles.buttonContainer}>
          <Text style = {styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </NavigationContainer>
  );
}

function HomeScreen({navigation}) {
  return (
    <NavigationContainer independent = {true}>
      <Tab.Navigator
        screenOptions = {({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'HotSpot') {
              return (
                <Image source = {require('./images/fire.jpg')} style = {styles.icon} />
              );
            } else if (route.name === 'Settings') {
              return (
                <Image source = {require('./images/user.png')} style = {styles.icon}/>
              );
            } else if (route.name === 'Camera') {
              return(
                <Image source = {require('./images/camera.png')} style = {styles.icon}/>
              );
            }
          }
        })}
        tabBarOptions = {{
          style: styles.buttonRow,
          showLabel: false,
        }}
      >
        <Tab.Screen name = "HotSpot" component = {HotSpotScreen} />
        <Tab.Screen name = "Camera" component = {CameraScreen} />
        <Tab.Screen name = "Settings" component = {SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function HotSpotScreen({route}) {
  return (
    <NavigationContainer independent = {true}>

    </NavigationContainer>
  );
}

function CameraScreen({route}) {
  return(
    <NavigationContainer independent = {true}>

    </NavigationContainer>
  );
}

function SettingsScreen({route}) {
  return(
    <NavigationContainer independent = {true}>

    </NavigationContainer>
  )
}

function App() {
  return(
    <NavigationContainer independent = {true}>
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName = "Home">
        <Stack.Screen name = "TitleScreen" component = {TitleScreen} />
        <Stack.Screen name = "UserScreen" component = {UserScreen} />
        <Stack.Screen name = "HomeScreen" component = {HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleText: {
    paddingLeft: 25,
    fontSize : 50,
    fontWeight : '500',
    fontFamily: "Times New Roman",
    paddingTop: 200,
  },

  logo: {
    flex: 1,
    height: 100,
    width: 300,
    bottom: 100,
  },

  input: {
    height: 60,
    width: 250,
    backgroundColor: '#f9f2ec',
    //text input color -> need to change
    color: 'black',
    paddingHorizontal: 20,
    marginBottom: 40,
  },

  buttonContainer: {
    backgroundColor: "#f2e6d9",
    width: 125,
    height: 40,
    paddingVertical: 5,
  },

  buttonText: {
    fontSize: 25,
    textAlign: 'center',
    fontFamily: 'Times New Roman',
    fontWeight: '500',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#bdeaff',
    paddingBottom: 20,
  },

  icon: {
    width: 40,
    height: 40,
  }

  
  
});

export default App;
