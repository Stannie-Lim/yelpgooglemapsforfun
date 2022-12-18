import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";

export const SearchBar = ({ onSearch, loading }) => {
  // stores the user's input
  const [searchTerm, setSearchTerm] = useState("");

  // when user clicks the search button, it'll...
  const search = () => {
    // 1. search yelp api for restaurants with this name
    onSearch(searchTerm);

    // 2. reset the input field
    setSearchTerm("");
  };

  return (
    <>
      {/* this is just material ui's version of an input field. think of this as literally just `<input placeholder="Enter a restaurant" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} /> */}
      <TextField
        placeholder="Enter a restaurant"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      {/* same thing here. think of this as just a regular html <button> component */}
      <Button onClick={search} disabled={loading}>
        Search for restaurants near you
      </Button>

      {/* if user clicked the `search` button, it'll take some time to load. signal to the user that we are loading results */}
      {loading ? <CircularProgress /> : null}
    </>
  );
};
