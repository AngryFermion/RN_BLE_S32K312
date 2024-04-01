import React, { useEffect, useState, version } from 'react';
import { useRoute } from '@react-navigation/native';
import { Button,Text, FlatList, View, Platform, PermissionsAndroid,NativeModules,NativeEventEmitter,ListRenderItem  ,ImageBackground,StyleSheet,SafeAreaView,TouchableOpacity,Modal, Alert,Animated} from 'react-native';
import * as Progress from 'react-native-progress';
import BleManager, {
    BleDisconnectPeripheralEvent,
    BleManagerDidUpdateValueForCharacteristicEvent,
    BleScanCallbackType,
    BleScanMatchMode,
    BleScanMode,
    Peripheral,
  } from 'react-native-ble-manager';
  import { useNavigation } from '@react-navigation/native';
import { Box, Row } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import {Buffer} from 'buffer';
import * as RNFS from 'react-native-fs';
import Dialog from "react-native-dialog";
import axios from 'axios';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FloatingAction } from "react-native-floating-action";
import ToggleSwitch from 'toggle-switch-react-native'; 

 

var domainName = "http://103.133.214.159:2082/nc-1.0"




const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


var global_peripheral: Peripheral
const SECONDS_TO_SCAN_FOR = 15;
const BMS_DATA_FETCH_FREQUENCY = 5;
const SERVICE_UUIDS:string[]=[];
const DEVICE_NAME = 'EXIDE';      // name hardcoded in BLE Da14531 device.
const DISPLAY_NAME = DEVICE_NAME; // this can be changed to the name of the device that has
                                  // to be displayed.
const ALLOW_DUPLICATES = true;
const BMS_BATTERY_PACK_DATA_COUNT = 40;
const ENCRYPTION_KEY   = 0xFD;

// units for BMS battery pack.
const mV = 0;
const A = 1;
const percent = 2;
const celsius = 3;

// Update Variables
var start=0; 

var test_buffer_data: number[];
var read_file_flag = 0;
var file_index = 0;
var file_row_index = 0;
var file_line_number = 0;
var contents: string;
var test_buffer_data : number[];
var test_buffer_data_chunk : number[];
var test_buffer_BMS_command : number[];
var fota_cmd = '';
var test_buffer_type = Buffer.from("S0");
const CmdStartFirmwareWrite: string = '0x00000007';
const CmdJumpToApp: string = '0x00000008';
const CmdJumpToBootloader: string = '0x00000006';
var data_packet = 0;
var write_flag = 0;
var BootStarted = 0; // with jump
var totalLines = 0;
var progressSlice = 0.0;
 
 var Data_from_Bms : string[]
 var length = 0;
 
 
// BLE commands
var RequestAllBmsParams:string = '0x00001000';
var CmdFetchVersion:string = '0x0000FF00';
var CmdRollback:string = '0x0000AA00';

var versionRequestCount = 0;
var test_buffer_BMS_command:number[];
var main_app_version:string[];
var BmsRequestCount = 0;
var dataCount =0;
var EncryptionActive = 0;
var FetchTimer:any;
var ScanTimer: any;
var BmsDataTimer: any; 
var queueComplete:boolean = true;






