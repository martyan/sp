import React from 'react'
import { Masonry as Masonic } from 'masonic'

const PHOTOS = [
    {
        src: 'https://via.placeholder.com/100x20',
        width: 5,
        height: 1
    },
    {
        src: 'https://via.placeholder.com/160x90',
        width: 16,
        height: 9
    },
    {
        src: 'https://via.placeholder.com/160x120',
        width: 4,
        height: 3
    },
    {
        src: 'https://via.placeholder.com/100x100',
        width: 1,
        height: 1
    },
    {
        src: 'https://via.placeholder.com/90x160',
        width: 9,
        height: 16
    },
    {
        src: 'https://via.placeholder.com/120x160',
        width: 3,
        height: 4
    }
]

let data = []

Array.from(Array(50)).forEach((x, i) => {
    const item = PHOTOS[Math.floor(Math.random() * PHOTOS.length)]
    data.push(item)
})

const Masonry = () => (
    <div style={{
        width: '100%',
        maxWidth: '720px',
        margin: '0 auto'
    }}>
        <Masonic
            items={data}
            columnGutter={10}
            columnCount={2}
        >
            {({ index, data, width }) => (
                <div>
                    <img src={data.src} style={{width: '100%'}} />
                </div>
            )}
        </Masonic>
    </div>
)

export default Masonry
