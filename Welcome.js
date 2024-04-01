import React, { useEffect } from 'react';
import { View, StyleSheet, Animated,ImageBackground,Text,TouchableOpacity ,Modal} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
const Welcome = () => {
  const navigation = useNavigation();
  const subcontainerScale = new Animated.Value(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Trigger the pop animation for the subcontainer
      Animated.spring(subcontainerScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    });

    // Clean up the listener
    return unsubscribe;
  }, [navigation]);

  return (
    <ImageBackground 
        style = {styles.imageBackGround} 
        source={require('../assets/ExideBackGround.jpg')}>   
          
          <Animated.View
          style={[styles.popContainer, { transform: [{ scale: subcontainerScale }] }]}>
         <Text style = {{fontSize:27,color:'white',fontWeight:'bold',paddingLeft:20,textAlign:'left',marginTop:15}}>
                Welcome,
            </Text>
            <Text style = {{fontSize:25,color:'white',textAlign:'center',marginBottom:15}}>
                How would you like to start ?
            </Text>

            <TouchableOpacity  onPress={() => navigation.navigate('Login')}>
            <Text style = {styles.buttonbackGround}>
                Sign-In
            </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style = {styles.buttonbackGround}>
                Sign-up
            </Text>
            </TouchableOpacity>
         </Animated.View>

        </ImageBackground>
    
  );
};

const styles = StyleSheet.create({

  popContainer: {
    width:'100%',
    height:'34%',
    backgroundColor:'red',
    borderTopLeftRadius:50,
    //borderTopRightRadius:30,
    paddingTop:10,
    marginLeft:10,
  },
  imageBackGround: {
    flex: 1,
    justifyContent:'flex-end'
},
buttonbackGround: {
    width: '80%',
    right:'10%',
    left:'10%',
    marginBottom: "4%",
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    textAlign:'center',
    fontSize:20,
    color:'#b22222',
    elevation: 5,
    shadowColor: '#333333',
    shadowOffset: {
    width: 0,
    height:2,
},
   shadowOpacity: 0.25,
   shadowRadius: 3.84,   
},
});

export default Welcome;
