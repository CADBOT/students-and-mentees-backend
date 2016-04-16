'use strict'
let express = require('express')
let app = express()


let studentData = []
// preload on initial creation
require('./lib/clone-repo')(studentData)

app.get('/students', (req, res) => {
  res.json(studentData)
})

// github webhook will notify on update
app.post('/update', (req, res) => {
  studentData = []
  require('./lib/clone-repo')(studentData)
  res.end()
})

app.listen(process.env.PORT || 3000)
