import React from 'react'
import { Masonry as Masonic } from 'masonic'

// const PHOTOS = [
//     {
//         src: 'https://via.placeholder.com/100x20',
//         width: 5,
//         height: 1
//     },
//     {
//         src: 'https://via.placeholder.com/160x90',
//         width: 16,
//         height: 9
//     },
//     {
//         src: 'https://via.placeholder.com/160x120',
//         width: 4,
//         height: 3
//     },
//     {
//         src: 'https://via.placeholder.com/100x100',
//         width: 1,
//         height: 1
//     },
//     {
//         src: 'https://via.placeholder.com/90x160',
//         width: 9,
//         height: 16
//     },
//     {
//         src: 'https://via.placeholder.com/120x160',
//         width: 3,
//         height: 4
//     }
// ]
//
// let data = []
//
// Array.from(Array(50)).forEach((x, i) => {
//     const item = PHOTOS[Math.floor(Math.random() * PHOTOS.length)]
//     data.push(item)
// })

const NAMES = ['Some stoned place', 'Stunner', 'What the heck?', 'In da jungle', 'Wrong way']

const Masonry = ({ photos }) => {

    const data = photos.map(photo => {
        const ratio = photo.ratio.split(':')
        const width = ratio[0]
        const height = ratio[1]
        const name = NAMES[Math.floor(Math.random() * NAMES.length)]

        return {
            src: `https://firebasestorage.googleapis.com/v0/b/stoned-places.appspot.com/o/photos%2Fcropped%2F${photo.id}.jpg?alt=media`,
            width,
            height,
            name
        }
    })

    console.log(data)
    const ddata = [data[0], data[0], ...data, ...data.reverse(), data[0], data[0], ...data]

    return (
        <div style={{
            width: '100%',
            maxWidth: '720px',
            margin: '0 auto',
            padding: '5px'
        }}>
            <Masonic
                items={ddata}
                columnGutter={5}
                columnCount={2}
            >
                {({ index, data, width }) => (
                    <div style={{
                        borderRadius: '5px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '3px',
                            left: '3px',
                            background: 'white',
                            color: '#444',
                            fontSize: '.7em',
                            padding: '4px 5px',
                            borderRadius: '5px',
                            opacity: .9
                        }}>{index}</div>
                        <img
                            src={data.src}
                            style={{
                                display: 'block',
                                width: '100%'
                            }}
                        />
                        {/*<div style={{
                            fontFamily: 'Roboto Slab',
                            fontSize: '.88em',
                            padding: '3px 0',
                            fontWeight: '400',
                            color: '#222',
                        }}>{data.name}</div>*/}
                    </div>
                )}
            </Masonic>
        </div>
    )

}

export default Masonry
