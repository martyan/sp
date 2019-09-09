import React, { useState, useEffect, useRef } from 'react'
import CameraPhoto, { FACING_MODES, IMAGE_TYPES } from 'jslib-html5-camera-photo'

const Camera = () => {

    const videoRef = useRef()
    const cameraPhoto = useRef(null)
    const [ dataUri, setDataUri ] = useState('')

    useEffect(() => {
        console.log('component did mount')

        cameraPhoto.current = new CameraPhoto(videoRef.current)
    }, [])

    const startCameraMaxResolution = () => {
        cameraPhoto.current.startCameraMaxResolution(FACING_MODES.ENVIRONMENT)
            .then(() => {
                console.log('camera is started !')
            })
            .catch((error) => {
                console.error('Camera not started!', error)
            })
    }

    const takePhoto = () => {
        setDataUri(cameraPhoto.current.getDataUri({sizeFactor: 1}))
    }

    const stopCamera = () => {
        cameraPhoto.current.stopCamera()
            .then(() => {
                console.log('Camera stoped!')
            })
            .catch((error) => {
                console.log('No camera to stop!:', error)
            })
    }

    return (
        <div>
            <button onClick={startCameraMaxResolution}>start</button>
            <button onClick={stopCamera}>stop</button>
            <button onClick={takePhoto}>shoot</button>
            <button>switch camera</button>

            <video ref={videoRef} autoPlay></video>

            <img
                alt="imgCamera"
                src={dataUri}
            />
        </div>
    )

}

export default Camera
