"use strict";

const got = require("got");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

//TODO: Allow arbitrary text?
module.exports = async (event, context) => {
  const targetUrl = event.query.url;
  const readabilityUrl = `https://faas.mskog.com/function/readability?url=${targetUrl}`;

  const { body: json, url } = await got(readabilityUrl, { timeout: 5000 });

  const sentimentResult = sentiment.analyze(JSON.parse(json)["text"]);

  const result = {
    score: sentimentResult.score,
    comparative: sentimentResult.comparative,
  };

  return context.status(200).succeed(result);
};
