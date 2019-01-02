import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Alert,
  ToastAndroid
} from 'react-native';
import axios from"axios"
import Icon from 'react-native-vector-icons/FontAwesome';
export default class Lobby extends Component {
    constructor(props) {
      super(props)
      this.state = {
        users: {},
        currentUser: {}
      }
      props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
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
    componentWillMount(){
      AsyncStorage.getItem('user',(err,res)=>{
        if(res === null){
          this.props.navigation.navigate('login')
        }else{
          this.setState({
            currentUser: JSON.parse(res)
          });
        }
      })
    }
 
    componentDidMount(){
      axios.get('http://192.168.0.105:8000/getAllUsers').then(res => {
        this.setState({
          users: res.data
        })
      }).catch(err =>{
        alert(err)
      })

      this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
      );
    }

    openMessages(userId,user){
      this.props.navigation.navigate('chat',{
        userId,
        user
      })
    }
  
    
    render() {
      let { users,currentUser } = this.state
      return (
        <View style={style.container}>
          {/* <View style={style.upperTitle} elevation={10} >
            <Text style={style.title}>
              Users
            </Text>
          </View> */}
          <View style={style.userSection}>
            <ScrollView style={style.scroll} >
              {
                Object.keys(users).map(userId => {
                  return(
                    (currentUser.uid !== userId) ?
                        <TouchableOpacity onPress={this.openMessages.bind(this,userId,users[userId])} style={style.listView} key={userId}>
                          <View style={style.iconView}>
                            <Icon name={'user'} size={50} color="#8561c5" />
                          </View>
                          <View style={style.usernameView}>
                            <Text style={style.username} >
                              {users[userId].name}
                            </Text>
                          </View>
                        </TouchableOpacity>

                    :
                    null 
                  )
                })
              }
            </ScrollView>
          </View>
        </View>
      );
    }
}

const style = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#E6E6E6'  
  },
  upperTitle:{
    flex: 1,
    backgroundColor: "#8561c5",
    justifyContent: "center",
    alignItems: "center",
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  userSection:{
    flex: 4,
  },
  title:{
    color: 'white',
    fontSize: 45
  },
  listView:{
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'stretch',
    height: 70,
    margin: 5,
    backgroundColor: 'grey',
    borderRadius: 5
  },
  logout: {
    marginRight: 10,
    color: 'white',
    // fontSize: 15,
  },
  userRow:{
    flex: 1,
    // flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  iconView:{
    flex:1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white',
    borderRadius: 360
  },
  usernameView:{
    flex:2,
    backgroundColor: 'white',
    borderRadius: 5,
    justifyContent: 'center'
  },
  username:{
    marginLeft: 5,
      fontSize: 20
  }
})