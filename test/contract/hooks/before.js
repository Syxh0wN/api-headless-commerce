const hooks = require('hooks');

let authToken = '';

hooks.beforeAll((transactions) => {
  console.log('Starting contract tests...');
});

hooks.before('Auth > Register > Register user', (transaction) => {
  transaction.request.headers['Content-Type'] = 'application/json';
});

hooks.before('Auth > Login > Login user', (transaction) => {
  transaction.request.headers['Content-Type'] = 'application/json';
});

hooks.after('Auth > Register > Register user', (transaction) => {
  if (transaction.real.statusCode === 201) {
    const response = JSON.parse(transaction.real.body);
    authToken = response.accessToken;
    console.log('Auth token obtained:', authToken.substring(0, 20) + '...');
  }
});

hooks.after('Auth > Login > Login user', (transaction) => {
  if (transaction.real.statusCode === 201) {
    const response = JSON.parse(transaction.real.body);
    authToken = response.accessToken;
    console.log('Auth token obtained:', authToken.substring(0, 20) + '...');
  }
});

hooks.beforeEach((transaction) => {
  if (transaction.request.uri.includes('/products') || 
      transaction.request.uri.includes('/cart') || 
      transaction.request.uri.includes('/checkout') ||
      transaction.request.uri.includes('/webhooks')) {
    if (authToken) {
      transaction.request.headers['Authorization'] = `Bearer ${authToken}`;
    }
  }
});

hooks.before('Products > Create product > Create new product', (transaction) => {
  transaction.request.headers['Content-Type'] = 'application/json';
});

hooks.before('Cart > Add to cart > Add item to cart', (transaction) => {
  transaction.request.headers['Content-Type'] = 'application/json';
});

hooks.before('Checkout > Create order > Create new order', (transaction) => {
  transaction.request.headers['Content-Type'] = 'application/json';
});

hooks.before('Webhooks > Create webhook > Create new webhook', (transaction) => {
  transaction.request.headers['Content-Type'] = 'application/json';
});
