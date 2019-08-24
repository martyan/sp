import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import createStore from '../lib/store'

class MyApp extends App {
    render () {
        const { Component, pageProps, store } = this.props

        return (
                <Container>
                    <Provider store={store}>
                        <>
                            <Head>
                                <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
                            </Head>
                            <Component {...pageProps} />
                        </>
                    </Provider>
                </Container>
        )
    }
}

export default withRedux(createStore)(MyApp)
