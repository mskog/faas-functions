"use strict";

const puppeteer = require("puppeteer");

module.exports = async (event, context) => {
  const { email, password } = event.query;

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

  await page.goto("https://www.myfitnesspal.com/account/login", {
    waitUntil: "networkidle2",
  });

  await page.type("#username", email);
  await page.type("#password", password);
  await page.keyboard.press("Enter");
  await page.waitForNavigation();

  await page.goto("https://www.myfitnesspal.com/food/diary/", {
    waitUntil: "networkidle2",
  });
  await page.waitFor(2000);

  const frame = page
    .frames()
    .find((frame) => frame.url().startsWith("https://consent"));

  await frame.click("a.call");
  await page.waitFor(2000);

  await page.click("a.prev");
  await page.waitFor(2000);

  await page.addScriptTag({
    url: "https://code.jquery.com/jquery-3.3.1.slim.min.js",
  });

  const data = await page.evaluate(() => {
    const caloriesTotal = $(
      "tr.total:eq(0) > td:nth-child(2)"
    )[0].innerHTML.replace(",", "");
    const caloriesGoal = $(
      "tr.total:eq(1) > td:nth-child(2)"
    )[0].innerHTML.replace(",", "");
    const carbsTotal = $(
      "tr.total:eq(0) > td:nth-child(3) > span:first-child"
    )[0].innerHTML.replace(",", "");
    const carbsGoal = $(
      "tr.total:eq(1) > td:nth-child(3) > span:first-child"
    )[0].innerHTML.replace(",", "");
    const fatTotal = $(
      "tr.total:eq(0) > td:nth-child(4) > span:first-child"
    )[0].innerHTML.replace(",", "");
    const fatGoal = $(
      "tr.total:eq(1) > td:nth-child(4) > span:first-child"
    )[0].innerHTML.replace(",", "");
    const proteinTotal = $(
      "tr.total:eq(0) > td:nth-child(5) > span:first-child"
    )[0].innerHTML.replace(",", "");
    const proteinGoal = $(
      "tr.total:eq(1) > td:nth-child(5) > span:first-child"
    )[0].innerHTML.replace(",", "");
    const sodiumTotal = $(
      "tr.total:eq(0) > td:nth-child(6)"
    )[0].innerHTML.replace(",", "");
    const sodiumGoal = $(
      "tr.total:eq(1) > td:nth-child(6)"
    )[0].innerHTML.replace(",", "");
    const sugarTotal = $(
      "tr.total:eq(0) > td:nth-child(7)"
    )[0].innerHTML.replace(",", "");
    const sugarGoal = $(
      "tr.total:eq(1) > td:nth-child(7)"
    )[0].innerHTML.replace(",", "");

    return {
      caloriesTotal,
      caloriesGoal,
      carbsTotal,
      carbsGoal,
      fatTotal,
      fatGoal,
      proteinTotal,
      proteinGoal,
      sodiumTotal,
      sodiumGoal,
      sugarTotal,
      sugarGoal,
    };
  });
  console.log(data);

  const content = await page.content();

  await browser.close();
  return context
    .status(200)
    .headers({ "Content-Type": "application/json" })
    .succeed(JSON.stringify(data));
};
