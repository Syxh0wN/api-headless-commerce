import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 10 },
    { duration: '2m', target: 20 },
    { duration: '5m', target: 20 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
    errors: ['rate<0.1'],
  },
};

export function setup() {
  const registerResponse = http.post(`${API_BASE}/auth/register`, JSON.stringify({
    email: `loadtest_${Date.now()}@example.com`,
    name: 'Load Test User',
    password: 'password123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  if (registerResponse.status === 201) {
    return registerResponse.json('accessToken');
  }

  const loginResponse = http.post(`${API_BASE}/auth/login`, JSON.stringify({
    email: 'loadtest@example.com',
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
    name: `Load Test Product ${Math.random()}`,
    slug: `load-test-product-${Math.random()}`,
    sku: `LOAD-${Math.random()}`,
    price: Math.floor(Math.random() * 10000) + 1000,
    description: 'Load test product description',
    categoryId: null,
    isActive: true,
    tags: ['load-test'],
  };

  const createProductResponse = http.post(`${API_BASE}/products`, JSON.stringify(productData), { headers });
  
  check(createProductResponse, {
    'product creation status is 201': (r) => r.status === 201,
    'product creation response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  if (createProductResponse.status === 201) {
    const product = createProductResponse.json();
    
    const getProductResponse = http.get(`${API_BASE}/products/${product.id}`, { headers });
    
    check(getProductResponse, {
      'product retrieval status is 200': (r) => r.status === 200,
      'product retrieval response time < 200ms': (r) => r.timings.duration < 200,
    }) || errorRate.add(1);

    const addToCartResponse = http.post(`${API_BASE}/cart/add`, JSON.stringify({
      productId: product.id,
      quantity: Math.floor(Math.random() * 5) + 1,
    }), { headers });
    
    check(addToCartResponse, {
      'add to cart status is 201': (r) => r.status === 201,
      'add to cart response time < 300ms': (r) => r.timings.duration < 300,
    }) || errorRate.add(1);

    const getCartResponse = http.get(`${API_BASE}/cart`, { headers });
    
    check(getCartResponse, {
      'get cart status is 200': (r) => r.status === 200,
      'get cart response time < 200ms': (r) => r.timings.duration < 200,
    }) || errorRate.add(1);
  }

  const getProductsResponse = http.get(`${API_BASE}/products`, { headers });
  
  check(getProductsResponse, {
    'get products status is 200': (r) => r.status === 200,
    'get products response time < 300ms': (r) => r.timings.duration < 300,
  }) || errorRate.add(1);

  sleep(1);
}

export function teardown(data) {
  console.log('Load test completed');
}
