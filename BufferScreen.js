import React from 'react';
import { ImageBackground, StyleSheet,View,Text, TextInput ,SafeAreaView,Button,TouchableOpacityy,Modal} from 'react-native';
import { useState,useEffect } from "react";
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as Progress from 'react-native-progress';
var count = 0;




const BufferScreen = ({ navigation }) => { 
    const [modalLoading, setModalLoading] = useState(true);

    useEffect(() => {
        // Show modal after 2 seconds
        const timer = setTimeout(() => {
            // if condition
            setModalLoading(true);
            
            navigation.navigate('BluetootStartScan');
            

            
            
            count++;
            


            
            
        
            
        }, 2000);},[navigation])

       


        

   

   




    const handleOtpVerification = () => {
       alert("Hi Bootloader");
      };
    return (
        <ImageBackground 
        style = {styles.backGround} 
        source={require('../assets/HeavyDutyBatteries.jpg')}>     
        <SafeAreaView style={styles.container}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalLoading}
            onRequestClose={() => setModalLoading(false)}>
            <View style={stylesBuffer.ProgressCenteredView }>
              
              <View style={stylesBuffer.modalProgressView}>
              <View>
              <Text style={{color:'black',fontWeight:'bold',marginVertical:'-20%',fontSize:20}}>Loading</Text>
              </View>
              <Progress.Circle indeterminate={true} color='black' showsText={true} size={100} thickness={100} />
              </View>
            </View>
        </Modal>
          
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
export default BufferScreen;

const stylesBuffer = StyleSheet.create({

    app: {
      flex: 4, // the number of columns you want to devide the screen into
      marginHorizontal: "auto",
      width: 400,
      backgroundColor: "red"
    },
  
    backGround: {
        flex: 1,
    },
    container: {      
      alignItems: "center",
  },
  input: {
    width: '80%',
    marginBottom: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  touchableText: {
    
    marginBottom: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '1e90ff',
  }, 
  buttonbackGround: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'black',
    textAlign:'center',
    fontSize:20,
    color:'white',
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
    // width: '80%',
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
  popContainer: {
    marginVertical:'5%',
    height:'15%',
    backgroundColor:'white',
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    borderBottomLeftRadius:30,
    borderBottomRightRadius:30,
  
  },
  subcontainer: {
    
    height:"90%",
    backgroundColor:'white',
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    alignItems:'center',
    paddingTop:0,
    marginLeft:10,
    marginRight:10,
    marginBottom:10,
    
  },
  BatteryContainer:{
    width:'100%',
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    borderRadius:20,
    
    shadowColor: '#000',
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 50,
  
    elevation: 5,
    
  },
  ProgressCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  modalProgressView: {
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
    justifyContent:'center'
  },
  
  card: {
    
    backgroundColor: 'white',
    borderRadius: 8,
    paddingTop:20,
    width: 180,
    height:150,
    borderColor:'black',
    justifyContent:'center',
    alignItems:'center',
    paddingRight:10,
    marginVertical: 5,
    marginHorizontal:10,
    marginRight:10,
  },
  elevation: {
    elevation: 20,
    shadowColor: 'gray',
  },
  
  
  })
  