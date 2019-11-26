import React from 'react'
import { Parallax, Background } from 'react-parallax'

const CustomGalleryItem = ({ index, onClick, photo, margin, direction, top, left }) => {

    const handleClick = event => {
        onClick(event, { photo, index })
    }

    if(direction === 'column') {
        return (
            <div
                style={{
                    position: 'absolute',
                    height: photo.height,
                    width: photo.width,
                    left,
                    top,
                    margin
                }}
                className="column-item"
            >
                {index % 3 === 0 ? (
                    <Parallax
                        bgImage={photo.src}
                        bgImageAlt="Some alt text"
                        strength={100}
                        bgClassName={`parallax`}
                    >
                        <div className="parallax-placeholder"></div>
                    </Parallax>
                ) : (
                    <img
                        src={photo.src}
                        width={photo.width}
                        height={photo.height}
                        onClick={onClick ? handleClick : null}
                    />
                )}
            </div>
        )
    }

    return (
        <div
            style={{
                position: 'relative',
                height: photo.height,
                width: photo.width
            }}
            onClick={onClick ? handleClick : null}
            className="row-item"
        >
            {index % 3 === 0 ? (
                <Parallax
                    bgImage={photo.src}
                    bgImageAlt="Some alt text"
                    strength={100}
                    bgClassName={`parallax`}
                >
                    <div className="parallax-placeholder"></div>
                </Parallax>
            ) : (
                <img
                    src={photo.src}
                    style={{margin}}
                    width={photo.width}
                    height={photo.height}
                    onClick={onClick ? handleClick : null}
                />
            )}
        </div>
    )

}

export default CustomGalleryItem
