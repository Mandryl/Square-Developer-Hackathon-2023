const client = require("./utils/square-client");
const LocationInfo = require("./models/location-info");

// Fetch the first location from the list of locations
async function fetchFirstLocation() {
  const { result: {locations} } = await client.locationsApi.listLocations();
  return new LocationInfo(locations[0]);
}

module.exports = {
  fetchFirstLocation,
};
