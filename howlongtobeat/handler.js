"use strict";

const axios = require("axios");
const querystring = require("querystring");
const cheerio = require("cheerio");

module.exports = async (event, context) => {
  const query = querystring.escape(`site:howlongtobeat.com ${event.query.q}`);
  const input = `https://faas.mskog.com/function/firstresult?q=${query}`;
  const response = await axios.get(input);
  const { url } = response.data;

  const renderedPage = await axios.get(url);

  const $ = cheerio.load(renderedPage.data);

  const title = $(
    "#global_site > div.contain_out.back_blue > div.contain_in > div.profile_header_game > div.profile_header.shadow_text"
  )
    .first()
    .text()
    .replace(/[\t\r\n]/g, "");

  const hoursText = $(
    "#global_site > div:nth-child(2) > div > div.content_75_static > div.game_times > ul > li:nth-child(1) > div"
  )
    .first()
    .text();

  return context
    .status(200)
    .headers({ "Content-Type": "application/json" })
    .succeed(JSON.stringify({ url, title, length: parseInt(hoursText, 10) }));
};
