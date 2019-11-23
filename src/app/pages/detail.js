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
import SwipeableViews from 'react-swipeable-views'
import Pagination from '../components/Pagination'
import Carousel, { Modal, ModalGateway } from 'react-images'
import './detail.scss'

const DetailPage = ({ photos }) => {

    const [ index, setIndex ] = useState(0)
    const [ galleryOpen, setGalleryOpen ] = useState(false)
    const [ galleryIndex, setGalleryIndex ] = useState(0)

    const handleSlideClick = (i) => {
        setGalleryOpen(true)
        setGalleryIndex(i)
    }

    console.log(photos)

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase"/>
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos"/>
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="detail">

                <div className="carousel-wrapper">
                    <SwipeableViews
                        className="carousel"
                        onChangeIndex={setIndex}
                        index={index}
                        enableMouseEvents
                        resistance
                    >
                        {photos.map((photo, i) => (
                            <div
                                key={photo.id}
                                onClick={() => handleSlideClick(i)}
                            >
                                <img
                                    src={`https://firebasestorage.googleapis.com/v0/b/stoned-places.appspot.com/o/photos%2Fcropped%2F${photo.id}.jpg?alt=media`}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>
                        ))}
                    </SwipeableViews>
                    <Pagination dots={photos.length} index={index} onIndexChange={setIndex} />
                </div>

                <Masonry
                    photos={photos}
                    setGalleryIndex={handleSlideClick}
                />

                <ModalGateway>
                    {galleryOpen ? (
                        <Modal
                            onClose={() => setGalleryOpen(false)}
                            styles={{
                                blanket: (base, state) => ({
                                    ...base,
                                    background: 'rgba(0,0,0, .95)'
                                })
                            }}
                        >
                            <Carousel
                                views={photos.map(photo => ({src: `https://firebasestorage.googleapis.com/v0/b/stoned-places.appspot.com/o/photos%2Fcropped%2F${photo.id}.jpg?alt=media`}))}
                                currentIndex={galleryIndex}
                            />
                        </Modal>
                    ) : null}
                </ModalGateway>
            </div>
        </PageWrapper>
    )

}

DetailPage.getInitialProps = async({ store }) => {
    await store.dispatch(getPhotos())
    return {}
}

DetailPage.propTypes = {
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

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(DetailPage)