const BluetootStartScan = () => {
 
 
  //  var version = '';
  //  version = BleParser.BleVersion.FetchBmsVersion()
 
  const navigation = useNavigation();
 
  // Fetching Bearer Token
  var [BearerToken, setToken] = useState("");
  const route = useRoute();
  BearerToken = (route.params as { bearer: string }).bearer;
 

 
 
  // Variables used by the App
  
  /******************************************************************************************************* */
 
 
  const subcontainerScale = new Animated.Value(0);
 
  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral['id'], Peripheral>(),
  );

  // Variables for UI
 
  const [deviceid, setDeviceid] = useState("");
 
  var [isConnected,setIsConnected] = useState(false);

  const [devideName, setDeviceName] = useState("Scan");
 
  var [isFound,foundState] = useState(false)
 
  var [scanDisable,setScanDisable]=useState(false);
 
  const [errorMessage, setErrorMessage] = useState('');
   
  const [modalVisible, setModalVisible] = useState(false);
 
  const [modalProgressVisible, setModalProgressVisible] = useState(false);
 
  var [display, setDisplay] = useState(false);

  var [BatteryPackModal,setBatteryPackModal] = useState(true);
 
  var [isScanning,setScanning]=useState(false);
 
  var [device_name_color,setTextColor] = useState('1e90ff');
 
  var [BmsProgress,setProgress] = useState(0);
 
  var [BmsVersion,setBmsVersion] = useState('N/A');
 
  // Battery Pack variables
 
  var [AdcChnl0, onChangeAdcChnl0] = useState('N/A');
  var [AdcChnl1, onChangeAdcChnl1] = useState('N/A');
  var [CellVoltMaxChnl, onChangeCellVoltMaxChnl] = useState('N/A');
  var [CellVoltMinChnl, onChangeCellVoltMinChnl] = useState('N/A');
  var [CellSumVolt, onChangeCellSumVolt] = useState('N/A');
  var [PackVoltage, onChangePackVoltage] = useState('N/A');
  var [LoadVoltage, onChangeLoadVoltage] = useState('N/A');
  var [TempSnsrMaxChnl, onChangeTempSnsrMaxChnl] = useState('N/A');
  var [TempSnsrMinChnl, onChangeTempSnsrMinChnl] = useState('N/A');
  var [CellMinVolt, onChangeCellMinVolt] = useState('N/A');
  var [CellMaxVolt, onChangeCellMaxVolt] = useState('N/A');
  var [SnsrMinTemp, onChangeSnsrMinTemp] = useState('N/A');
  var [SnsrMaxTemp, onChangeSnsrMaxTemp] = useState('N/A');
  var [CellMinSOC, onChangeCellMinSOC] = useState('N/A');
  var [CellMaxSOC, onChangeCellMaxSOC] = useState('N/A');
  var [ActualSOC, onChangeActualSOC] = useState('N/A');
  var [AmbTemp, onChangeAmbTemp] = useState('N/A');
  var [PackCurrent, onChangePackCurrent] = useState('N/A');
  var [BalStatus, onChangeBalStatus] = useState('N/A');
  var [StateMode, onChangeStateMode] = useState('N/A');
  var [Position, onChangePosition] = useState('N/A');
  var [DialogVisible,OnDialogVisible] = useState(false);
  var [UpdateCompleteDialogVisible,SetUpdateCompleteDialogVisible] = useState(false);
  var [UpdateAvailableDialogVisible,SetUpdateAvailableDialogVisible] = useState(false); 
  var [DeviceConnected,SetDeviceConnected] = useState(false); 
  var [StopUpdate,SetStopUpdate] = useState(0);
  var [NewUpdateAvail,onNewUpdateAvail] = useState(0);
  var [IsBmsDataSweep,SetIsBmsDataSweep] = useState(false);
  var [toggleButton,SetToggleButton] = useState(false);
  var [toggleLabel,SetToggleLabel] = useState('Start Sweep');
  // Variables for Timer.
 

  /******************************************************************************************************* */
 
  const Tab = createBottomTabNavigator();

  const BMSdata = [
   
    { id: '3', name:'Cell Voltage Max Channel',value:CellVoltMaxChnl},
    { id: '4', name:'Cell Voltage Min Channel',value:CellVoltMinChnl},
    { id: '5', name:'Cell Voltage Min Channel',value:CellSumVolt},
    { id: '6', name:'Pack Voltage',value:PackVoltage},
    { id: '7', name:'Load Voltage',value:LoadVoltage},
    { id: '8', name:'Temperature Sensor Max Channel',value:TempSnsrMaxChnl},
    { id: '9', name:'Temperature Sensor Min Channel',value:TempSnsrMinChnl},
    { id: '10', name:'Cell Min Voltage',value:CellMinVolt},
    { id: '11', name:'Cell Max Voltage',value:CellMaxVolt},
    { id: '12', name:'Sensor Min Temperature',value:SnsrMinTemp},
    { id: '13', name:'Sensor Max Temperature',value:SnsrMaxTemp},
    { id: '14', name:'Cell Min SOC',value:CellMinSOC},
    { id: '15', name:'Cell Max SOC',value:CellMaxSOC},
    { id: '16', name:'Actual SOC',value:ActualSOC},
    { id: '17', name:'Ambient Temperature',value:AmbTemp},
    { id: '18', name:'Pack Current',value:PackCurrent},
    { id: '19', name:'Bal Status',value:BalStatus},
    { id: '20', name:'State Mode',value:StateMode},
    { id: '21', name:'Position',value:Position},
 
    // Add more items as needed
  ];

  

  // API to encrypt data



  function EncryptDecrypt (data:number[]):number[]{

    var ret_data:number[];



    ret_data = [];

    var i = 0;
    for (i=0;i<134;i++){

      ret_data.push((data[i] & ENCRYPTION_KEY) | (~(data[i] & 0x01)));

    }


    return ret_data;

  }

  const stopScan = () => {
    console.log("reached the stop scanning part...!");
    BleManager.stopScan();
  }

 
 /**
  * @name             fetchLatestVersion
  * @abstract         Fetches the version from backend and cross-checks against the device version.
  */
  const fetchLatestVersion = async() => {
 
    var match = '';
    var ret = 0
    let config = {
      headers: {
        'Authorization': 'Bearer ' + BearerToken
      }
    }

    try {
      const response = await axios.get(domainName + '/file-version/latest-file-version',
      config); // added authorization
 
 
      console.log(response.data);
      const versionString = response.data;

      match = versionString.match(/\d+\.\d+\.\d+\.\d+/);

      console.log('match:',match);
 
      // if condition can be removed.
      if(BmsVersion == 'N/A'){
        BmsVersion = String('0.0.0.0');
      }


      ret = VersionCheck(BmsVersion,match);
 
      console.log('version check return:',ret);

      // if return is 1 then make update available.
      if(ret == 1){

        SetUpdateAvailableDialogVisible(true); // dialog pop-up telling user that update
                                               // is available.
        display = true;
        setDisplay(display);
    }
   
     
    } catch (error) {

      console.error('Error fetching latest version:', error);
      Alert.alert('Error', 'Failed to fetch the latest version. Please try again.');

    }
 
 
 
  };
 
 
  const VersionCheck=(version:string,LatestVersion:string)=>{
 
    // console.log('Latest Version:',LatestVersion[0])
    // console.log('App Version:',version)
   
    var j =0;
    var LatVersion: string[]
    LatVersion = []
    for (j=0;j<8;j+=2){
      LatVersion.push(LatestVersion[0][j])
    }
 
    var deviceVersion: string[]
    deviceVersion = []
    var k =0;
    for (k=0;k<8;k+=2){
      deviceVersion.push(version[k])
    }
   
    console.log('Dummy:',LatVersion[3].charCodeAt(0));
    console.log('Version:',deviceVersion[3].charCodeAt(0));
   
      var i =0;
      if((deviceVersion[i].charCodeAt(0)-48)<(LatVersion[i].charCodeAt(0)-48)){
        return 1;
      }
      else{
        if((deviceVersion[i+1].charCodeAt(0)-48)<(LatVersion[i+1].charCodeAt(0)-48)){
          return 1;
        }
        else{
 
          if((deviceVersion[i+2].charCodeAt(0)-48)<(LatVersion[i+2].charCodeAt(0)-48)){
            return 1;
          }
          else{
 
            if((deviceVersion[i+3].charCodeAt(0)-48)<(LatVersion[i+3].charCodeAt(0)-48)){
              return 1;
            }
 
            else{
              return 0;
            }
          }
 
        }
      }
 
  
  }
 
 
  function CalcStepSize(lines:number){
 
    return 1/lines ;
  }


 
  function InitUpdate(){
 
    // initializing all update parameters
 
    test_buffer_data = [];
    read_file_flag = 0;
    file_index = 0;
    file_row_index = 0;
    file_line_number = 0;
    test_buffer_data = [];
    test_buffer_data_chunk = [];
    test_buffer_BMS_command = [];
    fota_cmd = '';
    test_buffer_type = Buffer.from("S0");
 
    data_packet = 0;
    write_flag = 0;
    BootStarted = 1;
    totalLines = 0;
    progressSlice = 0.0;
 
  }
 


  /**
   * @name            FetchHexFile
   * @abstract        Fetches the latest .srec file from the backend server.
   */

  const FetchHexFile = async() =>{
 
    console.error('inside:');
    let config = {
      headers: {
        'Authorization': 'Bearer ' + BearerToken
      }
    }
    try {
      const response = await axios.get(domainName +'/file-version/latest-file-data',
      config); // change the end point , authorization added
     
      contents = response.data;
 
      console.log('Contents:',contents);
 
      totalLines = Math.floor(contents.length/((128*2 + 16)));
 
      // progress slice for the loading circle
 
      progressSlice = CalcStepSize(totalLines);
 
 
 
      console.log('total length:',totalLines);
 
      console.log('time slice:',progressSlice);


      OnDialogVisible(true);
     
   
     
     
    } catch (error) {



      console.error('Error fetching latest version:', error);
      Alert.alert('Error', 'Failed to fetch the latest version. Please try again.');
    }
 
 
  }



 
  const UpdateVersion = () => {
 
    // Stop Looking for updates
 
    LookForUpdates(false); // BF #1: timer not stopping
 
 
    // intialize the variables used for updates.
    InitUpdate();
 
    // handle srec file from backend and get the number of lines in the file.
    FetchHexFile();
 
 
 
}
 
  
 
  /**
   * @name            FetchBmsVersion
   * @abstract        This API sends a command and tells the BLE to look for a response.
   *            
   */
 
  const FetchBmsVersion = () =>{
 
    SendCommand(CmdFetchVersion); // sending command to fetch version.
                                  // CmdFetchVersion = 0x0000FF00
   
    console.log('Fetching BMS version. Waiting for response...\n');
   
    if(versionRequestCount == 0){
   
      ReadBmsVersion(deviceid,'0783b03e-8535-b5a0-7140-a304d2495cb7','0783b03e-8535-b5a0-7140-a304d2495cb8');
   
      versionRequestCount = 1;
   
    }
 
  }


  /**
   * @name                  SendCommand
   * @abstract              This API takes a command in the form of a string. This is then packed into 4 bytes and sent
   *                        over BLE.
   * @param Command         string (E.g. '0x000000FF')
   */
 
  const SendCommand = (Command:string) =>{
 
    console.log("Packing and sending command...\n",Command)
 
    test_buffer_BMS_command = []; // global variable that will hold the command
 
    // packing command 0x00001000
 
    packCommand(Command)
   
     console.log('Sending BMS params request command over BLE....\n')
 
    // Sending command over BLE
     SendBmsCommand();
 
  }



 
  async function packCommand(command:string) {
 
 
    console.log('Packing command....\n')
 
    var i = 2;     
 
 
    while(i<10){
 
      test_buffer_BMS_command.push(  convertToHex(command[i]) << 4 | convertToHex(command[i+1])  )
      i = i + 2
 
   
  }
 

 
    
   
  }
 

  /**
   * @name      convertToHex
   * @abstract  This API takes a string parameter and returns an hex value.
   * @param num 
   * @returns   return hex number.
   */
  function convertToHex(num: string): number {
 
    switch(num){
      case 'A':
          return 0x0A;
      case 'B':
          return 0x0B;
      case 'C':
          return 0x0C;
      case 'D':
          return 0x0D;
      case 'E':
          return 0x0E;
      case 'F':
          return 0x0F;
      default:
          return Number(num);
    }
   
    return 0
}




 
async function SendBmsCommand() {
 
 

  // Using react native Ble manager to send the data over BLE
  // 
  await BleManager.retrieveServices(deviceid).then(
    (peripheralInfo) => {
   
 
    try {

      // parameters - device ID, Service UUID, Characteristic UUID, data/
      BleManager.writeWithoutResponse(
        
        deviceid,
        '0783b03e-8535-b5a0-7140-a304d2495cb7',
        '0783b03e-8535-b5a0-7140-a304d2495cba',test_buffer_BMS_command
      )
        .then(() => {
         
          console.log('Command Written over BLE')
 
         
        })
    } catch (error) {
 
 
        console.log(error);
        console.log("Write Not possible")
       
    }
   
  });
 
 
 
 
 
}


