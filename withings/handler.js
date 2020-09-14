"use strict";

const puppeteer = require("puppeteer");

module.exports = async (event, context) => {
  const { email, password, id } = event.query;

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

  await page.goto("https://account.withings.com/connectionwou/account_login", {
    waitUntil: "networkidle2",
  });

  await page.type("input[name='email']", email);
  await page.type("input[name='password']", password);
  await page.keyboard.press("Enter");
  await page.waitForNavigation();

  await page.goto(`https://healthmate.withings.com/${id}/weight/list`, {
    waitUntil: "networkidle2",
  });
  await page.waitFor(2000);

  const data = await page.evaluate(() => {
    const weight = document
      .querySelector("ul.measures > li > div:nth-child(1) > div:nth-child(2)")
      .innerHTML.match(/\d+.\d+/)[0];

    const fat_mass = document
      .querySelector("ul.measures > li > div:nth-child(2) > div:nth-child(2)")
      .innerHTML.match(/\d+.\d+/)[0];

    const bmi = document
      .querySelector("ul.measures > li > div:nth-child(4) > div:nth-child(2)")
      .innerHTML.match(/\d+.\d+/)[0];

    return { weight, fat_mass, bmi };
  });

  await browser.close();
  return context
    .status(200)
    .headers({ "Content-Type": "application/json" })
    .succeed(JSON.stringify(data));
};
