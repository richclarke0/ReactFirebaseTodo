//the beginning
// const functions = require('firebase-functions');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
     //   functions.logger.info("Hello logs!", {structuredData: true});
     //   response.send("Hello from Firebase!");
     // });
     
//first export
// const functions = require('firebase-functions');
// exports.helloWorld = functions.https.onRequest((request, response) => {
//      response.send("Hello from Firebase!");
// });

//next thing
const functions = require('firebase-functions');
const app = require('express')();

const {
    getAllTodos,
    postOneTodo,
    deleteTodo,
    editTodo,
    getOneTodo,
} = require('./apis/todos')

const auth = require('./util/auth.js');

const {
    loginUser,
    signUpUser,
    uploadProfilePhoto,
    getUserDetail,
    updateUserDetails
} = require('./apis/users')



//crud
app.get('/todos', auth, getAllTodos);
app.get('/todo/:todoId', auth, getOneTodo)
app.post('/todo', auth, postOneTodo);
app.delete('/todo/:todoId', auth, deleteTodo);
app.put('/todo/:todoId', auth, editTodo);

//users
app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);
app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);

exports.api = functions.https.onRequest(app);