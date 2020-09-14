"use strict";

const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (event, context) => {
  try {
    const result = await axios(
      `https://faas.mskog.com/function/firstresult?q=${event.query.q} site:metacritic.com`
    );

    const url = result.data.url;

    const response = await axios(url);
    const $ = cheerio.load(response.data);
    const criticsScore = $(".movie.larger.metascore_w").first().text();
    const audienceScore = $(".movie.user.metascore_w").first().text();

    return context
      .status(200)
      .headers({ "Content-Type": "application/json" })
      .succeed(
        JSON.stringify({
          critics_score: parseInt(criticsScore),
          audience_score: parseFloat(audienceScore) * 10,
          url,
        })
      );
  } catch (e) {
    return context
      .status(200)
      .headers({ "Content-Type": "application/json" })
      .succeed(
        JSON.stringify({ critics_score: null, audience_score: null, url: null })
      );
  }
};
