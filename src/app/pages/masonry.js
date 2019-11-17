import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getTodos } from '../lib/todo/actions'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import Masonry from '../components/Masonry'

const fakeData = (count = 1000) => {
    let data = []
    const ROW_HEIGHTS = [25, 50, 75, 100]

    for(let i = 0; i < count; i++) {
        data.push({
            size: ROW_HEIGHTS[Math.floor(Math.random() * ROW_HEIGHTS.length)],
            color: '#ff0099'
        })
    }

    return data
}

const MasonryPage = () => {

    // const [ croppedArea, setCroppedArea ] = useState(null)

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase"/>
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos"/>
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="masonry">

                <Masonry items={fakeData()} />

            </div>
        </PageWrapper>
    )

}

MasonryPage.getInitialProps = async({ store }) => {
    await store.dispatch(getTodos())
    return {}
}

MasonryPage.propTypes = {
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

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(MasonryPage)
