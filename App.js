/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import Login from './components/login/Login';
import Lobby from './components/Lobby/Lobby';
import Signup from './components/signup/Signup';
import Chat from './components/Chat/chat';
import Logout from './components/Logout';
import {
  createStackNavigator,
  createAppContainer,
  createMaterialTopTabNavigator,
} from 'react-navigation';



const TabNavigator = createMaterialTopTabNavigator({
  // Home: HomeScreen,
  "My Chats": Lobby,
},{
  tabBarOptions: {
    
    labelStyle: {
      fontSize: 15,
    },
    style: {
      backgroundColor: '#8561c5',
    },
    indicatorStyle :{
      backgroundColor: 'black'
    },
  }
}
);


 

const MainNavigator = createStackNavigator({
  
  login: {screen: Login, navigationOptions: { header: null }},
  signup: {screen: Signup,navigationOptions: { header: null }},
  // lobby: {screen: Lobby, navigationOptions: { header: null } }, 
  lobby: {screen: TabNavigator,
    navigationOptions : { 
      title: "Chat App",
      headerLeft: null,
      headerRight: <Logout/>,
      headerStyle: {
        backgroundColor: '#673ab7',
      },
      headerTitleStyle: {
          color: 'white',
      },
    }
    
  }, 
  chat: {screen: Chat, navigationOptions: { header: null } }, 

});

// export default createAppContainer(TabNavigator);
const App = createAppContainer(MainNavigator);

export default App

