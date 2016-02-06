'use strict'
const fs = require('fs')
const path = require('path')
const GUID = require('guid')
const validKeys = require('./data/validKeys.json')
const notSupportProps = require('./data/notSupportProps.json')
module.exports = class Formatter {
  constructor (_path) {
    try {
      this.json = JSON.parse(fs.readFileSync(path.resolve(_path)))
    } catch (e) {
      throw new Error(e)
    }
    this.shouldContainKeys = []
    this.unSupportedKeys = []
    this.messages = []
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
    if (!(/^[A-Z|a-z|0-9|\-|\.]+@[a-z|A-Z|0-9|-]+\.[a-z-A-Z]+$/).test(id) || GUID.isGuid(id)) {
      this.messages.push(`Invaid id: ${id}`)
      return false
    }
    return true
  }
  checkMustKey () {
    this.shouldContainKeys = []
    const keys = ['applications', 'manifest_version', 'name', 'version']
    keys.forEach((key) => {
      if (!this.json.hasOwnProperty(key)) this.shouldContainKeys.push(key)
    })
    const result = this.shouldContainKeys.length === 0
    if (!result) {
      this.messages.push(`WebExtension must have keys: ${this.shouldContainKeys.join(', ')}`)
    }
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
  checkUnsupportedKey () {
    const containedKey = Object.keys(this.json).filter(k => validKeys.indexOf(k) === -1)
    if (containedKey.length === 0) {
      return true
    } else {
      this.messages.push(`WebExtension does not yet support keys: ${containedKey.join(', ')}`)
      return false
    }
  }
  searchUnsupportedProps (cb) {
    Object.keys(notSupportProps).filter(k => this.json.hasOwnProperty(k)).forEach(k => {
      const condition = notSupportProps[k]
      if (condition.hasOwnProperty('___type')) {
        if (condition.___type === 'keyword') {
          condition.___keyword.forEach(keyword => {
            if (Array.isArray(this.json[k])) {
              this.json[k].forEach(_k => {
                if (_k.indexOf(keyword) > -1) {
                  cb(k, keyword)
                }
              })
            } else if (typeof this.json[k] === 'string') {
              condition.___keyword.forEach(keyword => {
                if (this.json[k].indexOf(keyword) === -1) return
                cb(k, keyword)
              })
            }
          })
        }
      } else {
        condition.forEach(prop => {
          if (Array.isArray(this.json[k])) {
            this.json[k].forEach((item, index) => {
              if (typeof item === 'string') {
                if (item === prop) {
                  if (cb(k, prop) === 'delete') this.json[k].splice(this.json[k].indexOf(prop), 1)
                }
              } else {
                if (item.hasOwnProperty(prop)) {
                  if (cb(k, prop) === 'delete') delete item[prop]
                }
              }
            })
          } else {
            if (this.json[k].hasOwnProperty(prop)) {
              if (cb(k, prop) === 'delete') delete this.json[k][prop]
            }
          }
        })
      }
    })
  }
  checkUnsupportedProps () {
    let result = true
    this.searchUnsupportedProps((k, keyword) => {
      result = false
      this.messages.push(`${k} does'nt yet support keyword '${keyword}'`)
    })
    return result
  }
  deleteUnsupportedProps () {
    this.searchUnsupportedProps((k, keyword) => {
      this.messages.push(`Not supported "${keyword}" in "${k}"`)
      return 'delete'
    })
    this.validator()
  }
  deleteUnsupportedKey () {
    Object.keys(this.json)
      .filter(k => validKeys.indexOf(k) === -1)
      .forEach(k => {
        delete this.json[k]
        this.messages.push(`Delete key: ${k}`)
      })
    this.validator()
  }
  checkUnsupportedKeyOrProps () {
    return this.checkUnsupportedKey() && this.checkUnsupportedProps()
  }
}
