"use strict";

const axios = require("axios");

module.exports = async (event, context) => {
  try {
    let result;

    const imdb = new Promise((resolve) => {
      axios(
        `https://faas.mskog.com/function/imdb-score?q=${event.query.q}`
      ).then((response) => {
        resolve({ imdb_audience: response.data.score });
      });
    });

    const metacritic = new Promise((resolve) => {
      axios(
        `https://faas.mskog.com/function/metacritic-score?q=${event.query.q}`
      ).then((response) => {
        resolve({
          metacritic_critics: response.data.critics_score,
          metacritic_audience: response.data.audience_score,
        });
      });
    });

    const rottenTomatoes = new Promise((resolve) => {
      axios(
        `https://faas.mskog.com/function/rottentomatoes-score?q=${event.query.q}`
      ).then((response) => {
        resolve({
          rottentomatoes_critics: response.data.critics_score,
          rottentomatoes_audience: response.data.audience_score,
        });
      });
    });

    await Promise.all([imdb, metacritic, rottenTomatoes]).then((values) => {
      values.forEach((value) => {
        result = { ...result, ...value };
      });
    });

    return context
      .status(200)
      .headers({ "Content-Type": "application/json" })
      .succeed(JSON.stringify(result));
  } catch (e) {
    return context
      .status(200)
      .headers({ "Content-Type": "application/json" })
      .succeed(JSON.stringify({}));
  }
};
