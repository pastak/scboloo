'use strict'
const test = require('ava')
const Formatter = require('../../libs/formatter')

test('isValid', t => {
  const formatter = new Formatter('../fixtures/check_must_key.json')
  t.ok(formatter.isValid === false)
})

test('checkUnsupportedKeyOrProps', t => {
  const formatter = new Formatter('../fixtures/manifest.json')
  t.ok(formatter.checkUnsupportedKeyOrProps() === false)
})

test('checkMustKey', t => {
  const formatter = new Formatter('../fixtures/check_must_key.json')
  t.ok(formatter.checkMustKey() === false)
  t.ok(formatter.shouldContainKeys.indexOf('applications') > -1 === true)
  t.ok(formatter.shouldContainKeys.indexOf('manifest_version') > -1 === true)
  t.ok(formatter.shouldContainKeys.indexOf('name') > -1 === true)
  t.ok(formatter.shouldContainKeys.indexOf('version') > -1 === true)

  const formatter2 = new Formatter('../fixtures/check_must_key_pass.json')
  t.ok(formatter2.checkMustKey() === true)
  t.is(formatter2.shouldContainKeys.length, 0)
})

test('fillMustKey `applications`', t => {
  // Write Only Id String
  const formatter = new Formatter('../fixtures/check_must_key.json')
  formatter.fillMustKey('applications', 'sample-extension@example.com')
  t.is(formatter.shouldContainKeys.indexOf('applications') > -1, false)
  t.is(formatter.json.applications.gecko.id, 'sample-extension@example.com')
  t.is(formatter.validApplicationsKey(), true)

  // Write `id`'s Key and Val
  const formatter2 = new Formatter('../fixtures/check_must_key.json')
  formatter2.fillMustKey('applications', {id: 'sample-extension@example.com'})
  t.is(formatter2.shouldContainKeys.indexOf('applications') > -1, false)
  t.is(formatter2.json.applications.gecko.id, 'sample-extension@example.com')
  t.is(formatter2.validApplicationsKey(), true)

  // Write Full Structor
  const formatter3 = new Formatter('../fixtures/check_must_key.json')
  formatter3.fillMustKey({
    applications :{
      gecko: {id: 'sample-extension@example.com'}
    }
  })
  t.is(formatter3.shouldContainKeys.indexOf('applications') > -1, false)
  t.is(formatter3.json.applications.gecko.id, 'sample-extension@example.com')
  t.is(formatter3.validApplicationsKey(), true)

  // Write invalid Id String
  const formatter4 = new Formatter('../fixtures/check_must_key.json')
  formatter4.fillMustKey('applications', 'authoradgadkdaldgau')
  t.is(formatter4.shouldContainKeys.indexOf('applications') > -1, false)
  t.is(formatter4.validApplicationsKey(), false)

  // Write invalid Id String
  const formatter5 = new Formatter('../fixtures/check_must_key.json')
  formatter5.fillMustKey('applications', 'author+amo@example.com')
  t.is(formatter5.shouldContainKeys.indexOf('applications') > -1, false)
  t.is(formatter5.validApplicationsKey(), false)
})

test('fillMustKey `version`', t => {
  const formatter = new Formatter('../fixtures/check_must_key.json')
  formatter.fillMustKey('version', '0.0.1')
  t.is(formatter.shouldContainKeys.indexOf('version') > -1, false)
  t.is(formatter.json.version, '0.0.1')

  const formatter2 = new Formatter('../fixtures/check_must_key.json')
  formatter2.fillMustKey({version: '0.0.1'})
  t.is(formatter2.shouldContainKeys.indexOf('version') > -1, false)
  t.is(formatter2.json.version, '0.0.1')
})
test('fillMustKey `manifest_version`', t => {
  const formatter = new Formatter('../fixtures/check_must_key.json')
  formatter.fillMustKey('manifest_version', '2')
  t.is(formatter.shouldContainKeys.indexOf('manifest_version') > -1, false)
  t.is(formatter.json.manifest_version, '2')

  const formatter2 = new Formatter('../fixtures/check_must_key.json')
  formatter2.fillMustKey({manifest_version: '2'})
  t.is(formatter2.shouldContainKeys.indexOf('manifest_version') > -1, false)
  t.is(formatter2.json.manifest_version, '2')

  const formatter3 = new Formatter('../fixtures/check_must_key.json')
  formatter3.fillMustKey('manifest_version')
  t.is(formatter3.shouldContainKeys.indexOf('manifest_version') > -1, false)
  t.is(formatter3.json.manifest_version, '2')
})
test('fillMustKey `name`', t => {
  const formatter = new Formatter('../fixtures/check_must_key.json')
  formatter.fillMustKey('name', 'test')
  t.is(formatter.shouldContainKeys.indexOf('name') > -1, false)
  t.is(formatter.json.name, 'test')

  const formatter2 = new Formatter('../fixtures/check_must_key.json')
  formatter2.fillMustKey({name: 'test'})
  t.is(formatter2.shouldContainKeys.indexOf('name') > -1, false)
  t.is(formatter2.json.name, 'test')
})

test('fillMustKeys', t => {
  const formatter = new Formatter('../fixtures/check_must_key.json')
  formatter.fillMustKey('applications', 'sample-extension@example.com')
  formatter.fillMustKey('name', 'test')
  formatter.fillMustKey('manifest_version')
  formatter.fillMustKey('version', '0.0.1')
  t.is(formatter.shouldContainKeys.length, 0)
  t.is(formatter.json.name, 'test')
  t.is(formatter.isValid, true)
})
