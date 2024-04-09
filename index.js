const express = require('express')
const app = express()

app.use(express.json())


let persons = [
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

]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date()
    console.log(date)
    const responsetext = 
        '<p>Phonebook has info for ' + persons.length + ' people.</p>'+
        '<p>' + date + '</p>'
    response.send(responsetext)
})
 
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {          //jos löytyi
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    generateId()
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

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)
    console.log(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
