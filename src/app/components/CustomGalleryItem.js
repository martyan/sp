import React from 'react'
import { Parallax, Background } from 'react-parallax'

const imgWithClick = { cursor: 'pointer' }

const CustomGalleryItem = ({ index, onClick, photo, margin, direction, top, left }) => {
    const imgStyle = { margin: margin }
    if (direction === 'column') {
        imgStyle.position = 'absolute'
        imgStyle.left = left
        imgStyle.top = top
    }

    const handleClick = event => {
        onClick(event, { photo, index })
    }

    return (
        <div
            style={{
                position: 'relative',
                height: photo.height,
                width: photo.width
            }}
            className="gallery-item"
        >
            {index % 3 === 0 ? (
                <div onClick={onClick ? handleClick : null}>
                    <Parallax
                        bgImage={photo.src}
                        bgImageAlt="Some alt text"
                        strength={100}
                        bgClassName={`parallax`}
                    >
                        <div className="parallax-placeholder"></div>
                    </Parallax>
                </div>
            ) : (
                <img
                    src={photo.src}
                    style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
                    width={photo.width}
                    height={photo.height}
                    onClick={onClick ? handleClick : null}
                />
            )}
        </div>
    )
}

export default CustomGalleryItem
