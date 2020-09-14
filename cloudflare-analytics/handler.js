"use strict";

const request = require("graphql-request");

module.exports = async (event, context) => {
  const { email, key, zone_id } = event.query;

  const client = new request.GraphQLClient(
    "https://api.cloudflare.com/client/v4/graphql",
    {
      headers: {
        "X-AUTH-EMAIL": email,
        "X-AUTH-KEY": key,
      },
    }
  );

  var d = new Date();
  d.setDate(d.getDate() - 2);
  const dateString = d.toISOString().substring(0, 10);

  const query = /* GraphQL */ `
    query {
      viewer {
        zones(filter: {zoneTag: "${zone_id}"}) {
          httpRequests1hGroups(limit: 50, filter: { date_gt: "${dateString}"}) {
            dimensions{
                datetime
            }
            uniq{
                uniques
            }
          }
        }
      }
    }
  `;

  const data = await client.rawRequest(query);

  return context
    .status(200)
    .headers({ "Content-Type": "application/json" })
    .succeed(JSON.stringify(data));
};
