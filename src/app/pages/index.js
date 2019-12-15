import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createPhoto, getPhoto, uploadFile, getPhotos } from '../lib/app/actions'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import Masonry from '../components/Masonry'
import AddPhoto from '../components/AddPhoto'
import Loading from '../components/Loading'
import ExploreMap from '../components/ExploreMap'
import './index.scss'


const Home = ({ user, photos }) => {

    const [ isAdding, setIsAdding ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 4000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="index">

                {isLoading && <Loading />}

                <div className="head">
                    <h1>Stoned Places</h1>
                    <a className="add" onClick={() => setIsAdding(!isAdding)}>+</a>
                </div>

                {(isAdding || !photos.length) ?
                    <AddPhoto /> :
                    <>
                        <ExploreMap data={photos} />
                        <Masonry photos={photos} />
                    </>
                }

                <a href="/detail">Detail</a>

            </div>
        </PageWrapper>
    )

}

Home.getInitialProps = async ({ store }) => {
    await store.dispatch(getPhotos())
    return {}
}

Home.propTypes = {
    createPhoto: PropTypes.func.isRequired,
    getPhoto: PropTypes.func.isRequired,
    getPhotos: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    user: PropTypes.object
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    photos: [...state.app.photos, ...state.app.photos, ...state.app.photos, ...state.app.photos, ...state.app.photos]
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        createPhoto,
        getPhoto,
        getPhotos,
        uploadFile
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(Home)
