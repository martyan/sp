const functions = require('firebase-functions')
const admin = require('firebase-admin')
const { join, dirname } = require('path')
const { tmpdir } = require('os')
const sharp = require('sharp')
const fs = require('fs-extra')

const getRatio = (ratioName) => {
    switch(ratioName) {
        case '5:1':
            return 5/1
        case '16:9':
            return 16/9
        case '4:3':
            return 4/3
        case '1:1':
            return 1/1
        case '3:4':
            return 3/4
        case '9:16':
            return 9/16
    }
}

module.exports = functions.storage
    .object()
    .onFinalize(async object => {
        const bucket = admin.storage().bucket(object.bucket)
        const filePath = object.name
        const fileName = filePath.split('/').pop()
        const THUMBS_PATH = 'photos/thumbs/'

        const workingDir = join(tmpdir(), 'thumbs')
        const tmpFilePath = join(workingDir, fileName)

        // only images accepted
        if(!object.contentType.startsWith('image/')) return console.log('Not an image.', object.contentType)

        // make thumb only from cropped photos
        if(!filePath.startsWith('photos/cropped/')) return console.log('Thumb not needed.', filePath)

        const id = fileName.split('.').shift()
        const photoDetail = await admin.firestore().collection('photos').doc(id).get()
        if(!photoDetail.exists) return console.log(`No info about photo ${id}.`)

        const ratio = getRatio(photoDetail.data().ratio)

        // 1. Ensure thumbnail dir exists
        await fs.ensureDir(workingDir)

        // 2. Download Source File
        await bucket.file(filePath).download({
            destination: tmpFilePath
        })

        // 3. Resize the images and define an array of upload promises
        const sizes = [320]

        const uploadPromises = sizes.map(async size => {
            const thumbName = `${size}_${fileName}`
            const thumbPath = join(workingDir, thumbName)

            // Resize source image
            await sharp(tmpFilePath)
                .resize(size, Math.round(size / ratio))
                .toFile(thumbPath)

            // Upload to GCS
            return bucket.upload(thumbPath, {
                destination: join(THUMBS_PATH, thumbName)
            })
        })

        // 4. Run the upload operations
        await Promise.all(uploadPromises)

        // 5. Cleanup remove the tmp/thumbs from the filesystem
        return fs.remove(workingDir)
    })
