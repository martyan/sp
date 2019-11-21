const admin = require('firebase-admin')
admin.initializeApp()

const next = require('./next')
const onPhotoUpload = require('./onPhotoUpload')
const makeThumb = require('./makeThumb')

exports.next = next
exports.onPhotoUpload = onPhotoUpload
exports.makeThumb = makeThumb
