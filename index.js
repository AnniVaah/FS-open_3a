require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
//const mongoose = require('mongoose')
const Person = require('./models/person')

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(express.json())
app.use(requestLogger)
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

 let persons = [/*
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"      
    },
    {
        id: 2,
        name: "Ada Lovalace",
        number: "39-44-5323523"      
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"      
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"      
    },

*/] 

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        console.log(persons)
        response.json(persons)
    })
    
})

app.get('/info', (request, response) => {
    const date = new Date()
    const responsetext = 
        '<p>Phonebook has info for ' + persons.length + ' people.</p>'+
        '<p>' + date + '</p>'
    response.send(responsetext)
})
 
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    console.log(id)
    Person.find({id: request.params.id}).then(person =>{
        console.log(person)
        response.json(person)
    })
    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const newId = Math.floor(Math.random()*10000000000000)
    return newId
    /* const maxId = notes.length > 0 
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1 */
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(request.body)

     if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

/*    if(persons.some(person => (person.name === body.name))){
        return response.status(400).json({
            error: 'name must be unique'
        })
    } */

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
