import React from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    AsyncStorage,
    Alert,
} from 'react-native'
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
class MyBackButton extends React.Component {

    logout(){
        Alert.alert(
            'Logout From Application',
            'Do you want to Logout?', [{
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
            }, {
            text: 'OK',
            onPress: () => {        
                AsyncStorage.removeItem('user').then((res) =>{
                this.props.navigation.navigate('login')
            })}
            }], {
            cancelable: false
            }
        );

    }
  render() {
    return (
        <TouchableOpacity style={style.icon} onPress={this.logout.bind(this)}>
            <Icon  name={"sign-out"} color="white" size={30}/>
        </TouchableOpacity>
    );
  }
}

export default withNavigation(MyBackButton);

const style = StyleSheet.create({
    logoutTxt:{
        color: 'white',
        textAlign : 'center'
    },
    icon:{
        flex: 1,
        alignItems: 'center'
    }
})