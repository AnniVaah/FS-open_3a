const express = require('express')
const app = express()
require('dotenv').config()

//const mongoose = require('mongoose')
const Person = require('./models/person')

app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
}

const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
const morgan = require('morgan')
app.use(morgan('tiny'))

 let persons = [] 

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
    Person.find({}).then(persons=> {
        const date = new Date()
        console.log('Montako?',persons.length)
        const responsetext = 
        '<p>Phonebook has info for ' + persons.length + ' people.</p>'+
        '<p>' + date + '</p>'
        response.send(responsetext)
    })

/* 
    const date = new Date()
    const responsetext = 
        '<p>Phonebook has info for ' + persons.length + ' people.</p>'+
        '<p>' + date + '</p>'
    response.send(responsetext) */
})
 
app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    console.log("request.params.id:",id)
    Person.findById(request.params.id)
    .then(person =>{
        if(person) {
            console.log(person)
            response.json(person)
        } else {
            console.log("no person found")
            response.status(404).end()
        }
    })
    .catch(error => next(error))    
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

/* const generateId = () => {
    const newId = Math.floor(Math.random()*10000000000000)
    return newId
    // const maxId = notes.length > 0 
    //     ? Math.max(...notes.map(n => n.id))
    //     : 0
    // return maxId + 1 
} */

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

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
