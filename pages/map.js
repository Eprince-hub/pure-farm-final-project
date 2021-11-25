import { CircularProgress } from '@material-ui/core';
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from '@react-google-maps/api';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';

const defaultLocation = { lat: 53.814, lng: -95.85 };
const libs = ['places'];

function Map() {
  // google api state variables
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [center, setCenter] = useState(defaultLocation);
  const [location, setLocation] = useState(center);

  const router = useRouter();
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchGoogleApiKey = async () => {
      try {
        // get the google api key from the backend
        const { data } = await axios('/api/keys/google', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        // set google api key
        setGoogleApiKey(data);

        // get user location
        getUserCurrentLocation();
      } catch (error) {
        enqueueSnackbar(getError(error), { variant: 'error' });
      }
    };

    fetchGoogleApiKey();
  }, []);

  // function that gets the user's location

  function getUserCurrentLocation() {
    if (!navigator.geolocation) {
      enqueueSnackbar('Your Location Could Not Be Established', {
        variant: 'error',
      });
    } else {
      // getting the user location
      navigator.geolocation.getCurrentPosition((position) => {
        // location from the map
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        // location the user would select
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }

  const mapRef = useRef(null);
  const placeRef = useRef(null);
  const markerRef = useRef(null);

  const onLoad = (map) => {
    mapRef.current = map;
  };

  const onIdle = () => {
    // setting the new location after the map may have been dragged
    setLocation({
      lat: mapRef.current.center.lat(),
      lng: mapRef.current.center.lng(),
    });
  };

  const onLoadPlaces = (place) => {
    placeRef.current = place;
  };

  const onPlacesChanged = () => {
    const place = placeRef.current.getPlaces()[0].geometry.location;
    setCenter({ lat: place.lat(), lng: place.lng() });
    setLocation({ lat: place.lat(), lng: place.lng() });
  };

  const onConfirm = () => {
    const places = placeRef.current.getPlaces();
    if (places && places.length === 1) {
      dispatch({
        type: 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION',
        payload: {
          lat: location.lat,
          lng: location.lng,
          address: places[0].formatted_address,
          name: places[0].name,
          vicinity: places[0].vicinity,
          googleAddressId: places[0].id,
        },
      });

      enqueueSnackbar('Your Location Have Been Set', { variant: 'success' });

      router.push('/shipping');
    }
  };

  const onMarkerLoad = (marker) => {
    markerRef.current = marker;
  };

  return (
    <Layout title="Map">
      {googleApiKey ? (
        <div className={classes.fullContainer}>
          <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
            {/* render Google Map */}
            <GoogleMap
              id="sample-map"
              mapContainerStyle={{ height: '100%', width: '100%' }}
              center={center}
              zoom={15}
              onLoad={onLoad}
              onIdle={onIdle}
            >
              <StandaloneSearchBox
                onLoad={onLoadPlaces}
                onPlacesChanged={onPlacesChanged}
              >
                <div className={classes.mapInputBox}>
                  <input type="text" placeholder="Search Your Address"></input>
                  <button type="button" className="primary" onClick={onConfirm}>
                    Confirm
                  </button>
                </div>
              </StandaloneSearchBox>

              <Marker position={location} onLoad={onMarkerLoad}></Marker>
            </GoogleMap>
          </LoadScript>
        </div>
      ) : (
        <CircularProgress />
      )}
    </Layout>
  );
}

// prevent server side rendering

export default dynamic(() => Promise.resolve(Map), { ssr: false });
