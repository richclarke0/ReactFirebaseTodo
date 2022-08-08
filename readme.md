###### *Press CMD+K, then V to preview this file in a side panel in VScode.* This readme and project are based on this tutorial on [freecodecamp](https://www.freecodecamp.org):
[![ToDo Heading from FreeCodeCamp](readme_img/2022-08-06-12-43-42.png)](https://www.freecodecamp.org/news/how-to-build-a-todo-application-using-reactjs-and-firebase/)
<hr>

# React + Firebase ToDo App


![logo](readme_img/2022-08-06-00-46-23.png)
## Let's get started in here:
First create a Firebase app, name it whatever you want.  
Then run this: 
` npm install -g firebase-tools`  
Then you probably need to `firebase login`  
And then `firebase init`  
There is now a scrolling list in your CLI, select *`Functions: Configure a Cloud Functions directory and its files`*  
Language: `JavaScript`  
Eslint: `No`  
Install dependencies: `Yes`

Paste this into `functions/index.js`:
```js
const functions = require('firebase-functions');

exports.helloWorld = functions.https.onRequest((request, response) => {
     response.send("Hello from Firebase!");
});
```  
Then: `firebase deploy`  
At this point, Google may bug you to switch from their *Spark* account to their *Blaze* account. It's pay as you go.

Once that's done, go to the project in your browser. Click **Build** on the left side of the screen, then click **Functions** and mouseover the function to copy the URL. You can also look in your CLI right near where it says **Deploy complete!**, there is a line just above it with a clickable Function URL.  
*Congrats, you just created something in Firebase!*

## Next part: Installing Express
`npm i express`

Now create some folders and files  
 `mkdir functions/apis`  
 `touch functions/apis/todos.js`

Remove everything from the `index.js` and then copy-paste the following code:

```js
//index.js

const functions = require('firebase-functions');
const app = require('express')();

const {
    getAllTodos
} = require('./apis/todos') // make sure this matches the case of the dir name!

app.get('/todos', getAllTodos);
exports.api = functions.https.onRequest(app);
```
Now we have a route. When a user hits the `/todos` route, it will execute the `getAllTodos` function, which we will now write into the `todos.js` file in `functions/apis/`  
```js
//todos.js

exports.getAllTodos = (req, res) => {
    todos = [
        {
            'id': '1',
            'title': 'greeting',
            'body': 'Hello world from sharvin shah' 
        },
        {
            'id': '2',
            'title': 'greeting2',
            'body': 'Hello2 world2 from sharvin shah' 
        }
    ]
    return res.json(todos);
}
```
Now you `firebase deploy`  and press `y` when the `helloWorld` prompt to `Would you like to proceed with deletion?` comes up.

## Oh Noes! An Error

```
Error: There was an error deploying functions
```

This is not very helpful. What went wrong... hmmm. I went back through the code, and noticed this first (to be clear, this is *not* the error)
```js
const app = require('express')(); //this is not the error.
```
What's with those trailing `()`'s? I don't remember seeing that before when working with MERN apps. He's... invoking it as he requires it? I don't get it. This is something to explore more later.

Anyway, before long I found the culprit. In the original tutorial, the `apis` folder is `APIs`. This case sensitivity was the problem. My folder is called
```
react-firebase-todo/functions/apis
```
but the `require` in `index.js` is...
```js
require('./APIs/todos')
```
They don't match. I changed it to:
```js
require('./apis/todos')
```
Seved, and tried 'firebase deploy' again, and got my happy little **✔  Deploy complete!**

At this point, I tried to open the URL at `https://us-central1-thenameofmytodoapp.cloudfunctions.net/api/todos` and I got a big, fat 
<hr>

## **Error: Forbidden**
### **Your client does not have permission to get URL /api/todos from this server.**
<hr>

This is what I get for using a tutorial from 2020. I searched and found this on StackOverflow:
> *it happens to me after i upgraded all NPM packages and then deployed... i delete all the functions from the cloude and re-deplyed them. it solve me this error immediately. without change permisions or any other cahnge*

Kay... go to the functions panel on the firebase dashboard of the project, click the three dots to the right of my function, click **Delete Function**. Boom, function has been deleted.  
Now, `firebase deploy`... try the URL again...
*it works!*  

![](readme_img/2022-08-06-13-13-12.png)  

## Let's move on

Time to create a database. In the original GIF on the tutoral, there is only one type of database. I don't know which one to pick because there are now two types, 
- Firestore Database
- Realtime Database
 
Click **Firestore Database**  
 
Create a Firestore Database with the defaults, and make sure you click **Test Mode.**

Then click **Start Collection**  

Set **Collection ID** as **todos**  

Now, add these values using this set of fields:  

![](readme_img/2022-08-06-13-29-55.png)
You can use your current date and time.  
```js
{
    Field: title,
    Type: String,
    Value: some title
},
{
    Field: body,
    Type: String,
    Value: enter whatever you want here
},
{
    Field: createdAt,
    Type: timestamp,
    Value: Add the current date and time here
}
```
I tried to ignore **Document ID** and it wouldn't let me so I clicked **Auto-ID**.

`npm i firebase-admin`  
`mkdir functions/util`  
`touch util/admin.js`  
 ```js
 //admin.js

 const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

module.exports = { admin, db };
```
Open `todos.js`
```js
//todos.js

const { db } = require('../util/admin');

exports.getAllTodos = (request, response) => {
	db
		.collection('todos')
		.orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			let todos = [];
			data.forEach((doc) => {
				todos.push({
                    todoId: doc.id,
                    title: doc.data().title,
					body: doc.data().body,
					createdAt: doc.data().createdAt,
				});
			});
			return response.json(todos);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};
```

Lets unpack this a bit:

First, a little detour around **imports** since I was having a conversation around this today.
<!-- ![](readme_img/2022-08-06-15-58-23.png) -->
- In the file `admin.js`, we are exporting two different things:  
  ```js
  module.exports = { admin, db };
  ```
- When we import from the `admin.js` file `todos.js`, we have this line:
  ```js
     const { db } = require('../util/admin');
  ```
This command with the `{ db }` essentially "pulls" the `db` function from `admin.js` by itself.


Back to the tutorial.

In the code inside `todos.js`, we have db.collection.... a bunch of stuff. It's basically telling firebase what collection it's looking in, the order of the results, and more. The code is pretty intuitive.

Now I tried the `firebase serve` command out of the tutorial. I got a warning about my node version being 18 but it still worked.

```js
//return
[
  {
    "todoId": "wlfqnutSnp7U6K2RyIxW",
    "title": "my title is here",
    "body": "here is some text",
    "createdAt": {
      "_seconds": 1659820398,
      "_nanoseconds": 665000000
    }
  }
]
```

#### Now we need a "Create Todo" functionality
1. Require it in `index.js`
2. Write the method inside `todos.js`  
   
```js 
//index.js

const {
    ..,
    postOneTodo
} = require('./APIs/todos')

//don't forget this line like i did :D
app.post('/todo', postOneTodo);
```
So now, in `index.js` you have `const { getAllTodos, postOneTodo } = ...` etcetera. Destructuring the functions out of the `require`.

```js
//todos.js

exports.postOneTodo = (request, response) => {
     // i love the use of trim() here
    if (request.body.body.trim() === '') {
		return response.status(400).json({ body: 'Must not be empty' });
    }
    
    if(request.body.title.trim() === '') {
        return response.status(400).json({ title: 'Must not be empty' });
    }
    //creates a new todo object, parsing req.body and adding date()
    const newTodoItem = {
        title: request.body.title,
        body: request.body.body,
        createdAt: new Date().toISOString()
    }
    //now the actual db submission stuff
    db
        .collection('todos')
        .add(newTodoItem)
        .then((doc)=>{
            const responseTodoItem = newTodoItem;
            responseTodoItem.id = doc.id;
            return response.json(responseTodoItem);
        })
        .catch((err) => {
			response.status(500).json({ error: 'Something went wrong' });
			console.error(err);
		});
};
```

Now lets fire up Postman. Add this crap to the POST request:
```js
//remember that it is "api/todo" here, not "api/todos"
URL: http://localhost:5000/todoapp-<app-id>/<region-name>/api/todo

METHOD: POST
Text: JSON

//paste this part in
{
   "title":"Derpy meme POST",
   "body": "We put a POST in your POST so you can POST while you POST"
}
```
Make sure you set up Postman like this:  
![](readme_img/2022-08-08-10-44-14.png)


