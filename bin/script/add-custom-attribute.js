const { Client, Environment } = require("square");
const customAttributeData = require("./sample-custom-attribute-data.json");
require('dotenv').config();

// Configure OAuth2 access token for authorization: oauth2
const config = {
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN
};

const { catalogApi } = new Client(config);

// iterate through each custom attribute in the sample data
for (let attributeKey in customAttributeData) {
  const attribute = customAttributeData[attributeKey];
  
  // Here we create a unique idempotency key for each attribute. This could also be imported from the JSON if needed.
  const idempotencyKey = `${attributeKey}-${Date.now()}`;
  
  catalogApi.upsertCatalogObject({
    idempotencyKey: idempotencyKey,
    object: attribute
  }).then(response => {
    console.log(`Upserted attribute: ${attributeKey}`);
    console.log(response.result);
  }).catch(error => {
    console.error(`Error upserting attribute: ${attributeKey}`);
    console.error(error);
  });
}
