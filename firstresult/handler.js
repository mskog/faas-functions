"use strict";

const axios = require("axios");
const querystring = require("querystring");

module.exports = async (event, context) => {
  const query = querystring.escape(event.query.q);
  const input = `https://searx.mskog.com/?q=${query}&language=en-US&format=json`;
  const response = await axios.get(input);
  const { url, title } = response.data.results[0];
  const result = { url, title };
  return context
    .status(200)
    .headers({ "Content-Type": "application/json" })
    .succeed(JSON.stringify(result));
};
