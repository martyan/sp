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
import './index.scss'
import Modal from '../components/common/Modal'

const Home = ({ getTodos, user }) => {

    const [ caption, setCaption ] = useState('')
    const [ tags, setTags ] = useState('')
    const [ mapVisible, setMapVisible ] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <PageWrapper>
            <div className="index">

                <Head>
                    <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                    <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                    <title>Todo list | Nextbase</title>
                </Head>

                <form onSubmit={handleSubmit}>

                    <UploadInput />

                    <Button className="location" onClick={() => setMapVisible(true)}>Choose location <i className="fa fa-map-marker"></i></Button>

                    <TextArea placeholder="Caption" value={caption} onChange={setCaption}/>

                    <TextInput placeholder="Tag people" value={tags} onChange={setTags}/>

                    <Button className="done" disabled>Done</Button>

                </form>

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
