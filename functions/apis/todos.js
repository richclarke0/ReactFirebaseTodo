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