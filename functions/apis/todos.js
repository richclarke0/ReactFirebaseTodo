//todos.js

//Original version
// exports.getAllTodos = (req, res) => {
//     todos = [
//         {
//             'id':'1',
//             'title':'greeting',
//             'body':"hello. is it me you're looking for?"
//         },
//         {
//             'id':'2',
//             'title':'another todo',
//             'body':'i have a lot to do today'
//         }
//     ]
//     return res.json(todos)
// }

const { db } = require('../util/admin'); 

//retrieve the todos
exports.getAllTodos = (request, response) => {
	db
		.collection('todos')
        .where('username','==',request.user.username) //added in auth
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

//get one of them
exports.getOneTodo = (request, response) => {
    const document = db.doc(`/todos/${request.params.todoId}`);
	document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Todo not found' })
            }
            // return document.delete();
            response.json(doc);
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

//add a todo
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
        createdAt: new Date().toISOString(),
        username: request.user.username,
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

//delete
exports.deleteTodo = (request, response) => {
    // this is really cool, .doc() is from firestore. 
    //i need to read more documentation on these commands
    const document = db.doc(`/todos/${request.params.todoId}`);
    //now lets do the manipulation of document
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Todo not found' })
            }
            if(doc.data().username !== request.user.username){
                return response.status(403).json({error:"Unauthorized"})
           }
            return document.delete();
        })
        .then(() => {
            response.json({ message: 'Delete successful!' });
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

//edit
exports.editTodo = ( request, response ) => { 
    //a little security, prevents manipulation of the ID or timestamp
    if(request.body.todoId || request.body.createdAt){
        response.status(403).json({message: 'Not allowed to edit todoId or createdAt fields'});
    }
    //lets get our document first
    let document = db.collection('todos').doc(`${request.params.todoId}`);
    //then push the update 
    document.update(request.body)
    .then(()=> {
        response.json({message: 'Updated successfully'});
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ 
                error: err.code 
        });
    });
};