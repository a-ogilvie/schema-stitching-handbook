const { makeExecutableSchema } = require('@graphql-tools/schema');
const NotFoundError = require('../../lib/not_found_error');
const readFileSync = require('../../lib/read_file_sync');
const typeDefs = readFileSync(__dirname, 'schema.graphql');

// data fixtures
const products = [
  { upc: '1', name: 'iPhone', price: 699.99, manufacturerId: '1' },
  { upc: '2', name: 'Apple Watch', price: 399.99, manufacturerId: '2' },
  { upc: '3', name: 'Super Baking Cookbook', price: 15.99, manufacturerId: '2' },
  { upc: '4', name: 'Best Selling Novel', price: 7.99, manufacturerId: '2' },
  { upc: '5', name: 'iOS Survival Guide', price: 24.99, manufacturerId: '1' },
  { upc: '6', name: 'Baseball Glove', price: 17.99, manufacturerId: '99' }, // << invalid manufacturer!
];

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: {
      product(root, { upc }) {
        return products.find(p => p.upc === upc) || new NotFoundError();
      },
      products(root, { upcs }) {
        return upcs.map(upc => products.find(p => p.upc === upc) || new NotFoundError());
      },
      _manufacturers(root, { ids }) {
        return ids.map(id => ({ id, products: products.filter(p => p.manufacturerId === id) }));
      }
    },
    Product: {
      manufacturer: (product) => ({ id: product.manufacturerId }),
    },
    Manufacturer: {
      products: (manufacturer) => products.filter(p => p.manufacturerId === manufacturer.id),
    }
  }
});
