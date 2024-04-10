const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://anniovaahtoranta:${password}@cluster0.fibovuc.mongodb.net/phoneNumberApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length===3) {
    Person.find({}).then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })
}else{
    const newName = process.argv[3]
    const newNumber = process.argv[4]

    const person = new Person({
        name: newName,
        number: newNumber
    })

    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    }) 
}

