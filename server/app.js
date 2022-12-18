const express = require("express");
const axios = require("axios");
const path = require("path");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.use(express.json({ limit: "50mb" }));

app.use("/dist", express.static(path.join(__dirname, "../dist")));
app.use("/static", express.static(path.join(__dirname, "../static")));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../static/index.html"))
);

app.get("/api/restaurants/:name/:lat/:long", async (req, res, next) => {
  const { name, lat, long } = req.params;

  try {
    const options = {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
    };

    const url = `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${long}&term=${name}&sort_by=best_match&limit=20`;

    const { data } = await axios.get(url, options);

    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = app;
