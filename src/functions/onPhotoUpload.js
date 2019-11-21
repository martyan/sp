const admin = require('firebase-admin')
const functions = require('firebase-functions')

module.exports = functions.storage.object().onFinalize(async (object) => {
    const imgData = {
        bucket: object.bucket,
        path: object.name
    }

    return admin.firestore().collection('hovno').add(imgData)
})
