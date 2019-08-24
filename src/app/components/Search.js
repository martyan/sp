import React, { useEffect, useRef } from 'react'

const Search = ({ maps }) => {

    const inputRef = useRef(null)
    let search

    const onPlacesChanged = () => {
        console.log(search.getPlaces())
    }

    useEffect(() => {
        search = new maps.places.SearchBox(inputRef.current)
        search.addListener('places_changed', onPlacesChanged)

        return () => maps.event.clearInstanceListeners(search)
    })

    return (
        <input type="text" ref={inputRef} placeholder="Search" />
    )

}

export default Search
