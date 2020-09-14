"use strict";

const puppeteer = require("puppeteer");

module.exports = async (event, context) => {
  const url = event.query.url;

  const browser = await puppeteer.launch({
    args: [
      "--headless",
      "--no-sandbox",
      "--disable-gpu",
      "--single-process",
      "--no-zygote",
    ],
  });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle2",
  });

  const largestImage = await page.evaluate(() => {
    return [...document.getElementsByTagName("img")].sort(
      (a, b) =>
        b.naturalWidth * b.naturalHeight - a.naturalWidth * a.naturalHeight
    )[0].src;
  });

  await browser.close();
  return context
    .status(200)
    .headers({ "Content-Type": "application/json" })
    .succeed({ largestImage });
};
