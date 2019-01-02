import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
    BackHandler,
    ToastAndroid,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Spinner  from 'react-native-loading-spinner-overlay';
export default class Login extends Component {

    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            res: '',
            clickedPosition: 0,
            loading: false
        }
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
      );
    }

    componentDidMount() {
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
          BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
      }
    //   componentWillUnmount() {
    //     if (this._didFocusSubscription) {
    //       this._didFocusSubscription.remove();
    //     }
    //   }

    componentWillMount(){
        AsyncStorage.getItem('user',(err,res)=>{
            if(res !== null){
              this.props.navigation.navigate('lobby')
            }
        })
    }
    
      onBackButtonPressAndroid = () => {

          const {clickedPosition} = this.state;
  
          setTimeout(() => {
            this.setState({
                clickedPosition: 0
            });
          }, 2000);
  
        if (((clickedPosition === 1) && (this.props.navigation.isFocused()))) {
            Alert.alert(
                'Exit Application',
                'Do you want to quit application?', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
                }, {
                text: 'OK',
                onPress: () => BackHandler.exitApp()
                }], {
                cancelable: false
                }
            );
        }else{
            ToastAndroid.showWithGravity(
                'Press again to exit',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
            );
            this.setState({
                clickedPosition : 1
            })
        }
       
        return true
    }
    
    login(){
        let obj = {
            email : this.state.email,
            password: this.state.password
        }
        this.setState({
            loading: true
        })
        axios.post("http://192.168.0.105:8000/login",obj).then(res =>{
            
            if(res.data.success === true){
                AsyncStorage.setItem('user',JSON.stringify(res.data.user))
                this.setState({
                    loading: false
                })
                this.props.navigation.navigate('lobby')
            }else{
                this.setState({
                    loading: false
                })
                alert(res.data)
            }
        }).catch(err =>{
            alert(err)
        })
    }
    signUp(){
        this.props.navigation.navigate('signup')
    }
    render() {
      return (
        <View style={style.container}>
            <Spinner
            visible={this.state.loading}
            textContent={'Please Wait...'}
            textStyle={style.spinnerTextStyle}
            />
            <View style={style.upperView}>
                <Text style={style.heading}>Chat App</Text>
                <TextInput style={style.input} onChangeText={(email) => this.setState({email})} placeholder="Email"/>
                <TextInput style={style.input} onChangeText={(password) => this.setState({password})} placeholder="Password" secureTextEntry={true}/>
            </View>
            <View style={style.lowerView}>
                <View style={style.btnView}>
                    <TouchableOpacity style={style.btn} onPress={this.login.bind(this)}>
                        <Text style={style.btnText}>
                            Login
                        </Text>
                        <Icon name={"sign-in"} color="white" size={30}/>
                    </TouchableOpacity>
                </View>
                <View style={style.signUptextView}>
                    <Text style={style.signUptext}>
                        Do not have an accout?{" "}  
                        <Text style={style.signUpbtn} onPress={this.signUp.bind(this)}>
                            Sign Up here
                        </Text>
                    </Text>
                </View>
            </View>
        </View>
      ); 
    }
}

const style = StyleSheet.create({
    container :{
        flex: 1,
        backgroundColor: "white",
    },
    upperView:{
        flex: 2,
        backgroundColor: "#8561c5",
        justifyContent: 'flex-end'
    },
    lowerView: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
    },
    input:{
        backgroundColor: 'white',
        marginBottom: 15,
        borderRadius: 15,
        textAlign: 'center'
    },
    btn:{
        flexDirection: 'row',
        marginTop: 15,
        backgroundColor: '#3d5afe',
        alignItems:'center',
        justifyContent:'center',
        height: 55,
        borderRadius:25,
    },
    btnText:{
        color: 'white',
        fontSize: 20,
        marginRight: 5
    },
    heading:{
        color: 'white',
        fontSize: 35,
        textAlign: 'center',
        marginBottom: 30
    },
    signUptextView:{
        flex: 1,
        justifyContent: "flex-end",
        alignItems:"center",
        marginBottom: 5
    },
    signUptext:{
        fontSize: 16
    },
    signUpbtn:{
        fontWeight: "bold",
    },
    btnView:{
        flex: 1
    },
    spinnerTextStyle:{
        color: 'white'
    }
})