"use strict";

const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (event, context) => {
  try {
    const result = await axios(
      `https://faas.mskog.com/function/firstresult?q=${event.query.q} site:imdb.com`
    );

    const url = result.data.url;

    const response = await axios(url);
    const $ = cheerio.load(response.data);
    const score = $("span[itemprop='ratingValue']").first().text();

    return context
      .status(200)
      .headers({ "Content-Type": "application/json" })
      .succeed(
        JSON.stringify({
          score: parseFloat(score) * 10,
          url,
        })
      );
  } catch (e) {
    return context
      .status(200)
      .headers({ "Content-Type": "application/json" })
      .succeed(JSON.stringify({ score: null, url: null }));
  }
};
