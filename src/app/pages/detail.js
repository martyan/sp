import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getPhotos } from '../lib/app/actions'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import SwipeableViews from 'react-swipeable-views'
import Pagination from '../components/Pagination'
import Carousel, { Modal, ModalGateway } from 'react-images'
import { Parallax, Background } from 'react-parallax'
// import AOS from 'aos'
import Gallery from 'react-photo-gallery'
import './detail.scss'
import CustomGalleryItem from '../components/CustomGalleryItem'
import MapEmbed from '../components/MapEmbed'
import Prlx from '../components/Prlx'

const arrow = <svg viewBox="0 0 451.7 512"> <g> <path d="M7,265.7L159.2,418c9.3,9.3,24.4,9.3,33.6,0c9.3-9.3,9.3-24.4,0-33.6L81.2,272.6h346.7c13.1,0,23.8-10.7,23.8-23.8 c0-13.1-10.7-23.8-23.8-23.8H81.2l111.7-111.7c9.3-9.3,9.3-24.4,0-33.6c-4.6-4.6-10.7-7-16.8-7c-6.1,0-12.2,2.3-16.8,7L7,232 C-2.3,241.3-2.3,256.4,7,265.7z"/> </g> </svg>


const DetailPage = (props) => {

    const [ index, setIndex ] = useState(0)
    const [ galleryOpen, setGalleryOpen ] = useState(false)
    const [ galleryIndex, setGalleryIndex ] = useState(0)

    const photos = props.photos.map(d => {
        const sizes = d.ratio.split(':')
        const width = parseInt(sizes[0])
        const height = parseInt(sizes[1])

        return ({
            ...d,
            width,
            height,
            src: `https://firebasestorage.googleapis.com/v0/b/stoned-places.appspot.com/o/photos%2Fcropped%2F${d.id}.jpg?alt=media`
        })
    })

    // useEffect(() => {
    //     AOS.init({
    //         once: true,
    //         offset: 50
    //     })
    // }, [])

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

                <div className="arrow">
                    {arrow}
                </div>

                <div onClick={() => handleSlideClick(2)}>
                    <Parallax
                        bgImage={photos[2].src}
                        bgImageAlt="Some alt text"
                        strength={150}
                        bgClassName={`hero`}
                        onClick={() => handleSlideClick(2)}
                    >
                        <div style={{ height: '60vh' }} />
                    </Parallax>
                </div>

                <p className="date">July 4th, 2019</p>

                <h1 className="title">Lorem ipsum trip</h1>

                <Prlx>
                    <p className="tags">
                        <a>#morocco</a> <a>#surf</a> <a>#trip</a> <a>#hightimes</a>
                    </p>
                </Prlx>

                <Prlx>
                    <MapEmbed />
                </Prlx>

                <Prlx>
                    <p className="perex">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium assumenda cumque delectus ea earum fuga id impedit.</p>
                </Prlx>

                <Prlx>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium assumenda cumque delectus.</p>
                </Prlx>

                <Prlx>
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
                                        src={photo.src}
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
                </Prlx>

                <Prlx>
                    <h2>Plotum</h2>
                </Prlx>

                <Prlx>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium assumenda cumque delectus ea earum fuga id impedit, ipsum, molestiae nihil non officiis perferendis provident saepe unde ut veritatis! Ducimus, quaerat.</p>
                </Prlx>

                <Prlx>
                    <h2>Lipsum amet</h2>
                </Prlx>

                <Prlx>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium assumenda cumque delectus ea earum fuga id impedit, ipsum, molestiae nihil non officiis.</p>
                </Prlx>

                <div onClick={() => handleSlideClick(5)}>
                    <Prlx src={photos[5].src} />
                </div>

                <Prlx>
                    <h2>Lipsum amet</h2>
                </Prlx>

                <Prlx>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium assumenda cumque delectus ea earum fuga id impedit, ipsum, molestiae nihil non officiis.</p>
                </Prlx>

                <div onClick={() => handleSlideClick(0)}>
                    <Prlx src={photos[0].src} />
                </div>

                <div onClick={() => handleSlideClick(6)}>
                    <Prlx src={photos[6].src} />
                </div>

                <Prlx>
                    <h2>Restus</h2>
                </Prlx>

                <Prlx>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium assumenda cumque delectus.</p>
                </Prlx>

                <div className="gallery">
                    <Gallery
                        photos={photos}
                        margin={5}
                        renderImage={CustomGalleryItem}
                        onClick={(e, { index }) => handleSlideClick(index)}
                        // direction={'column'}
                        // columns={2}
                    />
                </div>

                <div className="gallery">
                    <Gallery
                        photos={photos}
                        margin={2.5}
                        renderImage={CustomGalleryItem}
                        onClick={(e, { index }) => handleSlideClick(index)}
                        direction={'column'}
                        columns={2}
                    />
                </div>

                <h2>Komentario (3)</h2>

                <p>Lioreu fokum.</p>

                <p>Lorem ipsum dolor sit consectetur.</p>

                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>

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
                                views={photos}
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
