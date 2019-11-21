const functions = require('firebase-functions')
const mkdirp = require('mkdirp-promise')
const admin = require('firebase-admin')
const spawn = require('child-process-promise').spawn
const path = require('path')
const os = require('os')
const fs = require('fs')

const THUMB_PATH = 'photos/thumbs/'
const THUMB_MAX_HEIGHT = 200
const THUMB_MAX_WIDTH = 200

module.exports = functions.storage.object().onFinalize(async(object) => {
    const filePath = object.name
    // const fileDir = path.dirname(filePath)
    const fileName = path.basename(filePath)
    const thumbFilePath = path.join(THUMB_PATH, fileName)
    const contentType = object.contentType

    // only images accepted
    if(!contentType.startsWith('image/')) return console.log('Not an image.', contentType)

    // make thumb only from full res photos
    if(!filePath.startsWith('photos/full/')) return console.log('Thumb not needed.', filePath)

    const tempFile = path.join(os.tmpdir(), THUMB_PATH, fileName)
    const tempThumbFile = path.join(os.tmpdir(), THUMB_PATH, `THUMB_${fileName}`)
    const tempDir = path.dirname(tempThumbFile)

    // const thumbFilePath = path.normalize(path.join(fileDir, `${fileName}`))
    // const tempLocalFile = path.join(os.tmpdir(), filePath)
    // const tempLocalDir = path.dirname(tempLocalFile)
    // const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath)
    //
    // console.log(filePath, thumbFilePath, tempLocalFile, tempLocalThumbFile)

    // Cloud Storage files.
    const bucket = admin.storage().bucket(object.bucket)
    const file = bucket.file(filePath)
    const thumbFile = bucket.file(thumbFilePath)
    const metadata = {
        contentType: contentType,
        // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
        // 'Cache-Control': 'public,max-age=3600',
    }

    // Create the temp directory where the storage file will be downloaded.
    await mkdirp(tempDir)

    // Download file from bucket.
    await file.download({ destination: tempFile })
    console.log('The file has been downloaded to', tempFile)

    // Generate a thumbnail using ImageMagick.
    await spawn('convert', [tempFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempThumbFile], { capture: ['stdout', 'stderr'] })
    console.log('Thumbnail created at', tempThumbFile)

    // Uploading the Thumbnail.
    await bucket.upload(tempThumbFile, { destination: thumbFilePath, metadata: metadata })
    console.log('Thumbnail uploaded to Storage at', thumbFilePath)

    // Once the image has been uploaded delete the local files to free up disk space.
    fs.unlinkSync(tempFile)
    fs.unlinkSync(tempThumbFile)

    // Get the Signed URLs for the thumbnail and original image.
    const config = {
        action: 'read',
        expires: '03-01-2500',
    }
    const results = await Promise.all([
        thumbFile.getSignedUrl(config),
        file.getSignedUrl(config),
    ])
    console.log('Got Signed URLs.')

    const thumbResult = results[0]
    const originalResult = results[1]
    const thumbFileUrl = thumbResult[0]
    const fileUrl = originalResult[0]

    return admin.firestore().collection('thumbs').add({ path: fileUrl, thumbnail: thumbFileUrl })
    return console.log('Thumbnail URLs saved to database.')
})
