import React from 'react'
import styled from 'styled-components'

const Caption = styled.div`
    position: absolute;
    bottom: 0;
    background: rgba(#666, .3);
`

const CustomGalleryItem = ({ index, photo, margin }) => {
    return (
        <div style={{
            position: 'relative',
            // margin,
            height: photo.height,
            width: photo.width
        }}>
            <img {...photo} />
            <Caption>custom shit</Caption>
        </div>
    )
}

export default CustomGalleryItem
