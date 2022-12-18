import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
  DirectionsService,
} from "@react-google-maps/api";
import { CircularProgress } from "@mui/material";

const containerStyle = {
  width: "600px",
  height: "600px",
};

export const RouteMap = ({ coords, selectedPlace }) => {
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBfOWZ78zVEePUSQxRDJXi1Cvgfa8Xt7JE",
  });
  const onLoad = useCallback(function callback(map) {
    if (window.google?.maps) {
      // const bounds = new window.google.maps.LatLngBounds(coords);

      const marker = new window.google.maps.Marker({
        position: coords,
        map: map,
      });

      setMap(map);
    }
  }, []);

  const onUnmount = useCallback((map) => {
    setMap(null);
  }, []);

  const directionsCallback = useCallback((response) => {
    if (response !== null) {
      if (response.status === "OK") {
        setDirections(response);
      } else {
        console.log("response: ", response);
      }
    }
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={coords}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {selectedPlace ? (
        <Marker
          position={{
            lat: selectedPlace.coordinates.latitude,
            lng: selectedPlace.coordinates.longitude,
          }}
        />
      ) : null}
      {selectedPlace ? (
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
      ) : null}
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
