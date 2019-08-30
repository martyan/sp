import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import debounce from '../lib/helpers/debounce'
import { Button } from './Map'
import poweredByGoogle from '../static/img/powered_by_google.png'

const Autocomplete = ({ maps, value, onChange }) => {

    const inputRef = useRef(null)
    const [ predictions, setPredictions ] = useState([])
    const [ activePrediction, setActivePrediction ] = useState(null)
    const [ isFocused, setIsFocused ] = useState(false)

    let sessionToken
    let autocompleteService

    useEffect(() => {
        sessionToken = new maps.places.AutocompleteSessionToken()
        autocompleteService = new maps.places.AutocompleteService()
    })

    const getPredictions = (input) => {
        autocompleteService.getPlacePredictions({input, sessionToken}, places => {
            if(places) {
                setPredictions(places)
                setActivePrediction(null)
            }
        })
    }

    const handleInputChange = (e) => {
        onChange(e.target.value)

        if(e.target.value.length) getPredictions(e.target.value)
        else setPredictions([])
    }

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

    const handleInputKeyDown = (e) => {
        console.log(e.key)

        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault()
                return decreaseActivePrediction()
            case 'ArrowDown':
                e.preventDefault()
                return increaseActivePrediction()
            case 'Escape':
                return inputRef.current.blur()
        }
    }

    const handleBtnClick = () => {
        if(predictions.length > 0) {
            setPredictions([])
            setActivePrediction(null)
            onChange('')
        } else {
            inputRef.current.focus()
        }
    }

    console.log(activePrediction)

    const reversedPredictions = [...predictions].reverse()

    return (
        <Wrapper large={isFocused}>
            <Predictions>
                {(isFocused && predictions.length > 0) && (
                    <>
                        <div className="powered"><img src={poweredByGoogle} alt="Powered by Google" /></div>
                        {reversedPredictions.map((prediction, index) => (
                            <div
                                key={prediction.id}
                                className={activePrediction === index ? 'prediction active' : 'prediction'}
                            >
                                {prediction.description}
                            </div>
                        ))}
                    </>
                )}
            </Predictions>

            <label>
                <input
                    value={value}
                    ref={inputRef}
                    type="text"
                    placeholder="Search"
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onFocus={e => setIsFocused(true)}
                    onBlur={e => setIsFocused(false)}
                />
                <SearchBtn onClick={handleBtnClick}>
                    {value.length === 0 ?
                        <i className="fa fa-search"></i> :
                        <i className="fa fa-times"></i>
                    }
                </SearchBtn>
            </label>
        </Wrapper>
    )

}

export default Autocomplete

const Wrapper = styled.div`
    position: absolute;
    bottom: 12px;
    right: 12px;
    z-index: 99;
    width: calc(100% - 24px);
    max-width: ${({large}) => large ? '420px' : '160px'};
    background: #444;
    border: none;
    border-radius: ${({large}) => large ? '6px' : '20px'};
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
        color: white;
        font-weight: 300;
        padding: 6px 18px;

        &::placeholder {
            color: rgba(255,255,255, .8);
            font-weight: 300;
        }
    }
`

const SearchBtn = styled(props => <Button {...props} />)`
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 99;
`

const Predictions = styled.div`
    overflow: hidden;
    
    .powered {
        margin: 5px 7px 2px;
        text-align: right;
        opacity: .8;
        
        img {
            width: 110px;
        }
    }
    
    .prediction {
        color: white;
        padding: 10px 18px;
        font-weight: 300;
        font-size: .95em;
        border-bottom: 1px solid rgba(255,255,255, .1);
        transition: .2s ease;
        
        &:hover, &.active {
            background: rgba(111,111,111,.5);
        }
    }
`
