import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getTodos } from '../lib/todo/actions'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import Map from '../components/Map'
import TextInput from '../components/common/TextInput'
import UploadInput from '../components/UploadInput'
import TextArea from '../components/common/TextArea'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Editor from '../components/Editor'
import './index.scss'


const Home = ({ getTodos, user }) => {
    const defaultRatio = 4 / 3
    const defaultRatio = '4:3'

    const [ caption, setCaption ] = useState('')
    const [ tags, setTags ] = useState('')
    const [ mapVisible, setMapVisible ] = useState(false)
    const [ editorVisible, setEditorVisible ] = useState(false)
    const [ files, setFiles ] = useState([])
    const [ img, setImg ] = useState(null)
    const [ croppedArea, setCroppedArea ] = useState(null)
    const [ ratio, setRatio ] = useState(defaultRatio)

    const handleSubmit = (e) => {
        e.preventDefault()
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

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="index">

                <form onSubmit={handleSubmit}>

                    <UploadInput
                        preview={img}
                        onChange={handleInputChange}
                        openEditor={() => setEditorVisible(true)}
                    />

                    <Button className="location" onClick={() => setMapVisible(true)}>Choose location <i className="fa fa-map-marker"></i></Button>

                    <TextArea placeholder="Caption" value={caption} onChange={setCaption}/>

                    <TextInput placeholder="Tag people" value={tags} onChange={setTags}/>

                    <Button className="done" disabled>Done</Button>

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
                    <Map />
                </Modal>

            </div>
        </PageWrapper>
    )

}

Home.getInitialProps = async ({ store }) => {
    await store.dispatch(getTodos())
    return {}
}

Home.propTypes = {
    getTodos: PropTypes.func.isRequired,
    user: PropTypes.object
}

const mapStateToProps = (state) => ({
    user: state.auth.user
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getTodos
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(Home)
