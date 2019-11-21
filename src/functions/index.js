const admin = require('firebase-admin')
admin.initializeApp()

const next = require('./next')
const onPhotoUpload = require('./onPhotoUpload')

exports.next = next
exports.onPhotoUpload = onPhotoUpload
