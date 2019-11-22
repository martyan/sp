import { db, storage } from '../firebase'

export const photoDeleted = (photoId) => ({ type: 'PHOTO_DELETED', photoId })

export const getPhotos = () => ({
    type: 'GET_PHOTOS',
    payload: db.collection('photos').orderBy('createdAt', 'desc').get()
})

export const getPhoto = (photoId) => ({
    type: 'GET_PHOTO',
    payload: db.collection('photos').doc(photoId).get()
})

export const createPhoto = (photo) => ({
    type: 'CREATE_PHOTO',
    payload: db.collection('photos').add(photo)
})

export const updatePhoto = (photoId, photo) => ({
    type: 'UPDATE_PHOTO',
    payload: db.collection('photos').doc(photoId).update(photo)
})

export const deletePhoto = (photoId) => ({
    type: 'DELETE_PHOTO',
    payload: db.collection('photos').doc(photoId).delete()
})

export const uploadFile = (file, name, path) => ({
    type: 'UPLOAD_FILE',
    payload: new Promise((resolve, reject) => {
        const storageRef = storage.ref()

        const imageDir = storageRef.child(path)
        const task = imageDir.put(file)

        task.on('state_changed', snapshot => {
            const progress = Math.ceil((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            console.log(progress)
        }, error => reject(error), () => resolve(task.snapshot))
    })
})
