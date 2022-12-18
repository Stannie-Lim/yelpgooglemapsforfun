import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
  DirectionsService,
} from "@react-google-maps/api";
import { CircularProgress } from "@mui/material";

// we want the map to be 600x600
const containerStyle = {
  width: "600px",
  height: "600px",
};

// btw im not a google maps expert. i just read the docs to be able to do all this
// this component takes 2 props
// 1. `coords` is where the user currently is in latitude and longitude. we want to display this as a marker on the map
// 2. `selectedPlace` is the place that user selected in <RestaurantsList` to display on the map

// this component does a few things
// 1. show a map
// 2. show current location on map as a marker
// 3. calculate a route from user's current location to the `selectedPlace`. this is possible because both `coords` and `selectedPlace` have a lat and long. google can take these two lat/longs and calculate a route
export const RouteMap = ({ coords, selectedPlace }) => {
  // this will be the map that we want to render
  const [map, setMap] = useState(null);

  // this will be the route from user to the selected place. this is calculated by DirectionsService and shown on the map by DirectionsRenderer
  const [directions, setDirections] = useState(null);

  // i copied this from the docs idk what it does. i guess it loads the map using the api key. also, i accidentally exposed this api key so im gonna hide it in my .env from now on
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  // when the map finally loads, put a marker on the user's current position. i also copied this from the docs then modified it a bit
  const onLoad = (map) => {
    if (window.google?.maps) {
      const marker = new window.google.maps.Marker({
        position: coords,
        map: map,
      });

      setMap(map);
    }
  };

  // copied from docs
  const onUnmount = (map) => {
    setMap(null);
  };

  // copied from docs. i guess DirectionsService component uses this to calculate the route from point A to B
  // after the route is calculated, DirectionsService invokes this function
  // if the status is "OK", it'll set the directions state with the response
  const directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === "OK") {
        setDirections(response);
      } else {
        console.log("response: ", response);
      }
    }
  };

  // if the map had not been loaded yet, just return a CircularProgress
  return isLoaded ? (
    <GoogleMap
      // this makes the map 600x600
      mapContainerStyle={containerStyle}
      // center would be user's current location
      center={coords}
      zoom={15}
      // when map finishes loading, call the `onLoad` function to play a marker where the user is
      onLoad={onLoad}
      // copied from api
      onUnmount={onUnmount}
    >
      {/* if user selected a place
          1. put a marker on the map at that place
          2. call DirectionsService to calculate the directions from origin to destination
          i copied all this from the docs and modified it to suit my needs
      */}
      {selectedPlace ? (
        <>
          <Marker
            position={{
              lat: selectedPlace.coordinates.latitude,
              lng: selectedPlace.coordinates.longitude,
            }}
          />
          <DirectionsService
            options={{
              destination: {
                lat: selectedPlace.coordinates.latitude,
                lng: selectedPlace.coordinates.longitude,
              },
              origin: coords,
              travelMode: "DRIVING",
            }}
            callback={directionsCallback}
          />
        </>
      ) : null}

      {/* once DirectionsService finishes calculating the directions, it just renders the route on DirectionsRenderer. i copied this from the docs */}
      {selectedPlace && directions ? (
        <DirectionsRenderer
          options={{
            directions,
          }}
        />
      ) : null}
    </GoogleMap>
  ) : (
    <CircularProgress />
  );
};
