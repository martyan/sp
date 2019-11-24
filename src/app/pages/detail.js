import React, { useState, useEffect } from 'react'
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
import { Parallax, Background } from 'react-parallax'
import AOS from 'aos'
import Gallery from 'react-photo-gallery'
import './detail.scss'
import CustomGalleryItem from '../components/CustomGalleryItem'
import MapEmbed from '../components/MapEmbed'

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
            src: `https://firebasestorage.googleapis.com/v0/b/stoned-places.appspot.com/o/photos%2Fthumbs%2F320_${d.id}.jpg?alt=media`
        })
    })

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 50
        })
    }, [])

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

                <div data-aos="fade-up" onClick={() => handleSlideClick(2)}>
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

                <p className="date" data-aos="fade-up">July 4th, 2019</p>

                <h1 className="title" data-aos="fade-up">Lorem ipsum trip</h1>

                <p className="tags" data-aos="fade-up">
                    <a>#morocco</a> <a>#surf</a> <a>#trip</a> <a>#hightimes</a>
                </p>

                <MapEmbed />
                
                <p className="perex" data-aos="fade-up">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium assumenda cumque delectus ea earum fuga id impedit.</p>


                <div className="carousel-wrapper" data-aos="fade-up">
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

                <h2 data-aos="fade-up">Plotum</h2>

                <p data-aos="fade-up">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium assumenda cumque delectus ea earum fuga id impedit, ipsum, molestiae nihil non officiis perferendis provident saepe unde ut veritatis! Ducimus, quaerat.</p>

                <div data-aos="fade-up" onClick={() => handleSlideClick(5)}>
                    <Parallax
                        bgImage={photos[5].src}
                        bgImageAlt="Some alt text"
                        strength={100}
                        bgClassName={`parallax`}
                        onClick={() => handleSlideClick(5)}
                    >
                        <div className="parallax-placeholder"></div>
                    </Parallax>
                </div>

                <h2 data-aos="fade-up">Lipsum amet</h2>

                <p data-aos="fade-up">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium assumenda cumque delectus ea earum fuga id impedit, ipsum, molestiae nihil non officiis.</p>

                <div data-aos="fade-up" onClick={() => handleSlideClick(0)}>
                    <Parallax
                        bgImage={photos[0].src}
                        bgImageAlt="Some alt text"
                        strength={100}
                        bgClassName={`parallax`}
                    >
                        <div className="parallax-placeholder"></div>
                    </Parallax>
                </div>

                <div data-aos="fade-up" onClick={() => handleSlideClick(6)}>
                    <Parallax
                        bgImage={photos[6].src}
                        bgImageAlt="Some alt text"
                        strength={100}
                        bgClassName={`parallax`}
                    >
                        <div className="parallax-placeholder"></div>
                    </Parallax>
                </div>

                <h2 data-aos="fade-up">Restus</h2>

                <p data-aos="fade-up">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium assumenda cumque delectus.</p>

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

                <Masonry
                    photos={photos}
                    setGalleryIndex={handleSlideClick}
                />

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
