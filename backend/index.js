const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

/*
// for checking serrver
app.get('/', (req, res) => {
    res.send('Hello world!');
})
*/

mongoose.connect('mongodb://localhost:27017/todoApp')
    .then(() => {
        console.log('DB is connected!');
    })
    .catch((error) => {
        console.log(error);
    });

//let todos = [];

const todoschema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})

const todoModel = mongoose.model('Todo', todoschema);

// creating new values in todos
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);
    // res.status(201).json(newTodo);

    try {
        const newTodo = new todoModel({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }


})

// getting all items in todos
app.get('/todos', async (req, res) => {

    try {
        const todos = await todoModel.find();
        res.json(todos);
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// updating  a value in todos
app.put('/todos/:id', async (req, res) => {
    try {
        const { title, description } = req.body;
        const id = req.params.id;

        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(updatedTodo);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

// deleting a value in todos
app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

const port = 8000;

app.listen(port, () => {
    console.log('server is listening on port ' + port);
})