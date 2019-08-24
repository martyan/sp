import React, { useState } from 'react'
import GoogleMapReact from 'google-map-react'
import axios from 'axios'
import crosshair from '../static/img/crosshair.svg'
import styled from 'styled-components'
import Search from './Search'

const MapWrapper = styled.div`
    position: relative;
    height: 100vh; /* Use vh as a fallback for browsers that do not support Custom Properties */
    height: calc(var(--vh, 1vh) * 100);
`

const Crosshair = styled.div`
    pointer-events: none;
    background: url(${crosshair});
    // ie conditional
    // filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='your_transparent.png', sizingMethod='scale');
    // background: none !important;

    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 99;
    width: 60px;
    height: 60px;
    transition: .4s ease;
    transform-origin: 0 0;
    transform: scale(${({visible}) => visible ? 1 : 0}) translate(-50%, -50%);
`

const Marker = styled.div`
    transform: translate(-50%, -100%);
    width: 48px;
    height: 48px;
`

const Button = styled.button`
    width: 40px;
    height: 40px;
    padding: 0;
    line-height: 40px;
    border: 0;
    border-radius: 50%;
    background: #444;
    color: white;
    font-weight: bold;
    text-align: center;
`

const Done = styled(Button)`
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 99;
`

const Redo = styled(Button)`
    position: absolute;
    top: 10px;
    right: 60px;
    z-index: 99;
`

const MapType = styled(Button)`
    position: absolute;
    bottom: 110px;
    right: 10px;
    z-index: 99;
`

const Geolocation = styled(Button)`
    position: absolute;
    bottom: 60px;
    right: 10px;
    z-index: 99;
    font-size: 1.3em;
`

const StyledSearch = styled.div`
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 99;
    background: #444;
    border: none;
    border-radius: 20px;
    
    input {
        border: none;
        background: transparent;
        color: white;
        padding: 5px 15px;
        
        &::placeholder {
            color: rgba(255,255,255, .8)
        }
    }
`

const marker = <svg height="48px" viewBox="0 0 48 48"><path clipRule="evenodd" d="M24,47c0,0-18-9.417-18-28C6,9.059,14.059,1,24,1s18,8.059,18,18  C42,37.583,24,47,24,47z M24,3C15.178,3,8,10.178,8,19c0,14.758,12.462,23.501,16.003,25.687C27.547,42.51,40,33.805,40,19  C40,10.178,32.822,3,24,3z M24,28c-4.971,0-9-4.029-9-9s4.029-9,9-9s9,4.029,9,9S28.971,28,24,28z M24,12c-3.866,0-7,3.134-7,7  s3.134,7,7,7s7-3.134,7-7S27.866,12,24,12z" fillRule="evenodd"/></svg>
// const marker = (
//     <svg viewBox="0 0 468.076 468.076">
//         <g>
//             <polygon points="32.514,32.514 104.216,32.514 104.216,0 0,0 0,104.216 32.514,104.216"/>
//             <polygon points="468.076,0 363.859,0 363.859,32.514 435.562,32.514 435.562,104.216 468.076,104.216"/>
//             <polygon points="0,468.076 104.216,468.076 104.216,435.562 32.514,435.562 32.514,363.859 0,363.859"/>
//             <polygon points="435.562,435.562 363.859,435.562 363.859,468.076 468.076,468.076 468.076,363.859 435.562,363.859"/>
//             <circle cx="234.038" cy="234.038" r="20.809"/>
//         </g>
//     </svg>
// )

