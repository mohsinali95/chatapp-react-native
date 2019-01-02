import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
export default class Signup extends Component {

    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            name: '',
            res: ''
        }
    } 
  
    signup(){
        let obj = {
            email : this.state.email,
            password: this.state.password,
            name: this.state.name
        }
        axios.post("http://192.168.0.105:8000/signup",obj).then(res =>{
            alert(res.data)
            if(res.data.success === true){
                AsyncStorage.setItem('user',JSON.stringify(res.data.user))
                this.props.navigation.navigate('lobby')
            }else{
                alert(res.data)
            }
        })
    }
    login(){
        this.props.navigation.navigate('login')
    }
    render() {
      return (
        <View style={style.container}>
            <View style={style.upperView}>
                <Text style={style.heading}>Chat App</Text>
                <TextInput style={style.input} onChangeText={(name) => this.setState({name})} placeholder="Name"/>
                <TextInput style={style.input} onChangeText={(email) => this.setState({email})} placeholder="Email"/>
                <TextInput style={style.input} onChangeText={(password) => this.setState({password})} placeholder="Password" secureTextEntry={true}/>
            </View>
            <View style={style.lowerView}>
                <View style={style.btnView}>
                    <TouchableOpacity style={style.btn} onPress={this.signup.bind(this)}>
                        <Text style={style.btnText}>
                            Create Account
                        </Text>
                        <Icon name={"sign-in"} color="white" size={30}/>
                    </TouchableOpacity>
                </View>
                <View style={style.signUptextView}>
                    <Text style={style.signUptext}>
                        Already have an account?{" "}  
                        <Text style={style.signUpbtn} onPress={this.login.bind(this)}>
                            Sign in here
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
        paddingRight: 5
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
    }
})