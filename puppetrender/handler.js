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
    waitUntil: "domcontentloaded",
  });

  const content = await page.content();
  console.log(content);

  await browser.close();
  return context
    .status(200)
    .headers({ "Content-Type": "text/html" })
    .succeed(content);
};
