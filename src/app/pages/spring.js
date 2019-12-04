import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getPhotos } from '../lib/app/actions'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import MapEmbed from '../components/MapEmbed'
// import { Parallax, ParallaxLayer } from 'react-spring/addons.cjs'
import { ParallaxBanner } from 'react-scroll-parallax'
import Prlx from '../components/Prlx'
import './detail.scss'

const SpringPage = (props) => {
    // const { parallaxController } = useController()

    const photos = props.photos.map(d => {
        const sizes = d.ratio.split(':')
        const width = parseInt(sizes[0])
        const height = parseInt(sizes[1])

        return ({
            ...d,
            width,
            height,
            src: `https://firebasestorage.googleapis.com/v0/b/stoned-places.appspot.com/o/photos%2Fthumbs%2F320_${d.id}.jpg?alt=media`
        })
    })

    const handleIntersection = (event) => {
        console.log(event.isIntersecting);
    }

    const options = {
        onChange: handleIntersection,
        root: '#scrolling-container',
        rootMargin: '0% 0% -25%',
    }

    // console.log(parallaxController)

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase"/>
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos"/>
                <title>Todo list | Nextbase</title>
            </Head>

            {/*<Parallax scrolling ref={ref => this.parallax = ref}>*/}
            {/*<ParallaxLayer offset={1} speed={2}>*/}
            <div className="detail">
                <div id="scrolling-container" style={{  height: '100vh' }}>
                    <Prlx src={photos[6].src} />

                    <p className="date" data-aos="fade-up">July 4th, 2019</p>

                    <h1 className="title" data-aos="fade-up">Lorem ipsum trip</h1>

                    <Prlx src={photos[6].src} />

                    <p className="tags" data-aos="fade-up">
                        <a>#morocco</a> <a>#surf</a> <a>#trip</a> <a>#hightimes</a>
                    </p>

                    <h1 className="title" data-aos="fade-up">Lorem ipsum trip</h1>

                    <p className="tags" data-aos="fade-up">
                        <a>#morocco</a> <a>#surf</a> <a>#trip</a> <a>#hightimes</a>
                    </p>

                    <h1 className="title" data-aos="fade-up">Lorem ipsum trip</h1>

                    <Prlx src={photos[6].src} />
                    <Prlx src={photos[6].src} />

                    <p className="tags" data-aos="fade-up">
                        <a>#morocco</a> <a>#surf</a> <a>#trip</a> <a>#hightimes</a>
                    </p>

                    <h1 className="title" data-aos="fade-up">Lorem ipsum trip</h1>

                    <Prlx src={photos[6].src} />

                    <p className="tags" data-aos="fade-up">
                        <a>#morocco</a> <a>#surf</a> <a>#trip</a> <a>#hightimes</a>
                    </p>

                    <MapEmbed />

                    <h2 data-aos="fade-up">Restus</h2>

                    <p data-aos="fade-up">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium assumenda cumque delectus.</p>

                    <h2>Komentario (3)</h2>
                    <Prlx src={photos[6].src} />

                    <p>Lioreu fokum.</p>

                    <p className="date" data-aos="fade-up">July 4th, 2019</p>

                    <Prlx src={photos[6].src} />

                    <h1 className="title" data-aos="fade-up">Lorem ipsum trip</h1>
                    <Prlx src={photos[6].src} />

                    <p className="tags" data-aos="fade-up">
                        <a>#morocco</a> <a>#surf</a> <a>#trip</a> <a>#hightimes</a>
                    </p>

                    <h2 data-aos="fade-up">Restus</h2>

                    <p data-aos="fade-up">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium assumenda cumque delectus.</p>

                    <h2>Komentario (3)</h2>

                    <p>Lioreu fokum.</p>

                    <p>Lorem ipsum dolor sit consectetur.</p>

                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>

                    <Prlx src={photos[6].src} />
                    <Prlx src={photos[6].src} />
                    <Prlx src={photos[6].src} />
                    <Prlx src={photos[6].src} />
                    <Prlx src={photos[6].src} />
                    <Prlx src={photos[6].src} />
                    <Prlx src={photos[6].src} />
                    <Prlx src={photos[6].src} />
                    <Prlx src={photos[6].src} />
                    <Prlx src={photos[6].src} />
                    <Prlx src={photos[6].src} />

                </div>
            </div>
            {/*</ParallaxLayer>*/}
            {/*</Parallax>*/}
        </PageWrapper>
    )
}

SpringPage.getInitialProps = async({ store }) => {
    await store.dispatch(getPhotos())
    return {}
}

SpringPage.propTypes = {
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

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(SpringPage)