const Map = () => {
    const defaultCenter = {lat: 49.20724370019872, lng: 16.593615532609107}
    const defaultZoom = 3

    const [ googleMaps, setGoogleMaps ] = useState(null)
    const [ mapCenter, setMapCenter ] = useState({...defaultCenter})
    const [ markerCoords, setMarkerCoords ] = useState(null)
    const [ searchCollapsed, setSearchCollapsed ] = useState(true)
    const [ zoom, setZoom ] = useState(defaultZoom)
    const [ mapTypeId, setMapTypeId ] = useState('roadmap')
    const [ geoAccuracy, setGeoAccuracy ] = useState(null)
    const [ reviewing, setReviewing ] = useState(false)

    const createMapOptions = (maps) => {
        return {
            disableDefaultUI: true,
            gestureHandling: !reviewing ? 'greedy' : 'none',
            mapTypeId,
            minZoom: 2,
            // panControl: false,
            // mapTypeControl: true,
            // scrollwheel: false,
            // styles: [{ stylers: [{ 'saturation': -100 }, { 'gamma': 0.8 }, { 'lightness': 4 }, { 'visibility': 'on' }] }]
        }
    }

    const geocode = async () => {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${mapCenter.lat},${mapCenter.lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`)

        const { results } = response.data

        if(!results.length) return null

        const firstMatch = results[0]

        const location = {
            city: '',
            country: '',
            address: firstMatch['formatted_address']
        }

        const locality = firstMatch['address_components'].find(addr => addr.types.indexOf('locality') > -1)
        const political = firstMatch['address_components'].find(addr => addr.types.indexOf('political') > -1)
        const country = firstMatch['address_components'].find(addr => addr.types.indexOf('country') > -1)

        const getLongName = (addr) => addr.long_name || ''

        location.city = locality ? getLongName(locality) : getLongName(political)
        location.country = getLongName(country)

        return location
    }

    const placeMarker = () => {
        setMarkerCoords(mapCenter)

        console.log(mapCenter)

        geocode()
            .then(() => {
                if(zoom < 14) setZoom(14)
                setReviewing(true)
            })
            .catch(console.error)
    }

    const handleGeolocationSuccess = (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        setMapCenter({lat, lng})
        setGeoAccuracy(position.accuracy)
        setZoom(17)
    }

    const geolocate = () => {
        if(!navigator.geolocation) return

        navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, console.error)
    }

    const handleMapChange = (mapOptions) => {
        setMapCenter(mapOptions.center)
        setZoom(mapOptions.zoom)
    }

    const toggleMapType = () => {
        setMapTypeId(mapTypeId === 'roadmap' ? 'hybrid' : 'roadmap')
    }

    const userHasMovedMap = () => {
        return (
            mapCenter.lat !== defaultCenter.lat ||
            mapCenter.lng !== defaultCenter.lng ||
            zoom !== defaultZoom
        )
    }

    return (
        <MapWrapper>
            <Crosshair visible={!reviewing} />

            {userHasMovedMap() && (
                <Done onClick={placeMarker}>
                    <i className="fa fa-check"></i>
                </Done>
            )}

            {reviewing ? (
                <>
                    <Redo onClick={() => setReviewing(false)}>
                        <i className="fa fa-repeat"></i>
                    </Redo>
                </>
            ) : (
                <>
                    <MapType onClick={toggleMapType}>
                        <i className={mapTypeId === 'roadmap' ? 'fa fa-map-o' : 'fa fa-globe'}></i>
                    </MapType>
                    <Geolocation onClick={geolocate}>
                        <i className="fa fa-crosshairs"></i>
                    </Geolocation>
                    <StyledSearch>
                        {!searchCollapsed && <Search maps={googleMaps.maps} />}
                        <Button onClick={() => setSearchCollapsed(!searchCollapsed)}>
                            <i className="fa fa-search"></i>
                        </Button>
                    </StyledSearch>
                </>
            )}

            <div style={{ height: '100%', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY, libraries: ['places'] }}
                    center={{lat: mapCenter.lat, lng: mapCenter.lng}}
                    zoom={zoom}
                    onChange={handleMapChange}
                    gestureHandling="greedy"
                    options={createMapOptions}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={setGoogleMaps}
                >
                    {(markerCoords && reviewing) && (
                        <Marker
                            className="marker"
                            lat={markerCoords.lat}
                            lng={markerCoords.lng}
                        >
                            {marker}
                        </Marker>
                    )}
                </GoogleMapReact>
            </div>
        </MapWrapper>
    )
}

export default Map
