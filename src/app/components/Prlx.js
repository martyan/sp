import React, { useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { Parallax, Background } from 'react-parallax'

const THRESHOLD = [0, 0.5, 1]
const Prlx = ({ children, src }) => {
    const [ref, inView, entry] = useInView({
        threshold: 0
    })

    return (
        <div ref={ref} style={{position: 'relative'}}>
            {/*<div style={{height: 100, background: 'indianred'}}></div>*/}
            <Parallax
                bgImage={src || null}
                bgImageAlt="Some alt text"
                strength={src ? 100 : 0}
                bgClassName={`hero`}
                disabled={!inView}
                // renderLayer={percentage => {
                //     const value = Math.min(Math.max(percentage * 5, 0), 1)
                //     return (
                //         <div
                //             style={{
                //                 opacity: 1 - value,
                //                 position: 'absolute',
                //                 top: 0,
                //                 left: 0,
                //                 width: '100%',
                //                 height: '100%',
                //                 background: 'white',
                //                 zIndex: 9999999,
                //                 pointerEvents: 'none'
                //             }}
                //         >
                //         </div>
                //     )
                // }}
            >
                {!!children && <Background />}
                {children || null}
                {!children && <div style={{height: '200px'}} />}
            </Parallax>
            {/*<Parallax
                disabled={!inView}
                strength={0}
                renderLayer={percentage => {
                    const value = Math.min(Math.max(percentage * 2.5, 0), 1)
                    return (
                        <div style={{opacity: value}}>
                            <h2 data-aos="fade-up">Lipsum amet</h2>
                        </div>
                    )
                }}
            >
                <Background></Background>
            </Parallax>*/}
        </div>
    )
}

export default Prlx
