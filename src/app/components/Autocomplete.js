import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import useDebounce from '../lib/helpers/useDebounce'
import { Button } from './Map'
import poweredByGoogle from '../static/img/powered_by_google.png'
import poweredByGoogleInverse from '../static/img/powered_by_google_inverse.png'

const Autocomplete = ({ maps, map, onPlaceSelect, inverse, blurSignal }) => {

    const inputRef = useRef(null)
    const [ searchStr, setSearchStr ] = useState('')
    const [ predictions, setPredictions ] = useState([])
    const [ activePrediction, setActivePrediction ] = useState(null)
    const [ isFocused, setIsFocused ] = useState(false)
    const debouncedSearchStr = useDebounce(searchStr, 200);

    const sessionToken = useRef(null)
    const sessionTokenCreated = useRef(null)
    const autocompleteService = useRef(null)

    useEffect(() => {
        if(isFocused) inputRef.current.blur()
    }, [blurSignal])

    const getNow = () => new Date().getTime()

    const resetSessionToken = () => {
        console.log('reset autocomplete session token')

        sessionToken.current = new maps.places.AutocompleteSessionToken()
        sessionTokenCreated.current = getNow()
    }

    const getPredictions = (input) => {
        console.log('get predictions')

        const placeOpts = {
            input,
            sessionToken: sessionToken.current
        }

        autocompleteService.current.getPlacePredictions(placeOpts, places => {
            if(places) {
                setPredictions(places)
                setActivePrediction(null)
            }
        })
    }

    useEffect(() => {
        autocompleteService.current = new maps.places.AutocompleteService()
    }, [])

    useEffect(() => {
        if(debouncedSearchStr) getPredictions(debouncedSearchStr)
        else setPredictions([])
    }, [debouncedSearchStr])

    const increaseActivePrediction = () => {
        if(predictions.length === 0) return
        if(activePrediction === null) setActivePrediction(0)
        else setActivePrediction(activePrediction === predictions.length - 1 ? 0 : activePrediction + 1)
    }

    const decreaseActivePrediction = () => {
        if(predictions.length === 0) return
        if(activePrediction === null) setActivePrediction(predictions.length - 1)
        else setActivePrediction(activePrediction === 0 ? predictions.length - 1 : activePrediction - 1)
    }

    const handleInputFocus = () => {
        setIsFocused(true)

        const now = new Date().getTime()

        if(now - sessionTokenCreated.current >= 180000) resetSessionToken()
    }

    const handleInputBlur = () => {
        setTimeout(() => setIsFocused(false), 0)
    }

    const handleInputKeyDown = (e) => {
        if(!isFocused) {
            setIsFocused(true)
            if(e.key === 'ArrowUp' || e.key === 'ArrowDown') return e.preventDefault()
        }

        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault()
                return decreaseActivePrediction()
            case 'ArrowDown':
                e.preventDefault()
                return increaseActivePrediction()
            case 'Escape':
                return inputRef.current.blur()
            case 'Enter':
                return getPlace()
        }
    }

    const handleBtnClick = () => {
        if(predictions.length > 0) {
            setPredictions([])
            setActivePrediction(null)
            setSearchStr('')
        } else {
            inputRef.current.focus()
        }
    }

    const reversedPredictions = [...predictions].reverse()

    const getPlace = (preferredPrediction) => {
        const predictionIndex = (typeof preferredPrediction === 'undefined') ? activePrediction : preferredPrediction
        if(!Number.isInteger(predictionIndex)) return

        const prediction = reversedPredictions[predictionIndex]

        const request = {
            placeId: prediction.place_id,
            fields: ['geometry']
        }

        const service = new maps.places.PlacesService(map);
        service.getDetails(request, (place, status) => {
            if(status == maps.places.PlacesServiceStatus.OK) {
                console.log(place)
                const zoom = getBoundsZoomLevel(place.geometry.viewport, {width: map.getDiv().offsetWidth, height: map.getDiv().offsetHeight})
                const lat = place.geometry.location.lat()
                const lng = place.geometry.location.lng()
                onPlaceSelect({lat, lng, zoom})
                setIsFocused(false)
                resetSessionToken()
                inputRef.current.blur()
                // map.fitBounds(place.geometry.viewport)
            }
        })
    }

    const getBoundsZoomLevel = (bounds, mapDim) => {
        const WORLD_DIM = { height: 256, width: 256 }
        const ZOOM_MAX = 21

        const latRad = (lat) => {
            const sin = Math.sin(lat * Math.PI / 180)
            const radX2 = Math.log((1 + sin) / (1 - sin)) / 2
            return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2
        }

        const zoom = (mapPx, worldPx, fraction) => {
            return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2)
        }

        const ne = bounds.getNorthEast()
        const sw = bounds.getSouthWest()

        const latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI

        const lngDiff = ne.lng() - sw.lng()
        const lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360

        const latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction)
        const lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction)

        return Math.min(latZoom, lngZoom, ZOOM_MAX)
    }

    return (
        <Wrapper large={isFocused} inverse={inverse}>
            <Predictions collapsed={!isFocused} inverse={inverse}>
                {(isFocused && predictions.length > 0) && (
                    <>
                        <div className="powered">
                            <img src={inverse ? poweredByGoogleInverse : poweredByGoogle} alt="Powered by Google" />
                        </div>
                        {reversedPredictions.map((prediction, index) => (
                            <div
                                key={prediction.id}
                                className={activePrediction === index ? 'prediction active' : 'prediction'}
                                onClick={() => getPlace(index)}
                            >
                                {prediction.description}
                            </div>
                        ))}
                    </>
                )}
            </Predictions>
            <label>
                <input
                    value={searchStr}
                    ref={inputRef}
                    type="text"
                    placeholder="Search"
                    onChange={e => setSearchStr(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                />
                <SearchBtn onClick={handleBtnClick} inverse={inverse}>
                    {searchStr.length === 0 ?
                        <i className="fa fa-search"></i> :
                        <i className="fa fa-times"></i>
                    }
                </SearchBtn>
            </label>
        </Wrapper>
    )

}

Autocomplete.propTypes = {
    maps: PropTypes.object,
    map: PropTypes.object,
    onPlaceSelect: PropTypes.func.isRequired,
    inverse: PropTypes.bool.isRequired
}

export default Autocomplete

const Wrapper = styled.div`
    position: absolute;
    bottom: 12px;
    right: 12px;
    z-index: 99;
    width: calc(100% - 24px);
    max-width: ${({large}) => large ? '420px' : '160px'};
    background: ${({inverse}) => inverse ? 'white' : '#444'};
    border: none;
    border-radius: 20px;
    overflow: hidden;
    transition: .5s ease;
    
    label {
        position: relative;
        display: block;
    }
    
    input {
        display: block;
        width: 100%;
        height: 42px;
        border: none;
        background: transparent;
        color: ${({inverse}) => inverse ? '#444' : 'white'};
        font-weight: 300;
        padding: 6px 18px;
        transition: .2s ease;

        &::placeholder {
            color: rgba(255,255,255, .8);
            color: ${({inverse}) => inverse ? 'rgba(44,44,44, .8)' : 'rgba(255,255,255, .8)'};
            font-weight: 300;
        }
    }
`

const SearchBtn = styled(props => <Button {...props} />)`
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 99;
    background: transparent !important;
    
    i {
        color: ${({inverse}) => inverse ? '#222' : 'white'};
        transition: .2s ease;
    }
`

const Predictions = styled.div`
    overflow: hidden;
    max-height: ${({collapsed}) => collapsed ? '0' : '50vh'};
    transition: .5s ease;
    
    .powered {
        padding: 3px;
        text-align: center;
        border-bottom: ${({inverse}) => inverse ? '1px solid rgba(0, 0, 0, .1)' : '1px solid rgba(255,255,255, .1)'};
        opacity: .8;
        
        img {
            width: 110px;
        }
    }
    
    .prediction {
        color: ${({inverse}) => inverse ? 'rgba(0,0,0, .8)' : 'rgba(255,255,255, .8)'};
        padding: 10px 18px;
        font-weight: 300;
        font-size: .94em;
        border-bottom: ${({inverse}) => inverse ? '1px solid rgba(0, 0, 0, .1)' : '1px solid rgba(255,255,255, .1)'};
        transition: .2s ease;
        
        &:hover, &.active {
            background: rgba(111,111,111,.5);
        }
    }
`
