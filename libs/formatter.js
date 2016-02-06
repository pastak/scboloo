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
    return this.isValid
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
      if (typeof key === 'string') {
        if (key === 'manifest_version') this.json.manifest_version = '2'
      } else {
        this.json = Object.assign(this.json, key)
      }
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
      } else {
        this.json[key] = val
      }
    }
    this.validator()
  }
  checkUnsupportedKeyOrProps () {
    const validKeys = ['applications', 'manifest_version', 'name', 'version', 'background', 'browser_action', 'content_scripts', 'default_locale', 'description', 'icons', 'page_action', 'permissions', 'web_accessible_resources']
    return Object.keys(this.json).filter(k => validKeys.indexOf(k) === -1).length === 0
  }
}
