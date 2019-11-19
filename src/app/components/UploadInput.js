import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useDropzone } from 'react-dropzone'
import { bindActionCreators } from 'redux'
import { uploadFile } from '../lib/auth/actions'
import styled from 'styled-components'

const UploadInput = ({ user, uploadFile, onCompleted, path, onChange, preview, openEditor }) => {
    const [ serverError, setServerError ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [ files, setFiles ] = useState([])

    const handleFileDrop = (acceptedFiles) => {
        const filez = acceptedFiles.map(file => ({...file, preview: URL.createObjectURL(file)}))
        setFiles(filez)
        onChange(acceptedFiles)
    }

    const { acceptedFiles, rejectedFiles, getRootProps, getInputProps, rootRef } = useDropzone({
        accept: 'image/jpeg',
        maxSize: 8 * 1024 * 1024,
        onDrop: handleFileDrop
    })

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    // const getUploadPromise = (file, index) => {
    //     const ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
    //     const time = new Date().getTime()
    //     const name = `${time}_${index}.${ext}`
    //     const pathname = `${path}/${name}`
    //
    //     return uploadFile(file, name, pathname)
    // }
    //
    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //
    //     if(acceptedFiles.length === 0) return
    //
    //     setLoading(true)
    //
    //     const fileUploads = acceptedFiles.map((file, index) => getUploadPromise(file, index))
    //
    //     Promise.all(fileUploads)
    //         .then(snapshots => {
    //             setLoading(false)
    //
    //             const links = snapshots.map(snapshot => snapshot.ref.getDownloadURL())
    //
    //             Promise.all(links)
    //                 .then(onCompleted)
    //                 .catch(console.error)
    //
    //         })
    //         .catch(error => {
    //             setLoading(false)
    //             setServerError(error.code)
    //         })
    // }

    return (
        <Wrapper>
            {preview && (
                <>
                    <button className="change" onClick={() => rootRef.current.click()}><i className="fa fa-picture-o"></i></button>
                    <button className="crop" onClick={openEditor}><i className="fa fa-pencil"></i></button>
                    <img src={preview} />
                </>
            )}

            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {!preview && (
                    <div className="dropzone">
                        <i className="fa fa-picture-o"></i>
                    </div>
                )}
            </div>
        </Wrapper>
    )
}

UploadInput.propTypes = {
    onChange: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    user: state.auth.user
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        uploadFile
    }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(UploadInput)


const Wrapper = styled.div`
    position: relative;
    margin-bottom: 15px;
    background: #f6f6f6;
    border-radius: 5px;
    overflow: hidden;
    
    img {
        display: block;
        width: 100%;
        max-height: 240px;
        min-height: 180px;
        object-fit: contain;
    }
    
    .change, .crop {
        position: absolute;
        right: 10px;
        z-index: 99;
        width: 36px;
        height: 36px;
        line-height: 31px;
        font-size: .95em;
        text-align: center;
        background: #444;
        border-radius: 50%;
        border: 0;
        color: white;
    }
    
    .change {
        bottom: 10px;
    }
    
    .crop {
        top: 10px;
    }

    .dropzone {
        position: relative;
        width: 100%;
        min-height: 150px;
        cursor: pointer;

        i {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2.8em;
            color: #888;
        }
    }
`
