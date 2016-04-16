'use strict'
let Git = require('nodegit')
let promisify = require('es6-promisify')
let rimraf = promisify(require('rimraf'))
let readdir = promisify(require('fs').readdir)
let readFile = promisify(require('fs').readFile)
let yaml = require('js-yaml')

console.log('loading students')

module.exports = (studentsCache) => {
  rimraf('./cache').then(() => { 
    Git.Clone('https://github.com/CADBOT/students-and-mentees', './cache').then(repo => {
      console.log(repo)
      return readdir('./cache/students') 
    }).then(students => {
      students.forEach(student => {
        console.log(student)
        try {
          readFile(`./cache/students/${student}`).then(file => {
            let doc = yaml.safeLoad(file)
            studentsCache.push(doc)
          }).catch(e => console.log(e))
        }
        catch (e) {
          console.log(e)
        } 
      })
    }).catch(e => {
      console.log(e)
    })
  })
}
