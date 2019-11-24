import React from 'react'

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
            <img
                src={photo.src}
                style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
                width={photo.width}
                height={photo.height}
                onClick={onClick ? handleClick : null}
            />
            {/*<img src={photo.src} width={photo.width} height={photo.height} style={{margin: 2.5}} />*/}
            {/*<Caption>custom shit</Caption>*/}
        </div>
    )
}

export default CustomGalleryItem


//
// import React from 'react'
// import styled from 'styled-components'
//
// const Caption = styled.div`
//     position: absolute;
//     bottom: 0;
//     background: rgba(#666, .3);
// `
//
// const CustomGalleryItem = ({ index, photo }) => {
//     return (
//         <div style={{
//             position: 'relative',
//             height: photo.height,
//             width: photo.width
//         }}>
//             <img src={photo.src} width={photo.width} height={photo.height} style={{margin: 2.5}} />
//             {/*<Caption>custom shit</Caption>*/}
//         </div>
//     )
// }
//
// export default CustomGalleryItem
