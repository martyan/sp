import React, { useState } from 'react'
import GoogleMapReact from 'google-map-react'
import styled from 'styled-components'

const marker = <svg viewBox="0 0 36 48"><g><path className="dark" d="M18,0.1c0,2.8,0,6.1,0,9.9c4.9,0,8.8,4.1,8.8,9.2s-3.9,9-8.8,9c0,6.7,0,13.7,0,19.8c11-7.7,18.2-16.9,18-29.2 C35.1,9,30.6,2,19.5,0.2C19,0.1,18.6,0.1,18,0.1z"/><path className="light" d="M18,0.1c0,2.8,0,6.1,0,9.9c-4.9,0-8.8,4.1-8.8,9.2s3.9,9,8.8,9c0,6.7,0,13.7,0,19.8C7,40.3-0.2,31.1,0,18.8 C0.8,9,5.3,2,16.5,0.2C17,0.1,17.5,0.1,18,0.1z"/></g></svg>

const MapEmbed = () => {
    const defaultCenter = {lat: 49.20724370019872, lng: 16.593615532609107}
    const defaultZoom = 11

    const [ googleMaps, setGoogleMaps ] = useState(null)
    const [ mapCenter, setMapCenter ] = useState({...defaultCenter})
    const [ zoom, setZoom ] = useState(defaultZoom)
    const [ mapTypeId, setMapTypeId ] = useState('roadmap')

    const createMapOptions = (maps) => {
        return {
            disableDefaultUI: true,
            gestureHandling: 'none',
            mapTypeId,
            minZoom: 2,
            // panControl: false,
            // mapTypeControl: true,
            // scrollwheel: false,
            // styles: [{"featureType": "administrative", "elementType": "all", "stylers": [{"visibility": "on"}, {"lightness": 33 } ] }, {"featureType": "landscape", "elementType": "all", "stylers": [{"color": "#f2e5d4"} ] }, {"featureType": "poi.park", "elementType": "geometry", "stylers": [{"color": "#c5dac6"} ] }, {"featureType": "poi.park", "elementType": "labels", "stylers": [{"visibility": "on"}, {"lightness": 20 } ] }, {"featureType": "road", "elementType": "all", "stylers": [{"lightness": 20 } ] }, {"featureType": "road.highway", "elementType": "geometry", "stylers": [{"color": "#c5c6c6"} ] }, {"featureType": "road.arterial", "elementType": "geometry", "stylers": [{"color": "#e4d7c6"} ] }, {"featureType": "road.local", "elementType": "geometry", "stylers": [{"color": "#fbfaf7"} ] }, {"featureType": "water", "elementType": "all", "stylers": [{"visibility": "on"}, {"color": "#acbcc9"} ] } ]
            styles: [{"featureType": "landscape.man_made", "elementType": "geometry", "stylers": [{"color": "#f7f1df"} ] }, {"featureType": "landscape.natural", "elementType": "geometry", "stylers": [{"color": "#d0e3b4"} ] }, {"featureType": "landscape.natural.terrain", "elementType": "geometry", "stylers": [{"visibility": "off"} ] }, {"featureType": "poi", "elementType": "labels", "stylers": [{"visibility": "off"} ] }, {"featureType": "poi.business", "elementType": "all", "stylers": [{"visibility": "off"} ] }, {"featureType": "poi.medical", "elementType": "geometry", "stylers": [{"color": "#fbd3da"} ] }, {"featureType": "poi.park", "elementType": "geometry", "stylers": [{"color": "#bde6ab"} ] }, {"featureType": "road", "elementType": "geometry.stroke", "stylers": [{"visibility": "off"} ] }, {"featureType": "road", "elementType": "labels", "stylers": [{"visibility": "off"} ] }, {"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"color": "#ffe15f"} ] }, {"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"color": "#efd151"} ] }, {"featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{"color": "#ffffff"} ] }, {"featureType": "road.local", "elementType": "geometry.fill", "stylers": [{"color": "black"} ] }, {"featureType": "transit.station.airport", "elementType": "geometry.fill", "stylers": [{"color": "#cfb2db"} ] }, {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#a2daf2"} ] } ]
        }
    }

    const isInverse = mapTypeId === 'hybrid'

    return (
        <MapWrapper>
            <div style={{ height: '100%', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY, libraries: ['places'] }}
                    center={{lat: mapCenter.lat, lng: mapCenter.lng}}
                    zoom={zoom}
                    gestureHandling="greedy"
                    options={createMapOptions}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={setGoogleMaps}
                >
                    {/*{markerCoords && (*/}
                        <Marker
                            className="marker"
                            // lat={markerCoords.lat}
                            // lng={markerCoords.lng}
                            lat={defaultCenter.lat}
                            lng={defaultCenter.lng}
                            inverse={isInverse}
                        >
                            {marker}
                        </Marker>
                    {/*)}*/}
                </GoogleMapReact>
            </div>
        </MapWrapper>
    )
}

export default MapEmbed

const MapWrapper = styled.div`
    max-width: 720px;
    margin: 25px auto 0;
    position: relative;
    height: 180px;
`

const Marker = styled.div`
    transform: translate(-50%, -100%);
    width: 48px;
    height: 48px;
    // height: 0;
    overflow: hidden;
    animation: marker 1s forwards .1s;

    svg {
        width: 100%;
        height: 100%;
        
        path {
            fill: ${({inverse}) => inverse ? 'white' : '#222'};
        }
        
        .dark {
            fill: ${({inverse}) => inverse ? '#ddd' : '#222'};
        }
        
        .light {
            fill: ${({inverse}) => inverse ? 'white' : '#444'};
        }
    }
`
