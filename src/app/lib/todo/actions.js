import { db, storage } from '../firebase'

export const todoDeleted = (todoId) => ({ type: 'TODO_DELETED', todoId })

export const getTodos = () => ({
    type: 'GET_TODOS',
    payload: db.collection('todos').orderBy('createdAt', 'desc').get()
})

export const getTodo = (todoId) => ({
    type: 'GET_TODO',
    payload: db.collection('todos').doc(todoId).get()
})

export const createTodo = (todo) => ({
    type: 'CREATE_TODO',
    payload: db.collection('todos').add(todo)
})

export const updateTodo = (todoId, todo) => ({
    type: 'UPDATE_TODO',
    payload: db.collection('todos').doc(todoId).update(todo)
})

export const deleteTodo = (todoId) => ({
    type: 'DELETE_TODO',
    payload: db.collection('todos').doc(todoId).delete()
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
