import React from 'react'
import Prlx from './Prlx'

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
                    <Prlx src={photo.src} />
                ) : (
                    <Prlx>
                        <img
                            src={photo.src}
                            width={photo.width}
                            height={photo.height}
                            onClick={onClick ? handleClick : null}
                        />
                    </Prlx>
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
                <Prlx src={photo.src} />
            ) : (
                <Prlx>
                    <img
                        src={photo.src}
                        style={{margin}}
                        width={photo.width}
                        height={photo.height}
                        onClick={onClick ? handleClick : null}
                    />
                </Prlx>
            )}
        </div>
    )

}

export default CustomGalleryItem
