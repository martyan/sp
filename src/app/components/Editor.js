import React, { useState, useEffect, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import styled from 'styled-components'
import cropImage from '../lib/helpers/cropImage'

export const getRatio = (ratioName) => {
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

const Editor = ({ file, onCancel, onConfirm, initialCroppedArea, initialRatio }) => {
    const [ preview, setPreview ] = useState(null)
    const [ ratio, setRatio ] = useState(initialRatio)
    const [ rotation, setRotation ] = useState(0)
    const [ crop, setCrop ] = useState({ x: 0, y: 0 })
    const [ zoom, setZoom ] = useState(1)
    const [ croppedArea, setCroppedArea ] = useState(null)

    useEffect(() => {
        console.log('mount')
        const url = URL.createObjectURL(file)
        setPreview(url)
    }, [])

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        console.log('revoke')
        URL.revokeObjectURL(preview)
    }, [file])

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        // console.log(croppedArea, croppedAreaPixels)
        setCroppedArea(croppedAreaPixels)
    }, [])

    const done = async () => {
        const croppedImage = await cropImage(preview, croppedArea)

        onConfirm(croppedImage, croppedArea, ratio)
    }

    return (
        <Wrapper>
            <Controls>
                <button onClick={() => setRatio('5:1')}>5:1</button>
                <button onClick={() => setRatio('16:9')}>16:9</button>
                <button onClick={() => setRatio('4:3')}>4:3</button>
                <button onClick={() => setRatio('1:1')}>square</button>
                <button onClick={() => setRatio('3:4')}>3:4</button>
                <button onClick={() => setRatio('9:16')}>9:16</button>
            </Controls>

            {/*<Controls>*/}
                {/*{false && (*/}
                    {/*<input*/}
                        {/*type="range"*/}
                        {/*min={-180}*/}
                        {/*max={180}*/}
                        {/*step={0.5}*/}
                        {/*value={rotation}*/}
                        {/*onChange={e => setRotation(e.target.value)}*/}
                    {/*/>*/}
                {/*)}*/}
                {/*<button onClick={() => setRotation(rotation + 30)}><i className="fa fa-repeat"></i></button>*/}
                {/*<button onClick={() => setRotation(rotation - 30)}><i className="fa fa-undo"></i></button>*/}
            {/*</Controls>*/}

            <CropContainer>
                <Cropper
                    image={preview}
                    crop={crop}
                    zoom={zoom}
                    aspect={getRatio(ratio)}
                    rotation={rotation}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    initialCroppedAreaPixels={initialCroppedArea}
                />
            </CropContainer>

            <Controls>
                <button onClick={onCancel}><i className="fa fa-times"></i></button>
                <button onClick={done}><i className="fa fa-check"></i></button>
            </Controls>
        </Wrapper>
    )
}

export default Editor

const Wrapper = styled.div`
    height: 100vh; /* Use vh as a fallback for browsers that do not support Custom Properties */
    height: calc(var(--vh, 1vh) * 100);
    background: #000;
`

const CropContainer = styled.div`
    position: relative;
    height: calc(100% - 100px);
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
