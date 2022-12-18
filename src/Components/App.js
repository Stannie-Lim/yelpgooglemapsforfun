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
import { SearchBar } from "./SearchBar";

const App = () => {
  // if user does not allow us to see their location, this error will show
  const [locationError, setLocationError] = useState(false);

  // this shows to the user that we are loading search results
  const [loading, setLoading] = useState(false);

  // this is the user's current location coords
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });

  // this is the place that the user had selected to display on the map
  const [selectedPlace, setSelectedPlace] = useState(null);

  // this is obtained from the yelp api. it is the list of restaurants queried by...
  // 1. it finds the user's current location
  // 2. user inputs a restaurant name. you use yelp api to find all restaurants closest to that name, nearest to user
  const [restaurants, setRestaurants] = useState(null);

  // this useEffect is just getting my current location. user has to enable location sharing in chrome
  // once it gets my current location, it'll set the `coords` state to store current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      if (!position) {
        setLocationError(true);
      }
      const { latitude, longitude } = position.coords;
      setCoords({ lat: latitude, lng: longitude });
    });
  }, []);

  // this will be used in the SearchBar component. all the searchbar component is doing is asking for user input. after user types something in, then presses the button, it will call this function to get the restaurants near the user
  const onSearch = async (searchTerm) => {
    // before we start our axios call, signal to the user that we are loading the results
    setLoading(true);

    // the whole idea of this app is that-
    // 1. it finds the user's current location
    // 2. user inputs a restaurant name. you use yelp api to find all restaurants closest to that name, nearest to user
    // we have the user's location in the `coords` state through the useEffect
    // we also have user's input through the <SearchBar /> component. time to call our api. look at server/app.js in the `/api/restaurants/:name/:lat/:long` route- this is the express route where i call the yelp api
    const { data } = await axios.get(
      `/api/restaurants/${searchTerm}/${coords.lat}/${coords.lng}`
    );

    // after we get our data, signal to user that we finished loading
    setRestaurants(data);
    setLoading(false);
  };

  // yelp api gives the results like this-
  // { businesses: Array of length 20, total: total amount that match your search query, region: where you currently are }
  // im just taking the `businesses` field out of the object since this is what we want to render
  // `restaurants` can also be `null`. if you do `null.businesses`, the app will crash saying "cannot read property businesses of null"
  // if you have `restaurants?.businesses`, it'll prevent that crash
  const businesses = restaurants?.businesses;

  return (
    // Grid is a css positioning framework much like flexbox
    // i just like grid a lot more than flexbox
    // material ui created a Grid component that helps you position things onto the screen more easily
    // in this case, 1/2 of the screen will be the first `<Grid item xs={6}>` block
    // the second 1/2 of the screen will be the second `<Grid item xs={6}>` block
    <Grid container>
      {/* first half of the screen */}
      <Grid item xs={6}>
        {/* this search bar component is where user will type in the restaurant they want to find. look at SearchBar.js */}
        <SearchBar onSearch={onSearch} loading={loading} />

        {locationError ? (
          <Typography>Please enable location sharing</Typography>
        ) : null}

        {/*
          this is the list of restaurants that we have found through yelp api. if we did not find any restaurants, we want to just display `null`
          this component allows users to click a restaurant in order to show it on the map. look at RestaurantsList.js
        */}
        {businesses && businesses.length !== 0 ? (
          <RestaurantsList
            restaurants={restaurants}
            setSelectedPlace={setSelectedPlace}
          />
        ) : null}
        {/* end of first half of the screen */}
      </Grid>

      {/* second half of the screen */}
      <Grid item xs={6}>
        {/*
            when i created the `coords` state somewhere up there- const [coords, setCoords] = useState({ lat: 0, lng: 0 });
            i made the default lat and lng to be 0. the useEffect should find my current location and set the lat and lng to where i currently am
            if the lat and lng is 0, that means the useEffect didnt have enough time to get my current location, so we just return a `CircularProgress` which tells the user that we are still loading data

            RouteMap is a custom component i made. it takes in...
            1. `coords` which is the coords of where the user is currently at
            2. the place that user selected in `RestaurantsList`
          */}
        {coords.lat !== 0 && coords.lng !== 0 ? (
          <RouteMap coords={coords} selectedPlace={selectedPlace} />
        ) : (
          <CircularProgress />
        )}
      </Grid>
      {/* end of second half of the screen */}
    </Grid>
  );
};

export default App;
