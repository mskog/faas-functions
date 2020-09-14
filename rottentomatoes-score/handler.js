"use strict";

const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (event, context) => {
  try {
    const result = await axios(
      `https://faas.mskog.com/function/firstresult?q=${event.query.q} site:rottentomatoes.com`
    );

    const url = result.data.url;

    const response = await axios(
      `https://faas.mskog.com/function/puppetrender/?url=${url}`
    );
    const $ = cheerio.load(response.data);
    const criticsScore = $(
      "#tomato_meter_link > span.mop-ratings-wrap__percentage"
    )
      .first()
      .text()
      .trim();

    const audienceScore = $(".audience-score")
      .find(".mop-ratings-wrap__percentage")
      .first()
      .text()
      .trim();
    return context
      .status(200)
      .headers({ "Content-Type": "application/json" })
      .succeed(
        JSON.stringify({
          critics_score: parseInt(
            criticsScore.substring(0, criticsScore.length - 1),
            10
          ),
          audience_score: parseInt(
            audienceScore.substring(0, audienceScore.length - 1),
            10
          ),
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
