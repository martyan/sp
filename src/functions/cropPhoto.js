const functions = require('firebase-functions')
const admin = require('firebase-admin')
const { join, dirname } = require('path')
const { tmpdir } = require('os')
const sharp = require('sharp')
const fs = require('fs-extra')

module.exports = functions.storage
    .object()
    .onFinalize(async object => {
        const bucket = admin.storage().bucket(object.bucket)
        const filePath = object.name
        const fileName = filePath.split('/').pop()
        const CROPPED_PATH = 'photos/cropped/'

        const workingDir = join(tmpdir(), 'cropped')
        const tmpFilePath = join(workingDir, fileName)

        // only images accepted
        if(!object.contentType.startsWith('image/')) return console.log('Not an image.', object.contentType)

        // crop only from full res photos
        if(!filePath.startsWith('photos/full/')) return console.log('Crop not needed.', filePath)

        const id = fileName.split('.').shift()
        const photoDetail = await admin.firestore().collection('photos').doc(id).get()
        if(!photoDetail.exists) return console.log(`No info about photo ${id}.`)

        const cropInfo = photoDetail.data().croppedArea

        // 1. Ensure thumbnail dir exists
        await fs.ensureDir(workingDir)

        // 2. Download Source File
        await bucket.file(filePath).download({
            destination: tmpFilePath
        })

        // 3. Crop image
        const croppedPath = join(workingDir, `cropped_${fileName}`)
        await sharp(tmpFilePath)
            .extract({ width: cropInfo.width, height: cropInfo.height, left: cropInfo.x, top: cropInfo.y })
            .toFile(croppedPath)

        await bucket.upload(croppedPath, {
            destination: join(CROPPED_PATH, fileName)
        })

        // 5. Cleanup remove the tmp/thumbs from the filesystem
        return fs.remove(workingDir)
    })
