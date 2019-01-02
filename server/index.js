const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 8000 || process.env.PORT
const firebase = require('firebase')

app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())

var config = {

  };
  firebase.initializeApp(config);

app.get('/test', (req, res) => {
    res.send("Asdasdasd")
})
app.post('/login', (req, res) => {
    var email = req.body.email
    var password = req.body.password

    firebase.auth().signInWithEmailAndPassword(email,password).then(snapshot=>{
        var uid = snapshot.user.uid;
        var email = snapshot.user.email;
        var userref = firebase.database().ref(`users/${uid}`);
        userref.once('value').then(user => {
            let name = user.val().name
            let userobj ={
                uid,
                email,
                name
            }
            res.send({user: userobj, success: true})
        })

    }).catch((error)=>{
        res.send(error.message)
    })
})
app.post('/signup', (req, res) => {
    
    var email = req.body.email
    var password = req.body.password
    var name = req.body.name

    firebase.auth().createUserWithEmailAndPassword(email,password).then(snapshot=>{
        var uid = snapshot.user.uid;
        var email = snapshot.user.email;
        var name = req.body.name;
        var userref = firebase.database().ref(`users/${uid}`);
        userref.set({
            email : email,
            name: name
        })
        let userobj ={
            uid,
            email,
            name
        }
        res.send({user: userobj, success: true})
    }).catch((error)=>{
        res.send(error.message)
    })
  
})

app.get('/getAllUsers',(req, res) => {
    var userref = firebase.database().ref(`users`);
    userref.once('value').then(user => {
        res.send(user.val())
    }).catch(error =>{
        console.log(error)
    })
})

app.post('/sendMsg',(req,res) => {
    var currentUser = req.body.currentUser
    var msg = req.body.msg
    var user = req.body.user
    var userId = req.body.userId

    var currentUserMsg = firebase.database().ref(`users/${currentUser.uid}/messages/${userId}`);
    currentUserMsg.push({
        reciverName: user.name,
        reciverid: userId,
        msg,
        senderName: currentUser.name,
        senderid: currentUser.uid,
    })
    currentUserMsg.once('value',(snapshot)=>{
       res.send(snapshot.val());
    })
    var userMsg = firebase.database().ref(`users/${userId}/messages/${currentUser.uid}`);
    userMsg.push({
        senderName: currentUser.name,
        senderid: currentUser.uid,
        msg,
        reciverName: user.name,
        reciverid: userId,
    })
})

app.get(`/getMsgs/:currentUserId/:userId`,(req,res,next) =>{
    var currentUserId = req.params.currentUserId
    var userId = req.params.userId
    var messages = firebase.database().ref(`users/${currentUserId}/messages/${userId}`)
    messages.once('value',(snapshot)=>{
        res.json(snapshot.val());
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
