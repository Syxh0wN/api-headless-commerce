const hooks = require('hooks');

hooks.afterAll((transactions) => {
  console.log('Contract tests completed!');
});

hooks.afterEach((transaction) => {
  if (transaction.real.statusCode >= 400) {
    console.log(`Error in ${transaction.name}: ${transaction.real.statusCode}`);
    console.log(`Response: ${transaction.real.body}`);
  }
});

hooks.after('Products > Create product > Create new product', (transaction) => {
  if (transaction.real.statusCode === 201) {
    console.log('Product created successfully');
  }
});

hooks.after('Cart > Add to cart > Add item to cart', (transaction) => {
  if (transaction.real.statusCode === 201) {
    console.log('Item added to cart successfully');
  }
});

hooks.after('Checkout > Create order > Create new order', (transaction) => {
  if (transaction.real.statusCode === 201) {
    console.log('Order created successfully');
  }
});

hooks.after('Webhooks > Create webhook > Create new webhook', (transaction) => {
  if (transaction.real.statusCode === 201) {
    console.log('Webhook created successfully');
  }
});
