"use strict";

// TODO: Use https://github.com/nodeca/probe-image-size to get the best image. Don't just naively grab first one
// TODO: Add functionality to pass options to search like engines

const axios = require("axios");
const querystring = require("querystring");

module.exports = async (event, context) => {
  const query = querystring.escape(event.query.q);
  const url = `https://searx.mskog.com/?q=${query}&categories=images&language=en-US&format=json`;
  const response = await axios.get(url);
  const image = response.data.results[0].img_src;
  const result = { src: image };
  return context
    .status(200)
    .headers({ "Content-Type": "application/json" })
    .succeed(JSON.stringify(result));
};
