'use strict'
let Git = require('nodegit')
let promisify = require('es6-promisify')
let rimraf = promisify(require('rimraf'))
let fs = require('fs')
let readdir = promisify(fs.readdir)
let readFile = promisify(fs.readFile)
let yaml = require('js-yaml')
let _ = require('lodash')

let menteesRepo = process.env.REPO || 'https://github.com/CADBOT/students-and-mentees'
let requiredStudentProps = yaml.safeLoad(fs.readFileSync('./conf.yaml')).requiredStudentProperties

console.log('loading students')
module.exports = (studentsCache) => {
  rimraf('./cache')
    .then(() => Git.Clone(menteesRepo, './cache'))
    .then(repo => readdir('./cache/students'))
    .then(students => {
      students.forEach(student => {
        try {
          readFile(`./cache/students/${student}`).then(file => {
            let doc = yaml.safeLoad(file)
            // verify the student schema is valid
            if (_.isEqual(Object.keys(doc), requiredStudentProps)) {
              studentsCache.push(doc)
            }
            else {
              console.log(`Invalid doc found: ${doc}`)
            }
          }).catch(e => console.log(e))
        }
        catch (e) {
          console.log(e)
        } 
      })
    }).catch(e => {
      console.log(e)
    })
}
