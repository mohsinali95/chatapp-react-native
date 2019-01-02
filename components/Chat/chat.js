import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import axios from"axios"
import Icon from 'react-native-vector-icons/FontAwesome';
export default class Chat extends Component {
    constructor(props) {
      super(props)
      this.state = {
        // messages: [
        //   {uid :1, msg: 'asdasdasdasd'},
        //   {uid :2, msg: 'mosasdasd'},
        //   {uid :2, msg: 'mosasdasd'},
        //   {uid :1, msg: 'mosasdasd'},
        // ],
        messages: '',
        currentUser: {},
        msg: ''
      }
    }

    componentWillMount(){
      AsyncStorage.getItem('user',(err,res)=>{
        if(res === null){
          this.props.navigation.navigate('login')
        }else{
          this.setState({
            currentUser: JSON.parse(res)
          });
          const { navigation } = this.props;
          const userId = navigation.getParam('userId', 'NO-ID')
          setInterval(()=>{
            axios.get(`http://192.168.0.105:8000/getMsgs/${JSON.parse(res).uid}/${userId}`).then((res) =>{
              this.setState({
                messages: res.data
              })
            }).catch(err=>{
              alert(err)
            })
          },1000)
        }
      })
    }

    sendMsg(user,userId){
      let obj = {
        msg: this.state.msg,
        currentUser: this.state.currentUser,
        user,
        userId
      }

      axios.post('http://192.168.0.105:8000/sendMsg',obj).then((res)=>{
        this.setState({
          messages: res.data
        })
      }).catch(err => {
        alert(err)
      })
    }
    deleteMsg(){
      alert("Delete this message?")
    }

    render() {
        const { navigation } = this.props;
        const userId = navigation.getParam('userId', 'NO-ID')
        const user = navigation.getParam('user', 'NO-ID')
        let {messages, currentUser} = this.state;

        return (
             <View style={style.container} >
                <View style={style.upperTitle} elevation={10} >
                  <View style={style.backBtn}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                      <Text style={style.backText}>
                      <Icon name={'arrow-left'} size={25} />
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={style.NameSection}>
                    <Text style={style.backText}>
                      {user.name}
                    </Text>
                  </View>
                  <View style={style.backBtn}>
                  </View>
                </View>
                <View style={style.msgSection}>
                <ScrollView
                ref={ref => this.scrollView = ref}
                onContentSizeChange={(contentWidth, contentHeight)=>{        
                  this.scrollView.scrollToEnd({animated: true});
                }}
                >
                {
                  (messages != null && messages != '') ?
                    
                    Object.keys(messages).map( (msgId,ind) =>{
                      return(
                        <View key={ind} >
                        {(currentUser.uid == messages[msgId].senderid) ?
                          <View style={style.msgContainer}>
                            <View style={style.extraTile}></View>
                            <View style={style.msgTile}>
                              <Text style={style.msgText}>{messages[msgId].msg}</Text>
                            </View>
                          </View>
                          :
                          <View style={style.msgContainer}>
                            <View style={style.msgTileR}>
                            <TouchableOpacity  onLongPress={this.deleteMsg}>
                              <Text style={style.msgTextR}>{messages[msgId].msg}</Text>
                            </TouchableOpacity>
                            </View>
                            <View style={style.extraTile}></View>
                          </View>
                        }
                        </View>
                      )
                    })
                  :
                  null
                }

                </ScrollView>
                </View>
                <View style={style.inputSection} >
                  <View style={style.textInputSection}>
                    <TextInput placeholder="Enter message..." onChangeText={(msg) => this.setState({ msg })} style={style.textInput} />
                  </View>
                  <View style={style.sendBtnSection}>
                    <TouchableOpacity onPress={this.sendMsg.bind(this,user,userId)}>
                        <Text style={style.sendText}>
                          <Icon name={'reply'} size={25} />
                        </Text>
                    </TouchableOpacity>
                  </View>
                </View>
             </View >
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
    flexDirection: 'row',
    backgroundColor: "#8561c5",
    
  },
  msgSection:{
    flex: 8,
    backgroundColor: '#E6E6E6',
  },
  scroll:{
    justifyContent: 'flex-end'
  },
  msgTile:{
    flex:8,
    minHeight: 40,
    margin: 15,
    backgroundColor: '#8561c5',
    borderRadius:10,
    justifyContent: 'center',
  },
  msgTileR:{
    flex:8,
    minHeight: 40,
    margin: 15,
    backgroundColor: 'white',
    borderRadius:10,
    justifyContent: 'center',
  },
  msgText:{
    padding: 10,
    color: 'white',
  },
  msgTextR:{
    padding: 10,
    color: 'black',
  },
  extraTile:{
    flex: 2
  },
  msgContainer:{
    flexDirection: 'row',
  },
  inputSection:{
    flex:  1,
    flexDirection: 'row',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'white'
  },
  textInputSection:{
    flex:8,
    justifyContent: 'center',
    
  },
  textInput:{
    backgroundColor:'white',
    borderRadius: 10,
    
  },
  sendBtnSection:{
    flex:2,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  backBtn: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  NameSection: {
    flex: 9,  
    alignItems: 'center',
    justifyContent:'center', 
  },
  backText:{
    color: 'white',
    fontSize: 20
  },
  sendText:{
    borderRadius: 10,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    padding: 12,
    textAlign: 'center',
    backgroundColor: '#8561c5'
  }
})