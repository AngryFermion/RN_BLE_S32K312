
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Button } from 'react-native';

import Welcome from './app/screens/Welcome';
import Signin from './app/screens/Signin';
import Signup from './app/screens/Signup';
import OtpValidation from './app/screens/OtpValidation';


import BluetootStartScan from './app/screens/BluetootStartScan';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import { createDrawerNavigator } from '@react-navigation/drawer';

export default function App() {

    const Stack = createStackNavigator();
    //const Drawer = createDrawerNavigator();

  // Stacking the pages 
  const StackScreen = () => {
    return (
      <Stack.Navigator screenOptions={{
        StatusBarColor:"red",
        headerStyle:{
          backgroundColor:"#fff"
        },
        headerTintColor:"black",
        headerTitleAlign:"center",
        headerTitle:'',
      }} initialRouteName="Home">
        <Stack.Screen name="Home" component={Welcome} />
        <Stack.Screen name="Login" component={Signin} />
        <Stack.Screen name="Register" component={Signup} />
        <Stack.Screen name="Validate OTP" component={OtpValidation} />
        <Stack.Screen name="BluetootStartScan" component={BluetootStartScan} />
        
      </Stack.Navigator>
    );
  }

 
  return (
    <NavigationContainer>
      <StackScreen/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
