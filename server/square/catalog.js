const client = require("./utils/square-client");
const CatalogItem = require("./models/catalog-item");
const CatalogList = require("./models/catalog-list");

// Fetch catalog objects with optional type filter
async function fetchCatalogObjects(types = []) {
  const {
    result: { objects },
  } = await client.catalogApi.listCatalog();

  return types.length > 0
    ? objects.filter(({ type }) => types.includes(type.toUpperCase()))
    : objects;
}

// Fetch catalog items and images with optional category filter
async function fetchCatalogItemsAndImages(categoryNames = []) {

  let categoryIds = [];
  if (!!categoryNames && categoryNames.length > 0) {
    categoryIds = await convertCategoryNamesToIDs(categoryNames);
  }

  const {
    result: { items = [] },
  } = await client.catalogApi.searchCatalogItems({ categoryIds });

  const itemDetailResponses = await Promise.all(
    items.map(({ id }) => client.catalogApi.retrieveCatalogObject(id, true))
  );

  const catalogObjects = itemDetailResponses.reduce(
    (acc, { result }) => [...acc, result.object, ...result.relatedObjects],
    []
  );

  return new CatalogList(catalogObjects).items.map(
    (item) => new CatalogItem(item)
  );
}

// Convert category names to category IDs
async function convertCategoryNamesToIDs(categoryNames) {
  const categories = await fetchCatalogObjects(["CATEGORY"]);
  return categories
    .filter(({ categoryData }) => categoryNames.includes(categoryData.name))
    .map(({ id }) => id);
}

module.exports = {
  fetchCatalogObjects,
  fetchCatalogItemsAndImages,
};
