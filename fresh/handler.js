"use strict";

const puppeteer = require("puppeteer");
const querystring = require("querystring");

module.exports = async (event, context) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto("https://www.rottentomatoes.com/browse/cf-in-theaters/", {
    waitUntil: "networkidle2",
  });

  // Wait for the results to show up
  await page.waitForSelector("h3.movieTitle");

  // Extract the results from the page
  const movies = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll("h3.movieTitle"));
    return anchors.map((anchor) => {
      return anchor.textContent.split("(")[0].trim();
    });
  });
  await browser.close();
  return context
    .status(200)
    .headers({ "Content-Type": "application/json" })
    .succeed(movies);
};
