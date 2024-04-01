
import React from 'react';
import { ImageBackground, StyleSheet,View,Text,SafeAreaView,Button,Alert,TouchableOpacity,TextInput} from 'react-native';
import { useState } from "react";
 
import axios from 'axios';
 
var DomainName = "http://103.133.214.159:2082/nc-1.0";
 
const Signin = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    var [BearerToken, setToken] = useState("");
    const [showPassword, setShowPassword] = useState(false);
 
    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };
 
    const validateEmail = email => {
      const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.(yahoo\.com|gmail\.com|hotmail\.com|outlook\.com|[\w\d.-]{2,})$/;
      return emailRegex.test(email);
    };
 
    const handleSignIn = () => {
        // Handle sign-in logic
        console.log(email);
        console.log(password);
 
       
 
        if(email.trim()=='' && password.trim()!=''){
          Alert.alert('Warning!', 'Email credentials empty.');
        }else if(email.trim()!='' && password.trim()==''){
          Alert.alert('Warning!', 'Password credentials empty.');
        }else if(email.trim()=='' || password.trim()==''){
          Alert.alert('Warning!', 'Credentials empty. Enter valid credentials.');
        }else if(email.trim()!=''&&!validateEmail(email)){
          Alert.alert('Warning!', 'Invalid Email credentials.');
        }else{
 
        axios.post(DomainName+'/auth/signin', {
          email: email,
          password: password,
    })
    .then(response => {
      console.log(response.data);
          console.log("Status: ",response.status);
          BearerToken = response.data.responseData.accessToken;
          console.log('\n');
          console.log(BearerToken);
          if(response.status==200)
          {
            // Redirect to another screen or perform actions based on the response
           // navigation.navigate('Buffer');
            navigation.navigate('BluetootStartScan',{bearer: BearerToken});
          }
          else{
             // alert message will show if user id not found
             Alert.alert('Attention!', 'Incorrect ID/password');
          }
    })
    .catch(error => {
      // Handle errors
      //console.error('There was a problem with the request:', error);
      if(email.trim()!='' || password.trim()!='')
      {
        Alert.alert('Server Error.');
        // console.error('There was a problem with the request:', error);
      }
    });
  }
      };
    return (
        <ImageBackground
        style = {styles.backGround}
        source={require('../assets/HeavyDutyBatteries.jpg')}>    
        <SafeAreaView style={styles.container}>
           
        <View style={styles.Title}>
            <Text style={{color:'white',fontSize:30}}>LOGIN</Text>
        </View>
            <TextInput
                style={styles.input}
                placeholder="Email id   *"
                placeholderTextColor="black"
                value={email}
                onChangeText={(text) => setEmail(text)}/>
            <TextInput
                style={styles.input}
                placeholder="Password   *"
                placeholderTextColor="black"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => setPassword(text)}/>
         
        <View style={{width:'50%',marginTop:'10%'}}>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.buttonbackGround}>Sign In</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.touchableText}>
            <Text style={{color:'black',fontWeight:'bold',fontSize:16}}>Don't have an account ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Register</Text>
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
        color:'black',
        width: '80%',
        marginBottom: '4.9%',
        padding: 10,
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
      },
    touchableText: {
        flexDirection:'row',
        marginTop: '4.9%',
       
    },
    link: {
       color:'white',
       fontSize:16
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
export default Signin;