/**
 * @name                        LookForUpdates
 * @abstract                    Looks for update every 30 seconds. Fetches the latest version from Backend
 *                              and cross checks with the version of BMS.
 * @param                       lookForUpdates  boolean
 */
 
function LookForUpdates(lookForUpdates:boolean){
 
  if(lookForUpdates == true){
 
    FetchTimer = setInterval(() => {
      CheckUpdate()
    }, 30000);
 
  }
  else{
 
    clearInterval(FetchTimer);
 
  }
 
   //StopUpdate = 1;
 
 
 
}
 
 
 /**
  * @name         ReadBmsVersion
  * @abstract     This API reads the BLE data packets and is called whenever the MCU sends data.
  * @param        peripheralId 
  * @param        service 
  * @param        characteristic 
  */
 
async function ReadBmsVersion(peripheralId: string, service: string, characteristic:string){
 
    console.log('Parsing BMS version...\n');
 
    main_app_version = [];


    
    await BleManager.retrieveServices(peripheralId)

    // This sets up the device to listen to the incoming data.
    BleManager.startNotification(
      peripheralId,
      service,
      characteristic
    )



    bleManagerEmitter.addListener(
      "BleManagerDidUpdateValueForCharacteristic",
      ({ value, peripheral, characteristic, service }) => {
        // Convert bytes array to string
        const data = String.fromCharCode(...value);
       
        console.log(`Response from BMS for version: ${data}, showing on UI...\n`);
 
 
        main_app_version.push(data[0]);
        main_app_version.push(data[1]);
        main_app_version.push(data[2]);
        main_app_version.push(data[3]);

        // Convert the main_app_version to string
 
        BmsVersion = main_app_version[0].charCodeAt(0) + '.' + main_app_version[1].charCodeAt(0) + '.' + main_app_version[2].charCodeAt(0) + '.' + main_app_version[3].charCodeAt(0);
 
        console.log(main_app_version[0]);
        console.log(main_app_version[1]);
 
        console.log(main_app_version[2]);
        console.log(main_app_version[3]);
 
        console.log(BmsVersion);
 
 
        
        // setting the Bms Version in the UI.
        setBmsVersion(BmsVersion);
 
 
        // start checking if update is available
 
        //LookForUpdates(main_app_version);
 
        // Request battery pack details.
 
        bleManagerEmitter.removeAllListeners("BleManagerDidUpdateValueForCharacteristic");


        // Bms Version 0.0.0.0 indicates that the device is in the bootloader mode with no MCU application.


        // If Bms version > 0.0.0.0 then fetch the BMS data parameters.

        // CHANGE: INSTEAD OF THIS THE CONTROL IS GIVEN TO THE USERS TO START READING THE BMS
        // PACK PARAMETERS with EVERY 5 seconds REFRESH RATE.
 
        // if(BmsVersion != '0.0.0.0'){


        //     RequestBmsParams(); 
        
        
        // }
       
      
       
       
      }
    );
     
  }

  function GetBmsData(sweep:boolean){

    
    if(BmsVersion != '0.0.0.0' && BmsVersion != 'N/A' && sweep == true){


            //RequestBmsParams(); 
            console.log('Queing Bms Battery pack data request');
            QueueBmsParamReques();
        
        
    }

    

    else if(sweep == false){

      // if BMS data sweep is stopped by user, BMS battery
      // pack data will not be fetched.
        console.log('NOT HERE')
        clearInterval(BmsDataTimer);
    }

    

  }


  const BmsParamSweep=(start:boolean)=> {


    
  
    SetToggleButton(start)
    if(start == true){
      SetToggleLabel('Stop Sweep');
      console.log('Starting the timer every 5 seconds to fetch BMS data.\n');

      // if BMS data sweep is set to true by user
      // BMS battery pack data will be fetched with a 
      // frequency of BMS_DATA_FETCH_FREQUENCY.

      IsBmsDataSweep = true;
      SetIsBmsDataSweep(IsBmsDataSweep);
      BmsDataTimer = setInterval(()=>{GetBmsData(IsBmsDataSweep)},(BMS_DATA_FETCH_FREQUENCY*1000))
      
    }

    else if(start == false){
      SetToggleLabel('Start Sweep');
      console.log('Stopping the timer.')

      IsBmsDataSweep = false;
      SetIsBmsDataSweep(IsBmsDataSweep);
      GetBmsData(IsBmsDataSweep)
      
    }


  }

 
  function sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }





 
 
 
  async function WriteToUARTBuffer(){
 
  
    await BleManager.retrieveServices(/*"48:23:35:09:C9:DB"*/deviceid).then(
     (peripheralInfo) => {
   
 
     try {


      // react-native BLE manager API to write the test_buffer_type over BLE. 
      // This writes 2 bytes over BLE
       BleManager.writeWithoutResponse(
         //"48:23:35:09:C9:DB",
         deviceid,
         '0783b03e-8535-b5a0-7140-a304d2495cb7',
         '0783b03e-8535-b5a0-7140-a304d2495cba',test_buffer_type.toJSON().data/*buffer.toJSON().data*/
       )
         .then(() => {
 
 
          // If the Type is correctly written then the rest of the contents from each line is attempted.
 
           // test buffer data broken into 7 packets. Each packet size is maximum of 20 bytes.
           // 20 * 6 packets = 120 bytes.
           // 14 * 1 packet 9 bytes.
           // total = 134 bytes = 128 data bytes + 1 CRC byte + 4 address + 1 size.
 
           data_packet = 0;
           var per_packet_size;
 
           
         
 
           while(data_packet < 7){
         
           test_buffer_data_chunk = [];
          
         
 
           if(data_packet == 6){
             per_packet_size = 14;
           }
 
           else{
             per_packet_size = 20;
           }
 
           var i =0;
 
           
 
           while(i<per_packet_size){
             
 
             test_buffer_data_chunk.push((test_buffer_data[i + data_packet*20]));
             i = i+1;
 
           }
 
          
         
           BleManager.writeWithoutResponse(
             //"48:23:35:09:C9:DB",
             deviceid,
             '0783b03e-8535-b5a0-7140-a304d2495cb7',
             '0783b03e-8535-b5a0-7140-a304d2495cba',(test_buffer_data_chunk)
           ).then(() =>{
           
           write_flag = 1;
           
           })
 
           data_packet = data_packet + 1;
 
         }
 
 
 
 
 
         
           //const sensorData = buffer.readUInt8(1, true);
         })
     } catch (error) {
       console.log(error);
         console.log("Write Not possible")
         // LogMessages += "[System Message] Write Unsuccessful."
         // setText(LogMessages)
     }
   
     
 
   
   });
 
 
   
 
   }
 
 
   async function ReadFromUart(peripheral: string, service: string, characteristic:string){
 
    
    console.log("Reading from UART....\n");
   
    await BleManager.retrieveServices(peripheral)

    // using react-native BLE manager to listen to particular characteristics
    BleManager.startNotification(
      peripheral,
      service,
      characteristic
    )

    // setting up a callback to listen to the MCU device.
    bleManagerEmitter.addListener(
      "BleManagerDidUpdateValueForCharacteristic",
      ({ value, peripheral, characteristic, service }) => {
        // Convert bytes array to string
        const data = String.fromCharCode(...value);
       
       
        console.log(`Received ${data[0].charCodeAt(0)} for characteristic ${characteristic}`);
 
        console.log('boot start flag:',BootStarted)

        // if the BootStarted is set to 1, it means that the firmware update process has started and the bootloader is 
        // communicating.
        if(BootStarted == 1){
         

        // The response from the MCU is checked. 

        if(Buffer.from(data)[0] == 65){ 
         

          //If the response is 65 then it is a positive response.
          // file_line_number is incremented so that the next line
          // from the .srec file can be written.

          file_line_number++;
         
 
          // check if file_line_number is set to 0. This can happen
          // if the end of file has reached.
          if(file_line_number == -1 || file_line_number == -2){
            // Update the user on UI that the file has been successfully written by bootloader.
 
            // take actions.
 
          }
         
            // Call StartUpdate API to write the next line from .srec file.
            StartUpdate(file_line_number);
         
 
        }
        else if(Buffer.from(data)[0] == 69){ 

          // if the response from the device is 69 then it indicates an error in update process.
          // take action:

            // restart the process from scratch --> Initialize Update and start again.
            // if 3 fails occur, abort the update process and indicate to user.
            // This is pending.

        }

        // junk data on BLE
        else if (data[0] == 'A'){
           console.log("Weird Data");
        
        }
 
      }
 
      else{
        console.log(`Received ${data} for bootloader ${characteristic}`);
        if(data[1].charCodeAt(0) == 6){
          console.log('Starting Firmware update process..\n')
          bleManagerEmitter.removeAllListeners("BleManagerDidUpdateValueForCharacteristic");
          BootStarted = 1
          StartUpdate(0);
 
        }
      }
       
       
      }
    );
     
   
   
 
  }




  /**
   * @name                  StartUpdate
   * @abstract              This API is called to pack the data from a line of .srec file and write it over BLE
   * @param                 linenumber - this keeps track of the line number that has to be written.
   */
  const StartUpdate=(linenumber:number)=>{
 
    sleep(100);
   
    test_buffer_data = [];
    console.log("LINE NUMBER: ",linenumber)


    // check if line number value is -2.
    // a value of -2 indicates that end of file has reached.
    // if the end of file of file is detected
    // remove the modal responsible for showing progress
    // reset the Bms progress value to zero
    // wait for 4 seconds and retrieve the BMS version of the 
    // new application from the MCU.

    if(linenumber == -2){
      // update process complete
     
      display = false;
      setDisplay(display);
      setModalProgressVisible(false);

      // dialog pop-up to tell the users that the update is complete.

      SetUpdateCompleteDialogVisible(true); // making the dialog box visible.

      versionRequestCount = 0;
      BmsRequestCount = 0;
      StopUpdate = 0; // not needed anymore.
      BmsProgress = 0;
      setProgress(BmsProgress);
      SetStopUpdate(StopUpdate);


      // setTimeout(()=>{GetBmsVersion(),4000});
      setTimeout(() => {
        GetBmsVersion();
      }, 4000);

      
 
 
      // Look for updates again
 
     
      LookForUpdates(true); // start looking for updates again with 
                            // a frequency of 30 seconds. Modifiable.
     
 
     
     
 
 
    }
  

  // Increasing the Bms Progress circle by the slice amount.
   
   BmsProgress += progressSlice;


   setProgress(BmsProgress);


    // End of line condition also added in the Update feature.

    // at the end of each line read_file_flag is set to zero.
     while((!read_file_flag) && (linenumber != -1)){
       
     
       // file_index moves through each charcter of the entire file
       // file_row_index moves through each row and is reset at the end of each row
       // contents buffer contains the entire .srec file.
       if(contents[file_index] == '\n'|| contents[file_index] == '\r'){
 
         // read_file_flag set to 1 so that while loop exit occurs.
         read_file_flag =1

         // incrementing the file_index so that the file_index pointer reaches the next line.
         file_index ++;
         
       
       }


       else{

        // looking for the the characters S and 0,3,5 from the .srec file.
        // depending of the type the test_buffer_type is populated with the 2 bytes
 
         if(file_row_index == 0){



           file_index; // not needed
           if(contents[file_index] == "S"){
             if(contents[file_index + 1] == "0"){


              // command is set to command start firmware write

               fota_cmd = CmdStartFirmwareWrite

               // payload test_buffer_type populated with 2 character S0
              
               test_buffer_type = Buffer.from("S0")


             }
             else if(contents[file_index + 1] == "3"){

                // command is set to command start firmware write

               fota_cmd = CmdStartFirmwareWrite
               
               // payload test_buffer_type populated with 2 character S3
               test_buffer_type = Buffer.from("S3")
             }
             else if(contents[file_index + 1] == "5"){
 
             
                // if S5 is detected then the end of file has reached and the smartphone app
                // has to tell the BMS MCU to jump to the newly written application.

               fota_cmd = CmdJumpToApp;
 
               

               // payload test_buffer_type populated with 2 character S3
               test_buffer_type = Buffer.from("S5")
 
               // Code to show that update is complete
 
               file_line_number = -3  // so that the file reading stops.
 
          
 
 
             }
           }




         }

         // populating the byte size, address, data and checksum from the srec file
       
 
         if(file_row_index >= 2){
           if(file_row_index%2 == 0){


             // test_buffer_data array is populated.
             // contents array consist of characters, 2 characters form 1 byte
             // after conversion to hex.


             test_buffer_data.push((convertToHex(contents[file_index])<<4)|(convertToHex(contents[file_index+1])))
 
           
           }
         
         
         }
 
       }


       // incrementing file_index and file_row_index to read the next set of characters in the same line of .srec file.
       file_index++;
       file_row_index++;
     
     
     
     }
 
 
     read_file_flag = 0;
     file_row_index = 0; // file_row_index is reset and is ready to traverse through the next row of Srec file 


     
 
       SendCommand(fota_cmd); // sending command depending on the data from srec file.
 
       // Send Srec Data

       /**
        * Encryption to be tested.
        * EncryptionActive set to 0. Indicating that the
        * Encryption is deactive.
        * RN RSA library can be utilised, however, MCU side does not have an
        * equivalent library. It needs to be created as per RN library. 
        */


       if(EncryptionActive == 1){

        test_buffer_data = EncryptDecrypt(test_buffer_data);

       }


       // writing the type + byte size + address + data + checksum from .srec file over BLE = total 136 bytes.
       WriteToUARTBuffer();
 
       // set the BLE to read the response from the MCU device only once when the .srec file write over BLE starts.
       if(linenumber == 0 && BootStarted == 1){  

         
         
         ReadFromUart(deviceid,'0783b03e-8535-b5a0-7140-a304d2495cb7','0783b03e-8535-b5a0-7140-a304d2495cb8');
       }
     
   }
 
 
 
 
 
 
 
 
 
 
 
 
   /**
    * @name           CheckUpdate
    * @abstract       Fetches the latest version from the backend.
    */
 
   function CheckUpdate(){
 
    console.log('checking update...\n')
 
   
    fetchLatestVersion();
 
 
   }

   /**
    * @name         GetBmsVersion()
    * @abstract      Sending the command(0x0000FF00) to fetch the version from the MCU.
    *                The command is 4 bytes and is sent 5 times, this makes sure that the 
    *                next transaction starts in a fresh BLE packet. MCU Rx Buffer is ready
    *                to receive 20 bytes. After receiving 20 bytes, it responds with a 4 byte
    *                version. 
    * 
    *                
    */
 
 function GetBmsVersion(){
 
      var i=0;
      // sending the command 5 times to exhaust BLE packet size.
      while(i<5){
 
        // only if the modal for scanning/connecting is disabled
        // then the version command is sent.

        if(display == false){
       
        FetchBmsVersion();
        }
        i = i + 1
    }
 
 }
 
 const disconnectFromDevice = (deviceId:string) => {
  if (deviceId) {
    BleManager.disconnect(deviceId)
      .then(() => {
        console.log('Disconnected successfully');
        setDeviceid("");
      })
      .catch(error => {
        console.error('Error disconnecting:', error);
      });
  } else {
    console.warn('No device connected');
  }
};







  /**
   * @name connect
   * @abstract This API is called when the user wants to connect to the listed BMS device. 
   *            Called from ButtonAction().
   * @param peripheralId - This is the peripheral ID of the BLE device
   * @param peripheralName - Name of the BLE device.
   */


 
  const connect = (peripheralId: string, peripheralName: string) => {



    console.log(" devicename :",peripheralName);
    console.log(" deviceid :",peripheralId);



    /**
     * Description : This API is used from the react-native BLE manager 
     * It is responsible for connecting the smartphone with the MCU (Battery
     * Management System).
     */

    BleManager.connect(peripheralId)
    .then(() => {
      // Success code
      console.log("Connected to device :",peripheralName);

      setDeviceName(DISPLAY_NAME); // changing the display name can hide the advertising name
                                   // from the users.

      setIsConnected(true); // flag set to tell that the device is connected.

      

      clearInterval(ScanTimer);

      // The modal responsible for scanning and listing the devices are set to visible=False.

      setModalVisible(!modalVisible);

    
      // API is called to fetch the firmware version from MCU. This API fetches the firmware version and
      // updates the UI. If the MCU does not respond the version is set to its default state 'N/A'.
      GetBmsVersion();


      SetDeviceConnected(true); // pop-up that indicates the user that they are connected
                                 // to the device. 
 
      // The app starts looking for updates from the backend.(COMMENTED OUT.)

      LookForUpdates(true); 
      
      // immediately look for update instead of 30 second wait time.

       // CheckUpdate(); // checking for update immediately.
 
     
    })
    .catch((error) => {
      // Failure code
      console.log(error);
      // Alert.alert(error, 'Failed to connect. Please try again connecting.');
     connect(peripheralId,peripheralName);
    });
  }




  /**
   * @name            handleAndroidPermissions
   * @abstract        Responsible for handling the bluetooth and location permissions
   *                  Without these permissions the BLE will not communicate.
   */
 
  const handleAndroidPermissions = () => {
 
    console.log('Checking for permissions...\n');
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
 
      ]).then(result => {
       
          console.debug(
            '[handleAndroidPermissions] User accepts runtime permissions android 12+, result:',result
          );
           
       
      });
    } else if (Platform.OS === 'android' && Platform.Version <= 30) {
     
          PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
             PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,]
          ).then(requestResult => {
            if (requestResult) {
              console.debug(
                '[handleAndroidPermissions] User accepts runtime permission android <12',requestResult
              );
             
            } else {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permission android <12',
              );
            }
          });
 
 
     
 
       
    }
  };



 
  const ButtonAction=(deviceName:string,deviceId:string)=>{
 
    console.log(deviceName);
    if (deviceName == 'Scan'){
        StartScan(); // starts scan for the device.
    }
    else{
        connect(deviceId,deviceName);
    }
  }


