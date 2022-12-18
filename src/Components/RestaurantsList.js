import React from "react";

import { Grid, Card, Typography } from "@mui/material";

export const RestaurantsList = ({ restaurants, findOnMap }) => {
  return (
    <Grid container spacing={3} style={{ width: "50%" }}>
      {restaurants.businesses.map((restaurant) => (
        <Grid
          item
          key={restaurant.id}
          xs={12}
          style={{ cursor: "pointer" }}
          onClick={() => findOnMap(restaurant)}
        >
          <Card variant="outlined">
            <Grid container>
              <Grid item xs={12}>
                <Typography>{restaurant.name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>{restaurant.location.address}</Typography>
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
