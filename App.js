import * as React from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity} from 'react-native';
import {KeyboardAvoidingView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

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
                resizeMode = 'contain'
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
            onSubmitEditing = {() => this.passwordInput.focus()}
            keyboardType = "email-address"
            autoCapitalize="none"
            autoCorrect={false}
        />
        <TextInput 
            style = {styles.input}
            placeholder = "password"
            secureTextEntry
            ref = {(input) => this.passwordInput = input}
        />
        <TouchableOpacity style = {styles.buttonContainer}>
          <Text style = {styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </NavigationContainer>
  );
}

const Stack = createStackNavigator();

function App() {
  return(
    <NavigationContainer independent = {true}>
      <Stack.Navigator initialRouteName = "Title">
        <Stack.Screen name = "Title" component = {TitleScreen} />
        <Stack.Screen name = "User" component = {UserScreen} />
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

  fire: {
    height: 100,
    width: 100,
  },

  title: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 100,

  }
  
});

export default App;
