import React, { useState, useCallback, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";

import axios from "axios";

import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";

import { RestaurantsList } from "./RestaurantsList";
import { RouteMap } from "./RouteMap";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationError, setLocationError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      if (!position) {
        setLocationError(true);
      }
      const { latitude, longitude } = position.coords;
      setCoords({ lat: latitude, lng: longitude });
    });
  }, []);

  const search = async () => {
    setLoading(true);
    const { data } = await axios.get(
      `/api/restaurants/${searchTerm}/${coords.lat}/${coords.lng}`
    );
    setRestaurants(data);
    setLoading(false);
  };

  const findOnMap = useCallback((restaurant) => {
    setSelectedPlace(restaurant);
  }, []);

  return (
    <Grid container>
      <Grid item xs={6}>
        <TextField
          placeholder="Enter a restaurant"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <Button onClick={search} disabled={loading}>
          Search for restaurants near you
        </Button>
        {loading ? <CircularProgress /> : null}
        {locationError ? (
          <Typography>Please enable location sharing</Typography>
        ) : null}

        {restaurants?.businesses && restaurants.businesses.length !== 0 ? (
          <RestaurantsList restaurants={restaurants} findOnMap={findOnMap} />
        ) : null}
      </Grid>
      <Grid item xs={6}>
        {coords.lat !== 0 && coords.lng !== 0 ? (
          <RouteMap coords={coords} selectedPlace={selectedPlace} />
        ) : (
          <CircularProgress />
        )}
      </Grid>
    </Grid>
  );
};

export default App;
