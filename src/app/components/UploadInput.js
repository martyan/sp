import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useDropzone } from 'react-dropzone'
import { bindActionCreators } from 'redux'
import { uploadFile } from '../lib/auth/actions'
import styled from 'styled-components'

const UploadInput = ({ user, uploadFile, onCompleted, path, onChange }) => {
    const [ serverError, setServerError ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [files, setFiles] = useState([])

    const handleFileDrop = (acceptedFiles) => {
        const filez = acceptedFiles.map(file => ({...file, preview: URL.createObjectURL(file)}))
        setFiles(filez)
        onChange(acceptedFiles)
    }

    const { acceptedFiles, rejectedFiles, getRootProps, getInputProps, rootRef } = useDropzone({
        accept: 'image/jpeg, image/png',
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
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="dropzone">
                    {files.length === 0 ?
                        <i className="fa fa-picture-o"></i> :
                        <img src={files[0].preview} />
                    }
                </div>
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
    .dropzone {
        position: relative;
        width: 100%;
        min-height: 150px;
        background: #f6f6f6;
        border-radius: 5px;
        margin-bottom: 15px;
    
        cursor: pointer;
        overflow: hidden;
        
        i {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2.8em;
            color: #888;
        }
        
        img {
            display: block;
            width: 100%;
        }
    }   
`
