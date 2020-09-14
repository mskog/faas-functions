"use strict";

//TODO: Extract body?

const metascraper = require("metascraper")([
  require("metascraper-author")(),
  require("metascraper-date")(),
  require("metascraper-description")(),
  require("metascraper-image")(),
  require("metascraper-logo")(),
  require("metascraper-clearbit")(),
  require("metascraper-publisher")(),
  require("metascraper-title")(),
  require("metascraper-url")(),
]);

const got = require("got");

module.exports = async (event, context) => {
  const targetUrl = event.query.url;

  try {
    const { body: html, url } = await got(targetUrl, { timeout: 5000 });
    const metadata = await metascraper({ html, url });
    return context
      .status(200)
      .headers({ "Content-Type": "application/json" })
      .succeed(JSON.stringify(metadata));
  } catch (e) {
    return context
      .status(422)
      .headers({ "Content-Type": "application/json" })
      .fail(JSON.stringify({ error: "Unprocessable entity" }));
  }
};
