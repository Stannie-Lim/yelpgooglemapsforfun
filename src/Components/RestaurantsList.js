import React from "react";

import { Grid, Card, Typography } from "@mui/material";

// this takes in 2 props
// 1. the list of restaurants to display
// 2. the ability for user to click a restaurant to display it on the map
export const RestaurantsList = ({ restaurants, setSelectedPlace }) => {
  return (
    // spacing={3} separates each search result by 24px
    // `1` spacing is `8px` so `3` spacing is `24px`
    <Grid container spacing={3}>
      {/* display a list of all the businesses. each one should be clickable */}
      {restaurants.businesses.map((restaurant) => (
        <Grid
          item
          key={restaurant.id}
          xs={12}
          // this shows the user that it's clickable
          style={{ cursor: "pointer" }}
          // once user clicks it, it'll show it on the map
          onClick={() => setSelectedPlace(restaurant)}
        >
          {/* just some material ui components. Card, Grid, Typography are all material ui components. you can just look up the docs for them if you're interested, but
          1. Grid is just a way to position things on the screen
          2. Card gives a small outline
          3. Typography is a way to display text on the screen. in this case, we're displaying the restaurant's name, address and distance in km NOTE: this might not always be accurate because of location inaccuracy
          */}
          <Card variant="outlined">
            <Grid container>
              <Grid item xs={12}>
                <Typography>{restaurant.name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>{restaurant.location.address1}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  {(restaurant.distance / 1000).toFixed(2)} km away
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
