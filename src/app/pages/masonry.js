import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getPhotos } from '../lib/app/actions'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import Masonry from '../components/Masonry'

const MasonryPage = ({ photos }) => {

    console.log(photos)

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase"/>
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos"/>
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="masonry">

                <Masonry photos={photos} />

            </div>
        </PageWrapper>
    )

}

MasonryPage.getInitialProps = async({ store }) => {
    await store.dispatch(getPhotos())
    return {}
}

MasonryPage.propTypes = {
    getPhotos: PropTypes.func.isRequired,
    photos: PropTypes.arrayOf(PropTypes.object).isRequired,
    user: PropTypes.object
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    photos: state.app.photos
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getPhotos
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(MasonryPage)
