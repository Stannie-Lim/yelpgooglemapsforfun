/**
 * IGNORE THIS FILE IT'S JUST WEBPACK CONFIG SETUP
 */
const Dotenv = require("dotenv-webpack");

module.exports = {
  devtool: "source-map",
  plugins: [new Dotenv()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
};
