//todos.js

exports.getAllTodos = (req, res) => {
    todos = [
        {
            'id':'1',
            'title':'greeting',
            'body':"hello. is it me you're looking for?"
        },
        {
            'id':'2',
            'title':'another todo',
            'body':'i have a lot to do today'
        }
    ]
    return res.json(todos)
}