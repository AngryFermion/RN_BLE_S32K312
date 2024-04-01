import React from 'react';
import { ImageBackground, StyleSheet,View,Text, TextInput ,SafeAreaView,Button,TouchableOpacity} from 'react-native';
import { useState } from "react";
import axios from 'axios';
var DomainName = "http://103.133.214.159:2082/nc-1.0";
const Signup = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
 
    const validateEmail = email => {
      const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.(yahoo\.com|gmail\.com|hotmail\.com|outlook\.com|[\w\d.-]{2,})$/;
      return emailRegex.test(email);
    };
 
    const validateIndianPhoneNumber = phoneNumber => {
      // Regular expression for Indian phone number validation
      const phoneRegex = /^[6-9]\d{9}$/;
      return phoneRegex.test(phoneNumber);
    };
 
    const handleSignUp = () => {
        // Handle sign-in logic
        console.log(username);
        console.log(email);
        console.log(phonenumber);
        console.log(password);
 
        if(username.trim()=='' || email.trim()=='' || phonenumber.trim()=='' || password.trim()==''){
          Alert.alert('Warning!', 'Credentials empty. Enter valid credentials.');
        }else if(email.trim()!='' || phonenumber.trim()!='' || password.trim()!=''){
          Alert.alert('Warning!', 'Email,Phone number and Password are mandatory credentialsto be added.');
        }else if(email.trim()!=''&&!validateEmail(email)){
          Alert.alert('Warning!', 'Invalid Email credentials.');
        }else if(phonenumber.trim()!=''&&!validateIndianPhoneNumber(phonenumber)){
          Alert.alert('Warning!', 'Invalid Phone Number credentials.');
        }else
        {
       
        axios.post(DomainName + '/auth/signup', {
            name: username,
            email: email,
            phone: phonenumber,
            password: password,
        })
        .then(response => {
          // Handle successful authentication response
         console.log(response.data);
 
          // Redirect to another screen or perform actions based on the response
          navigation.navigate('Validate OTP',{
            emailpreset: email,
          });
 
        })
        .catch(error => {
         
          //Alert.alert('Error', 'There was an error during login. Please try again.');
          if(username.trim()!='' || email.trim()!='' || phonenumber.trim()!='' || password.trim()!=''){
            Alert.alert('Check your internet connection.');
         }
       // Handle errors
       console.error('There was a problem with the request:', error);
        });
      }
      };
    return (
        <ImageBackground
        style = {styles.backGround}
        source={require('../assets/HeavyDutyBatteries.jpg')}>    
        <SafeAreaView style={styles.container}>
 
        <View style={styles.Title}>
            <Text style={{color:'white',fontSize:30,}}>SIGN UP</Text>
        </View>
 
            <TextInput
                style={styles.input}
                placeholder="User name (Optional)"
                placeholderTextColor="black"
                value={username}
                onChangeText={(text) => setUsername(text)}/>
            <TextInput
                style={styles.input}
                placeholder="Email id   *"
                placeholderTextColor="black"
                value={email}
                onChangeText={(text) => setEmail(text)}/>
            <TextInput
                style={styles.input}
                placeholder="Phone number   *"
                placeholderTextColor="black"
                value={phonenumber}
                onChangeText={(text) => setPhonenumber(text)}/>
            <TextInput
                style={styles.input}
                placeholder="Set Password   *"
                placeholderTextColor="black"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => setPassword(text)}/>
 
            <View style={{width:'50%',marginTop:'10%',}}>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.buttonbackGround}>Create Account</Text>
              </TouchableOpacity>
            </View>
 
            <View style={styles.touchableText}>
              <Text style={{color:'black',fontWeight:'bold',fontSize:16}}>Already have an account ? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
            </View>
             
        </SafeAreaView>
       
        </ImageBackground>
    );
}
 
const styles = StyleSheet.create({
    container: {      
        alignItems: "center",
    },
    backGround: {
        flex: 1,
        justifyContent: "center",
    },
    input: {
        width: '80%',
        marginBottom: 20,
        padding: 10,
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        color:'black',
      },
    touchableText: {
        flexDirection:'row',
        marginTop: 20,
    },
    backButton: {
        top:'40%',
        left:'30%'
    },
    link: {
      color:'white',
      fontSize:16
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
     marginTop: 40,
    },
    modalView: {
      margin: 10,
      width:'90%',
      height:'30%',
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      marginVertical:'10%',
      textAlign: 'center',
      fontWeight:'bold',
      fontSize:18
    },
    CloseButton: {
      width: '80%',
      marginTop: 10,
      padding: 10,
      borderRadius: 20,
      backgroundColor: '#00bfff',
      textAlign:'center',
      fontSize:20,
      fontWeight:'bold',
      color:'white',
  },
  alertTitle:{
      fontWeight:"bold",
      fontSize:24,
      color:"#000",
  },
  Title:{
    marginBottom:'10%',
  },
  buttonbackGround: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#1e90ff',
    textAlign:'center',
    fontSize:20,
    color:'white',
},
})
export default Signup;