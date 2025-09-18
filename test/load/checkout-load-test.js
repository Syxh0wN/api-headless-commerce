import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 5 },
    { duration: '3m', target: 5 },
    { duration: '1m', target: 10 },
    { duration: '3m', target: 10 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
    errors: ['rate<0.05'],
  },
};

export function setup() {
  const registerResponse = http.post(`${API_BASE}/auth/register`, JSON.stringify({
    email: `checkout_test_${Date.now()}@example.com`,
    name: 'Checkout Test User',
    password: 'password123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  if (registerResponse.status === 201) {
    return registerResponse.json('accessToken');
  }

  const loginResponse = http.post(`${API_BASE}/auth/login`, JSON.stringify({
    email: 'checkouttest@example.com',
    password: 'password123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  return loginResponse.json('accessToken');
}

export default function (data) {
  const token = data;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const productData = {
    name: `Checkout Test Product ${Math.random()}`,
    slug: `checkout-test-product-${Math.random()}`,
    sku: `CHECKOUT-${Math.random()}`,
    price: Math.floor(Math.random() * 5000) + 1000,
    description: 'Checkout test product description',
    categoryId: null,
    isActive: true,
    tags: ['checkout-test'],
  };

  const createProductResponse = http.post(`${API_BASE}/products`, JSON.stringify(productData), { headers });
  
  check(createProductResponse, {
    'product creation status is 201': (r) => r.status === 201,
  }) || errorRate.add(1);

  if (createProductResponse.status === 201) {
    const product = createProductResponse.json();
    
    const addToCartResponse = http.post(`${API_BASE}/cart/add`, JSON.stringify({
      productId: product.id,
      quantity: Math.floor(Math.random() * 3) + 1,
    }), { headers });
    
    check(addToCartResponse, {
      'add to cart status is 201': (r) => r.status === 201,
    }) || errorRate.add(1);

    if (addToCartResponse.status === 201) {
      const cart = addToCartResponse.json();
      
      const checkoutData = {
        cartId: cart.id,
        shippingAddress: {
          street: 'Rua Teste, 123',
          complement: 'Apto 45',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          country: 'Brasil',
        },
        paymentMethod: 'CREDIT_CARD',
        notes: 'Load test order',
      };

      const checkoutResponse = http.post(`${API_BASE}/checkout/orders`, JSON.stringify(checkoutData), { headers });
      
      check(checkoutResponse, {
        'checkout status is 201': (r) => r.status === 201,
        'checkout response time < 1000ms': (r) => r.timings.duration < 1000,
        'order number is generated': (r) => r.json('orderNumber') !== undefined,
      }) || errorRate.add(1);

      if (checkoutResponse.status === 201) {
        const order = checkoutResponse.json();
        
        const getOrderResponse = http.get(`${API_BASE}/checkout/orders/${order.id}`, { headers });
        
        check(getOrderResponse, {
          'get order status is 200': (r) => r.status === 200,
          'get order response time < 300ms': (r) => r.timings.duration < 300,
        }) || errorRate.add(1);

        const getOrdersResponse = http.get(`${API_BASE}/checkout/orders`, { headers });
        
        check(getOrdersResponse, {
          'get orders status is 200': (r) => r.status === 200,
          'get orders response time < 500ms': (r) => r.timings.duration < 500,
        }) || errorRate.add(1);
      }
    }
  }

  sleep(2);
}

export function teardown(data) {
  console.log('Checkout load test completed');
}
