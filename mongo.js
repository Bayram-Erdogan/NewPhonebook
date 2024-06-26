const mongoose = require('mongoose')
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://Bayram:${password}@cluster0.fblymll.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Person = mongoose.model('Person', personSchema)

if (name && number) {
    const person = new Person({
      name: name,
      number: number,
    })

    person.save().then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      console.log('phonebook:')
      Person.find({}).then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
    })
  } else {
    console.log('The name or number is missing')
    mongoose.connection.close()
  }

  module.exports = mongoose.model('Person', personSchema)

