import React from 'react';
import { ImageBackground, StyleSheet,View,Text, TextInput ,SafeAreaView,Button,TouchableOpacity,Modal,Alert} from 'react-native';
import { useState } from "react";
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { err } from 'react-native-svg';
import Dialog from "react-native-dialog";


var DomainName = "http://103.133.214.159:2082/nc-1.0";

const OtpValidation = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [otpEmail, setEmailOtpSource] = useState("");
    const [otpSms, setSmsOtp] = useState(""); 
    const route = useRoute();
    var [OtpDialogVisible,setOtpDialogVisible] = useState(false);
    console.log(route.params.emailpreset);

    // Set the email state with the value from route.params.emailpreset
    useState(() => {
        if (route.params && route.params.emailpreset) {
            setEmail(route.params.emailpreset);
        }
    }, [route.params]);

    const toggleVisibility = () => setVisible(!isVisible);

    const handleOtpVerification = () => {
        // Handle Otp-Verification logic
        console.log(otpEmail);
        console.log(otpSms);
        console.log(email);


        axios.post(DomainName + '/user/validateOtp', {
            email: email,
            otpSource: "email",
            otp: otpEmail,
        })
        .then(response => {

            console.log(response.status);
            if (response.status == 200){

                axios.post(DomainName + '/user/validateOtp', {
                    email: email,
                    otpSource: "sms",
                    otp: otpSms,
        
                }).then(response =>{

                    if(response.status == 200){
                        console.log('OTP validation successful. Moving to Login screen.\n');
                        OtpDialogVisible = true;
                        setOtpDialogVisible(OtpDialogVisible);

                        



                    }

                }).catch(err=>{
                    console.log('SMS OTP validation error.\n')
                    Alert.alert('SMS OTP validation error.');
                })

            }
        }).catch(err=>{

            console.log('Email OTP validation error.\n')
            Alert.alert('Email OTP validation error.\n')
        })
           
       
      };

      function handleDialogCancel(){
        OtpDialogVisible = false;
        setOtpDialogVisible(OtpDialogVisible);
      }

      function handleDialogOk(){

        OtpDialogVisible = false;
        setOtpDialogVisible(OtpDialogVisible);

        console.log('Move back to home screen');
        navigation.navigate('Login');

      }
    return (
        <ImageBackground 
        style = {styles.backGround} 
        source={require('../assets/HeavyDutyBatteries.jpg')}>     
        <SafeAreaView style={styles.container}>

            <TextInput
                style={styles.input}
                placeholder="Email id"
                placeholderTextColor="black"
                value={email}
                onChangeText={(text) => setEmail(text)}/>
            <TextInput
                style={styles.input}
                placeholder="Email OTP"
                placeholderTextColor="black"
                value={otpEmail}
                onChangeText={(text) => setEmailOtpSource(text)}/>
            <TextInput
                style={styles.input}
                placeholder="SMS OTP"
                placeholderTextColor="black"
                value={otpSms}
                onChangeText={(text) => setSmsOtp(text)}/>
    
           
            <View style={{width:'50%',marginTop:'10%'}}>
             <TouchableOpacity onPress={handleOtpVerification}>
                 <Text style={styles.buttonbackGround}>Verify OTP</Text>
             </TouchableOpacity>
            </View>


        </SafeAreaView>

        <Dialog.Container visible={OtpDialogVisible}>
        <Dialog.Title>OTP Validation</Dialog.Title>
        <Dialog.Description>
          OTP Validated. Login with your Email ID and password.
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleDialogCancel} />
        <Dialog.Button label="OK" onPress={handleDialogOk} />
      </Dialog.Container>
        
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
        marginBottom: 20,
        padding: 10,
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
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
       color:'white'
    },
})
export default OtpValidation;