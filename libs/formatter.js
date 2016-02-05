'use strict'
const fs = require('fs')
const path = require('path')
const GUID = require('guid')
module.exports = class Formatter {
  constructor (_path) {
    try {
      this.json = JSON.parse(fs.readFileSync(path.resolve(_path)))
    } catch (e) {
      throw new Error(e)
    }
    this.shouldContainKeys = []
    this.validator()
  }
  validator () {
    this.isValid = this.checkMustKey() &&
      this.checkUnsupportedKeyOrProps() &&
      this.validApplicationsKey()
  }
  validApplicationsKey () {
    const applications = this.json.applications
    if (!(applications &&
      applications.hasOwnProperty('gecko') &&
      applications.gecko.hasOwnProperty('id') &&
      applications.gecko.id)) return false
    const id = applications.gecko.id
    // Check Valid ID
    // NOTE: You can't use +
    if (!(/^[A-Z|a-z|0-9|\-|\.]+@[a-z|A-Z|0-9|-]+\.[a-z-A-Z]+$/).test(id) || GUID.isGuid(id)) return false
    return true
  }
  checkMustKey () {
    this.shouldContainKeys = []
    const keys = ['applications', 'manifest_version', 'name', 'version']
    keys.forEach((key) => {
      if (!this.json.hasOwnProperty(key)) this.shouldContainKeys.push(key)
    })
    const result = this.shouldContainKeys.length === 0
    return result
  }
  fillMustKey (key, val) {
    if (val === undefined) {
      // Set key as props
      Object.keys(key).forEach((k) => {
        this.json[k] = key[k]
      })
    } else {
      if (key === 'applications') {
        if (typeof val === 'string') {
          this.json.applications = {gecko: {id: val}}
        } else {
          if (val.hasOwnProperty('id')) {
            this.json.applications = {gecko: val}
          } else {
            this.json.applications = val
          }
        }
      }
    }
    this.validator()
  }
  checkUnsupportedKeyOrProps () {
    return true
  }
}
