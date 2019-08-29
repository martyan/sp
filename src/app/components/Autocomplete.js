import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import debounce from '../lib/helpers/debounce'
import { Button } from './Map'

const Autocomplete = ({ maps, value, onChange }) => {

    const inputRef = useRef(null)
    const [ predictions, setPredictions ] = useState([])

    let sessionToken
    let autocompleteService

    useEffect(() => {
        sessionToken = new maps.places.AutocompleteSessionToken()
        autocompleteService = new maps.places.AutocompleteService()
    })

    const getPredictions = (input) => {
        autocompleteService.getPlacePredictions({input, sessionToken}, places => {
            setPredictions(places)
        })
    }

    const handleInputChange = (e) => {
        onChange(e.target.value)
        if(e.target.value.length) getPredictions(e.target.value)
        else setPredictions([])
    }

    const handleBtnClick = () => {
        if(predictions.length > 0) {
            setPredictions([])
            onChange('')
        } else {
            inputRef.current.focus()
        }
    }

    return (
        <Wrapper large={predictions.length > 0}>
            <Predictions>
                {predictions.reverse().map(prediction => <div key={prediction.id} className="prediction">{prediction.description}</div>)}
            </Predictions>

            <label>
                <input
                    value={value}
                    ref={inputRef}
                    type="text"
                    placeholder="Search"
                    onChange={handleInputChange}
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
        border: none;
        background: transparent;
        color: white;
        font-weight: 300;
        padding: 12px 18px;

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
    
    .prediction {
        color: white;
        padding: 10px 18px;
        font-weight: 300;
        border-bottom: 1px solid rgba(255,255,255, .1);
        transition: .2s ease;
        
        &:hover {
            background: rgba(111,111,111,.5);
        }
    }
`
