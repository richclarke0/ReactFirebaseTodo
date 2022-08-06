###### *Press CMD+K, then V to preview this file in a side panel in VScode.*
# React + Firebase ToDo App

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