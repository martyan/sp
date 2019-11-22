const functions = require('firebase-functions')
const mkdirp = require('mkdirp-promise')
const admin = require('firebase-admin')
const spawn = require('child-process-promise').spawn
const { join, dirname } = require('path')
const { tmpdir } = require('os')
const sharp = require('sharp')
const fs = require('fs-extra')

module.exports = functions.storage
    .object()
    .onFinalize(async object => {
        const bucket = admin.storage().bucket(object.bucket)
        // const bucket = gcs.bucket(object.bucket);
        const filePath = object.name;
        const fileName = filePath.split('/').pop();
        const bucketDir = dirname(filePath);

        const workingDir = join(tmpdir(), 'thumbs');
        const tmpFilePath = join(workingDir, 'source.png');

        if (fileName.includes('thumb@') || !object.contentType.includes('image')) {
            console.log('exiting function');
            return false;
        }

        // 1. Ensure thumbnail dir exists
        await fs.ensureDir(workingDir);

        // 2. Download Source File
        await bucket.file(filePath).download({
            destination: tmpFilePath
        });

        // 3. Resize the images and define an array of upload promises
        const sizes = [64, 128, 256];

        const uploadPromises = sizes.map(async size => {
            const thumbName = `thumb@${size}_${fileName}`;
            const thumbPath = join(workingDir, thumbName);

            // Resize source image
            await sharp(tmpFilePath)
                .resize(size, size)
                .toFile(thumbPath);

            // Upload to GCS
            return bucket.upload(thumbPath, {
                destination: join(bucketDir, thumbName)
            });
        });

        // 4. Run the upload operations
        await Promise.all(uploadPromises);

        // 5. Cleanup remove the tmp/thumbs from the filesystem
        return fs.remove(workingDir);
    });
