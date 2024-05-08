require('dotenv').config()
const express = require('express')
const morgan = require('morgan');
const app = express()
const cors = require('cors')
const Person = require('./models/person')

morgan.token('postData', (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.static('dist'))
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));
app.use(cors())


let persons = []

app.get('/api/persons', (request, response) => {
  // 3 yerden de calisiyor
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  // Ui'den calisiyor
  Person.countDocuments({})
      .then(count => {
          const time = new Date();
          response.send(`
              <p>Phonebook has info for ${count} people</p>
              <p>Last updated: ${time}</p>
          `);
      })
});

app.get('/api/persons/:id', (request, response) => {
  // 3 yerden de calisiyor
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).json();
            }
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
  // 3 yerden de calisiyor
  Person.findByIdAndDelete(request.params.id)
      .then(result => {
          if (result) {
              response.status(204).end();
          }
      })
      .catch(error => next(error));
});

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined && body.number=== undefined) {
    return response.status(400).json({ error: 'The name or number is missing indexten' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})