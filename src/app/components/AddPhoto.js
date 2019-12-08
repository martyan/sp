import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createPhoto, getPhoto, uploadFile, getPhotos } from '../lib/app/actions'
import Map from '../components/Map'
import TextInput from '../components/common/TextInput'
import UploadInput from '../components/UploadInput'
import TextArea from '../components/common/TextArea'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Editor from '../components/Editor'
// import './index.scss'


const AddPhoto = ({ createPhoto, getPhoto, uploadFile, user }) => {
    const defaultRatio = '4:3'

    const [ caption, setCaption ] = useState('')
    const [ tags, setTags ] = useState('')
    const [ mapVisible, setMapVisible ] = useState(false)
    const [ editorVisible, setEditorVisible ] = useState(false)
    const [ files, setFiles ] = useState([])
    const [ img, setImg ] = useState(null)
    const [ croppedArea, setCroppedArea ] = useState(null)
    const [ ratio, setRatio ] = useState(defaultRatio)
    const [ errors, setErrors ] = useState([])
    const [ location, setLocation ] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()

        setErrors([])

        let errors = []
        if(!img) errors.push({ type: 'editor', msg: 'No img' })
        else if(!croppedArea) errors.push({ type: 'editor', msg: 'No cropped area' })
        else if(!ratio) errors.push({ type: 'editor', msg: 'No ratio' })

        if(!location) errors.push({ type: 'location', msg: 'No location' })

        setErrors(errors)

        if(errors.length > 0) return false

        const data = {
            croppedArea,
            ratio,
            caption,
            location
        }

        createPhoto(data)
            .then(ref => getUploadPromise(files[0], ref.id))
            .then(() => window.location.reload())
            // .then(ref => getPhoto(ref.id))
            .catch(console.error)
    }

    const getUploadPromise = (file, name) => {
        const ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
        // const time = new Date().getTime()
        const filename = `${name}.${ext}`
        const pathname = `photos/full/${filename}`

        return uploadFile(file, filename, pathname)
    }

    const handleInputChange = (files) => {
        setFiles(files)
        setRatio(defaultRatio)
        setCroppedArea(null)
        setEditorVisible(true)
    }

    const handleEditorChange = (img, crop, ratio) => {
        setImg(img)
        setEditorVisible(false)
        setCroppedArea(crop)
        setRatio(ratio)
    }

    const handleLocationChange = (location) => {
        setLocation(location)
        setMapVisible(false)
    }

    const getError = (type) => {
        const error = errors.find(error => error.type === type)
        if(error) return error.msg
        return ''
    }

    return (
        <div className="add-photo">

            <form onSubmit={handleSubmit}>

                <UploadInput
                    preview={img}
                    onChange={handleInputChange}
                    openEditor={() => setEditorVisible(true)}
                />

                <Button className="location" onClick={() => setMapVisible(true)}>Choose location <i className="fa fa-map-marker"></i></Button>

                <TextArea
                    placeholder="Caption"
                    value={caption}
                    onChange={setCaption}
                    error={getError('caption')}
                />

                {/*<TextInput placeholder="Tags" value={tags} onChange={setTags}/>*/}

                {errors.length > 0 && (
                    <div className="errors">
                        {errors.map((e, i) => <div key={i} className="error">{e.msg}</div>)}
                    </div>
                )}

                {/*<label>*/}
                {/*<input type="checkbox" />*/}
                {/*<span className="label">Forest</span>*/}
                {/*</label>*/}

                {/*<label>*/}
                {/*<input type="checkbox" />*/}
                {/*<span className="label">Water</span>*/}
                {/*</label>*/}

                {/*<label>*/}
                {/*<input type="checkbox" />*/}
                {/*<span className="label">Mountains</span>*/}
                {/*</label>*/}

                {/*<label>*/}
                {/*<input type="checkbox" />*/}
                {/*<span className="label">Streets</span>*/}
                {/*</label>*/}

                <Button className="done">Done</Button>

            </form>

            <Modal
                visible={editorVisible}
                onClose={() => setEditorVisible(false)}
                classNames={{modal: 'no-padding full', overlay: 'no-padding'}}
                noPadding
            >
                <div tabIndex={0}>
                    {files.length > 0 && (
                        <Editor
                            file={files[0]}
                            onCancel={() => setEditorVisible(false)}
                            onConfirm={handleEditorChange}
                            initialCroppedArea={croppedArea}
                            initialRatio={ratio}
                        />
                    )}
                </div>
            </Modal>

            <Modal
                visible={mapVisible}
                onClose={() => setMapVisible(false)}
                classNames={{modal: 'no-padding', overlay: 'no-padding'}}
                noPadding
            >
                <Map onChange={handleLocationChange} />
            </Modal>

        </div>
    )

}

AddPhoto.getInitialProps = async ({ store }) => {
    await store.dispatch(getPhotos())
    return {}
}

AddPhoto.propTypes = {
    createPhoto: PropTypes.func.isRequired,
    getPhoto: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    user: PropTypes.object
}

const mapStateToProps = (state) => ({
    user: state.auth.user
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        createPhoto,
        getPhoto,
        uploadFile
    }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(AddPhoto)