const QueueBmsParamReques = ()=>{
  
  if(queueComplete == true){
    console.log('Starting queue');
    queueComplete = false;
    RequestBmsParams();
    
  }
  else{
    console.log('Data in Queue....\n');
    return 0
  }
    


}

 
const RequestBmsParams = () =>{
 
  // CellVoltMaxChnl = 'A';
  // onChangeCellVoltMaxChnl(CellVoltMaxChnl);
 
  SendCommand(RequestAllBmsParams)
 
  // Waiting for response
 
  console.log('Waiting for response...\n')
 
  if(BmsRequestCount == 0){
 
    ReadBmsParams(deviceid,'0783b03e-8535-b5a0-7140-a304d2495cb7','0783b03e-8535-b5a0-7140-a304d2495cb8');
    BmsRequestCount = 1
  }
 
}


function unit(data:number):string{

  switch(data){
    case mV:
      return(" mV");
      break;
    
    case A:
      return(" A");
      break;

    case percent:
      return(" %");
      break;

    case celsius:
      return(" °C");
      break;

    default:
      break;
  }

  return '';
}
 

const SetBmsParam = (data:string[]) =>{
 
  console.log('Displaying BMS parameters...\n')

  
  // let map = [];
  // let list = ['CellVoltMaxChnl','CellVoltMinChnl','CellSumVolt','PackVoltage','LoadVoltage','TempSnsrMaxChnl','TempSnsrMinChnl','CellMinVolt','CellMaxVolt','SnsrMaxTemp','SnsrMaxTemp','CellMinSOC','CellMaxSOC','ActualSOC','AmbTemp','PackCurrent','BalStatus','StateMode'];
  
  // while(start < data.length)
  // {
    
  //   BMSdata[start].value = (data[start].charCodeAt(0)).toString() + (data[start + 1].charCodeAt(0)).toString();
  
  //   start+=2;
  // }
  //(data[0].charCodeAt(0) << 8 & 0xFF00) | (data[1].charCodeAt(0)) 
  
   console.log('cell voltage max',  (data[0].charCodeAt(0) << 8 & 0xFF00) | (data[1].charCodeAt(0)) )
   
    CellVoltMaxChnl = ((data[0].charCodeAt(0) << 8 & 0xFF00) | (data[1].charCodeAt(0))).toString() + unit(mV);
    onChangeCellVoltMaxChnl(CellVoltMaxChnl);


  // // console.log('Cell volt max channel: ',CellVoltMaxChnl)
   CellVoltMinChnl = ((data[2].charCodeAt(0) << 8 & 0xFF00) | (data[3].charCodeAt(0))).toString() + unit(mV);
   onChangeCellVoltMinChnl(CellVoltMinChnl);
   
  CellSumVolt = ((data[4].charCodeAt(0) << 8 & 0xFF00) | (data[5].charCodeAt(0))).toString() + unit(mV);
  onChangeCellSumVolt(CellSumVolt);
   
  PackVoltage = ((data[6].charCodeAt(0) << 8 & 0xFF00) | (data[7].charCodeAt(0))).toString() + unit(mV);
  onChangePackVoltage(PackVoltage);
   
  LoadVoltage = ((data[8].charCodeAt(0) << 8 & 0xFF00) | (data[9].charCodeAt(0))).toString() + unit(mV);
  onChangeLoadVoltage(LoadVoltage);
   
  TempSnsrMaxChnl = ((data[10].charCodeAt(0) << 8 & 0xFF00) | (data[11].charCodeAt(0))).toString()+ unit(celsius);
  onChangeTempSnsrMaxChnl(TempSnsrMaxChnl);
   
  TempSnsrMinChnl = ((data[12].charCodeAt(0) << 8 & 0xFF00) | (data[13].charCodeAt(0))).toString() + unit(celsius);
  onChangeTempSnsrMinChnl(TempSnsrMinChnl);
   
  CellMinVolt = ((data[14].charCodeAt(0) << 8 & 0xFF00) | (data[15].charCodeAt(0))).toString() + unit(mV);
  onChangeCellMinVolt(CellMinVolt);
   
  CellMaxVolt = ((data[16].charCodeAt(0) << 8 & 0xFF00) | (data[17].charCodeAt(0))).toString() + unit(mV);
  onChangeCellMaxVolt(CellMaxVolt);
   
  SnsrMinTemp = ((data[18].charCodeAt(0) << 8 & 0xFF00) | (data[19].charCodeAt(0))).toString()+unit(celsius);
  onChangeSnsrMinTemp(SnsrMinTemp);
   
   
  SnsrMaxTemp = ((data[20].charCodeAt(0) << 8 & 0xFF00) | (data[21].charCodeAt(0))).toString() + unit(celsius);
  onChangeSnsrMaxTemp(SnsrMaxTemp);
   
  CellMinSOC = ((data[22].charCodeAt(0) << 8 & 0xFF00) | (data[23].charCodeAt(0))).toString() + unit(percent);
  onChangeCellMinSOC(CellMinSOC);
   
  CellMaxSOC = ((data[24].charCodeAt(0) << 8 & 0xFF00) | (data[25].charCodeAt(0))).toString() +unit(percent);
  onChangeCellMaxSOC(CellMaxSOC);
   
  ActualSOC = ((data[26].charCodeAt(0) << 8 & 0xFF00) | (data[27].charCodeAt(0))).toString() + unit(percent);
  onChangeActualSOC(ActualSOC);
   
  AmbTemp = ((data[28].charCodeAt(0) << 8 & 0xFF00) | (data[29].charCodeAt(0))).toString() +unit(celsius);
  onChangeAmbTemp(AmbTemp);
   
  PackCurrent = ((data[30].charCodeAt(0) << 8 & 0xFF00) | (data[31].charCodeAt(0))).toString() +unit(A);
  onChangePackCurrent(PackCurrent);
   
  BalStatus = ((data[32].charCodeAt(0) << 8 & 0xFF00) | (data[33].charCodeAt(0))).toString();
  onChangeBalStatus(BalStatus);
   
  StateMode = ((data[34].charCodeAt(0) << 8 & 0xFF00) | (data[35].charCodeAt(0))).toString() ;
  onChangeStateMode(StateMode);
   
  Position = ((data[36].charCodeAt(0) << 8 & 0xFF00) | (data[37].charCodeAt(0))).toString();
  onChangePosition(Position);
   
  
  }




 
  const DisconnectDevice =()=>{
 
  }


