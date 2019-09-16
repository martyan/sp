import React, { useState, useEffect, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import styled from 'styled-components'

const Editor = ({ file, onCancel, onConfirm }) => {
    const [ preview, setPreview ] = useState(null)
    const [ ratio, setRatio ] = useState(4 / 3)
    const [ rotation, setRotation ] = useState(0)
    const [ crop, setCrop ] = useState({ x: 0, y: 0 })
    const [ zoom, setZoom ] = useState(1)

    useEffect(() => {
        console.log('mount')
        const url = URL.createObjectURL(file)
        setPreview(url)
    }, [])

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        console.log(croppedArea, croppedAreaPixels)
    }, [])

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        console.log('revoke')
        URL.revokeObjectURL(preview)
    }, [file])

    return (
        <Wrapper>
            <Controls>
                <button onClick={() => setRatio(16 / 9)}>16:9</button>
                <button onClick={() => setRatio(4 / 3)}>4:3</button>
                <button onClick={() => setRatio(1)}>square</button>
                <button onClick={() => setRatio(3 / 4)}>3:4</button>
                <button onClick={() => setRatio(9 / 16)}>9:16</button>
            </Controls>

            <Controls>
                {/*<input*/}
                    {/*type="range"*/}
                    {/*min={-180}*/}
                    {/*max={180}*/}
                    {/*step={0.5}*/}
                    {/*value={rotation}*/}
                    {/*onChange={e => setRotation(e.target.value)}*/}
                {/*/>*/}
                <button onClick={() => setRotation(rotation - 30)}><i className="fa fa-repeat"></i></button>
                <button onClick={() => setRotation(rotation + 30)}><i className="fa fa-undo"></i></button>
            </Controls>

            <CropContainer>
                <Cropper
                    image={preview}
                    crop={crop}
                    zoom={zoom}
                    aspect={ratio}
                    rotation={rotation}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </CropContainer>

            <Controls>
                <button onClick={onCancel}><i className="fa fa-times"></i></button>
                <button onClick={onConfirm}><i className="fa fa-check"></i></button>
            </Controls>
        </Wrapper>
    )
}

export default Editor

const Wrapper = styled.div`
    background: #000;
`

const CropContainer = styled.div`
    position: relative;
    height: calc(100vh - 150px);
`

const Controls = styled.div`
    height: 50px;
    display: flex;
    
    button {
        flex: 1;
        height: 50px;
        border: none;
        background: #222;
        color: white;
        font-weight: 300;
        font-size: .9em;
        transition: .2s ease;
        cursor: pointer;
        position: relative;
    
        &:after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 18px;
            background: #444;
        }
        
        &:last-child:after {
            content: none;
        }
        
        i {
            font-size: 1.3em;   
        }
    }
`