async function ReadBmsParams(peripheral: string, service: string, characteristic:string){
 
    console.log("\n\n\n\nREADING BMS PARAMETERS....\n");
    var i=0;
    Data_from_Bms = []
    

    await BleManager.retrieveServices(peripheral)


    // Can try with startNotificationUseBuffer and specify the number of bytes in the buffer.
    // waits for 40 bytes
    // Each battery pack parameter is uint16 data type.

    BleManager.startNotification(
      peripheral,
      service,
      characteristic

    )
    bleManagerEmitter.addListener(
      "BleManagerDidUpdateValueForCharacteristic",
      ({ value, peripheral, characteristic, service }) => {
        // Convert bytes array to string
        const data = String.fromCharCode(...value);
       
        console.log(`BMS Parameters: ${data}, showing on UI...\n`);

        // to test the battery parameters. //NOT NEEDED
 
        
       
          while(length<20){

            Data_from_Bms.push(data[length]);
            length +=1;

          }
          
          length = 0;

        
        if(Data_from_Bms.length <= BMS_BATTERY_PACK_DATA_COUNT) {
          RequestBmsParams();
        }
        
        console.log('length:',Data_from_Bms.length)
        console.log('data:',Data_from_Bms)

        if(Data_from_Bms.length == BMS_BATTERY_PACK_DATA_COUNT){

          

          console.log('bms data complete:',Data_from_Bms)

          BleManager.stopNotification(
            peripheral,
            service,
            characteristic
          )
            bleManagerEmitter.removeAllListeners("BleManagerDidUpdateValueForCharacteristic");
            
            SetBmsParam(Data_from_Bms)

            queueComplete = true;
            BmsRequestCount = 0; // new read notification can start.

         }

        
 
        
       
       
       
      }
    );
     
   
   
 
  }
 
  // dialog box that handles the update cancel from the user.
  function handleDialogCancel(){
    OnDialogVisible(false);
    console.log('cancelling Update...\n');
  }


  // pop-up dialog box to indicate to the user that the update process is complete.
  function handleUpdtCompDialog(){
    
    SetUpdateCompleteDialogVisible(false);
    SetUpdateAvailableDialogVisible(false);
    
  }


  // Dialog box that confirms the update process from the user.

  function handleDialogOk(){

    SetUpdateAvailableDialogVisible(false);
    OnDialogVisible(false);
    console.log('Starting update....\n');
    console.log('BMS version',BmsVersion);
    //bleManagerEmitter.removeAllListeners("BleManagerDidUpdateValueForCharacteristic");
    if(BmsVersion == '0.0.0.0'){
      
      BootStarted = 1;

      // Starts the update process. Takes the line number as the argument.

      StartUpdate(0);
     
    }
 
    else{
      console.log('HERE HERE');
      //InitUpdate();
      BootStarted = 0;
     
      JumpToBootloader();
    }
    setModalProgressVisible(true);
    //
   
  }
 
 
  const JumpToBootloader = () =>{
 
    console.log('Sending Command for jump\n');
 
    SendCommand(CmdJumpToBootloader); // sending command to jump to bootloader.
 
   
 
    ReadFromUart(deviceid,'0783b03e-8535-b5a0-7140-a304d2495cb7','0783b03e-8535-b5a0-7140-a304d2495cb8');
 
 
  }
 
  function StartScanTimer(){
 
    clearInterval(ScanTimer);
 
    setDeviceName("Scan");
    setScanDisable(false);
 
  }
 
 
 
 /**
  * @name             StartScan
  * @abstract         This API is responsible for scanning for devices.
  */
  const StartScan = () => {
 
 
    
    setDeviceName("Scanning...");
    setScanDisable(true);
   
    handleAndroidPermissions() // handling bluetooth and location permissions
   

    // react-native ble manager API to start the phone's bluetooth
   BleManager.start({ showAlert: false }).then(() => {
     // Success code
     console.log("Module initialized");
     
   });

   // react-native ble manager API to enable the phone's bluetooth
   BleManager.enableBluetooth().then(() => {
     // Success code
     console.log("Bluetooth Enabled");
     
   });
 
   setPeripherals(new Map<Peripheral['id'], Peripheral>());


    // react-native ble manager API to scan for all devices.
    // devices are filtered out based on the preset device name.
 
   BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
     matchMode: BleScanMatchMode.Sticky,
     scanMode: BleScanMode.LowLatency,
     callbackType: BleScanCallbackType.AllMatches,
   }).then(() => {
     // Success code
     console.log("Scan started for ",SECONDS_TO_SCAN_FOR, "seconds");
     ScanTimer = setInterval(()=>{StartScanTimer()},(SECONDS_TO_SCAN_FOR*1000 + 3000));
   
   }).catch(err => {
     console.error('[startScan] ble scan returned in error', err);
   });
 
 
 
   // APIs to stop scan.
   const stopScan = () =>{
      console.log('Stopping Scan...\n')
     BleManager.stopScan();
 
   }



   /**
    * @name                   handleDiscoverPeripheral
    * @abstract               The discovered peripherals are listed here. They are filtered out based on the name given to BLE DA14531.
    * @param                  peripheral 
    */
 
   const handleDiscoverPeripheral = (peripheral: Peripheral) => {
 
 
              console.log('Device Name',peripheral.name)
          
              if(peripheral.name == DEVICE_NAME){
          
              
                setDeviceName(peripheral.name);
                setDeviceid(peripheral.id);
          
                setScanDisable(false);
                stopScan();
            
                device_name_color = "blue"
                setTextColor(device_name_color)
              
          
              }

 
   };


   
 
   const listeners = [
     bleManagerEmitter.addListener(
       'BleManagerDiscoverPeripheral',
       handleDiscoverPeripheral,
     )
   ];
 
 }
 
  useEffect(() => {
    // Show modal after 2 seconds
    const timer = setTimeout(() => {
      setModalVisible(true);
    }, 2000);

  
    

// if(!modalVisible && !isConnected)
// {
// // Show modal after 2 seconds
// const scanRequest = setInterval(() => {
//   setModalVisible(true);
// }, 5000);
 

// }
    
   
 
    const unsubscribe = navigation.addListener('focus', () => {
      // Trigger the pop animation for the subcontainer
      Animated.spring(subcontainerScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    });
 
 
 
    // Clean up the listener
    return()=>{
      unsubscribe;
      clearInterval(BmsDataTimer);
    }
 
   
  }, [navigation]);
 
  interface BMSCommandList {
    id: string;
    name: string;
    value:string;
    // Add more properties as needed
  }
  const renderItem: ListRenderItem<BMSCommandList> = ({item}) => {
    return (
      <ScrollView style={{  paddingTop: 20,  }}>
        <View style={[styles.card,styles.elevation]} >
          <View style={{padding:3,alignItems:'center',marginVertical:'5%'}}>
          <Text style={{color:'black',fontWeight:'bold',fontSize:18,alignContent:'center'}}>{item.name} </Text>
          </View>
 
          <View style={{padding:3,alignItems:'center'}}>
          <Text style={{color:'black',fontWeight:'bold',fontSize:32}}>{item.value}</Text>
          </View>
        </View>
      </ScrollView>
    );
  };
 
 

 
  return (
 
   
 
    <ImageBackground
        style = {styles.backGround}
        source={require('../assets/HeavyDutyBatteries.jpg')}
        >  
   
 
   
   
   
    
   
    <View style={styles.popContainer}>
 
   
      {display ? (
        <>
            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20, paddingVertical: '5%', textAlign: 'center' }}>BMS Version: {BmsVersion}</Text>
            <TouchableOpacity style={{ marginHorizontal: '5%', marginVertical: '-4%' }} onPress={() => UpdateVersion()}>
                <Text style={styles.buttonbackGround}> Update</Text>
            </TouchableOpacity>
        </>
      ) : (
            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20, paddingVertical: '10%', textAlign: 'center' }}>BMS Version: {BmsVersion}</Text>
      )}
             
 
               
    </View>
   

    <View style={[styles.subcontainer]}>
          
            <Text style={{color:'gray',fontSize:24,fontWeight:'bold',paddingTop:'5%',paddingBottom:'5%'}} > Battery Pack Details</Text>
            <ToggleSwitch
              isOn={toggleButton}
              onColor="green"
              offColor="red"
              label={toggleLabel}
              labelStyle={{ color: "black", fontWeight: "900" }}
              size="small"
              onToggle={isOn=> BmsParamSweep(!toggleButton)}
              
            />

                <View>
                        <FlatList
                          data={BMSdata}  
                          renderItem={renderItem}
                          numColumns={2}
                          
                          />  
                          
                          
                </View>


    </View>

      
    
     
 
 
    <View style={{marginVertical:'10%', alignItems: "center"}}>
     
         <SafeAreaView style={styles.container}>  
       <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
              
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <Text style={{color:'black',fontWeight:'bold',fontSize:25,textAlign:'center',marginBottom:'10%'}}>Battery Pack</Text>
              
              {devideName !='Scan' ? (
                <>
                 <Text style={{color:'black',fontSize:20,textAlign:'center'}}>Click to Connect with BMS</Text>
                </>
              ) : (
                <Text style={{color:'black',fontSize:20,textAlign:'center'}}>Click to Scan for BMS</Text>
              )}
              <View style={{marginVertical:'10%',width:'50%'}}>
              <TouchableOpacity disabled={scanDisable} onPress={()=>ButtonAction(devideName,deviceid)}>
                  <Text style={styles.buttonbackGround}>{devideName}</Text>
                </TouchableOpacity>
                </View>
              </View>
            </View>
        </Modal>


        <Modal
            animationType="slide"
            transparent={true}
            visible={modalProgressVisible}
            onRequestClose={() => setModalProgressVisible(false)}>
            <View style={styles.ProgressCenteredView }>
             
              <View style={styles.modalProgressView}>
              <View>
              <Text style={{color:'black',fontWeight:'bold',marginVertical:'-20%',fontSize:20}}>Updating Your BMS</Text>
              </View>
              <Progress.Circle progress={BmsProgress} indeterminate={false} color='black' showsText={true} size={100} />
              </View>
            </View>
        </Modal>
        </SafeAreaView>
 
        <Dialog.Container visible={DialogVisible}>
        <Dialog.Title>Update</Dialog.Title>
        <Dialog.Description>
          Do you want to continue with the update? You will not be able to use the vehicle during update.
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleDialogCancel} />
        <Dialog.Button label="OK" onPress={handleDialogOk} />
      </Dialog.Container>

      <Dialog.Container visible={UpdateCompleteDialogVisible}>
        <Dialog.Title>Update</Dialog.Title>
        <Dialog.Description>
          Update completed successfully. Rebooting the BMS....
        </Dialog.Description>
        <Dialog.Button label="OK" onPress={()=>SetUpdateCompleteDialogVisible(false)} />
      </Dialog.Container>

      <Dialog.Container visible={UpdateAvailableDialogVisible}>
        <Dialog.Title>Update Available</Dialog.Title>
        <Dialog.Description>
        BMS update available. Click the update button to proceed.
        </Dialog.Description>
        <Dialog.Button label="OK" onPress={()=>SetUpdateAvailableDialogVisible(false)} />
      </Dialog.Container>
       

      <Dialog.Container visible={DeviceConnected}>
        <Dialog.Title>Connected</Dialog.Title>
        <Dialog.Description>
        Connected  to {devideName}. Change the name of the device to proceed.
        </Dialog.Description>
        <Dialog.Button label="OK" onPress={()=>SetDeviceConnected(false)} />
      </Dialog.Container>
     
    </View>
 
   
 
   
    </ImageBackground>
  );
};
 
export default BluetootStartScan;
 
const styles = StyleSheet.create({
 
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
 
  height: "90%",
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
mainConatinerStyle: {
  flexDirection: 'column',
  flex: 1
},floatingMenuButtonStyle: {
  alignSelf: 'flex-end',
  position: 'absolute',
  bottom: 35
}
 
 
})