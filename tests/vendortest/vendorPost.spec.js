const { test, expect } = require('@playwright/test');
const VendorPayload = require('../../helperClasses/vendorhelper');
const BaseHelper = require('../../helperClasses/baseHelper');

const baseHelper = new BaseHelper();
let payload;

// Before each test, create a fresh vendor payload
test.beforeEach(() => {
  payload = VendorPayload.createVendorPayload();
});

// ================== TC01 ==================
test('TC01 - Create Vendor Valid Data - Positive', async ({ request }) => {
  const response = await request.post('/add-vendor', {
    data: payload,
    headers: baseHelper.getAuthHeaders()
  });

  expect(response.status()).toBe(201);
  console.log('TC01 Response:', await response.json());
});

// ================== TC02 ==================
test('TC02 - Create Vendor Missing vendorName - Negative', async ({ request }) => {
  const invalidPayload = { ...payload };
  delete invalidPayload.vendorName;

  const response = await request.post('/add-vendor', {
    data: invalidPayload,
    headers: baseHelper.getAuthHeaders()
  });

  expect(response.status()).toBe(400);
  console.log('TC02 Response:', await response.json());
});

// ================== TC03 ==================
test('TC03 - Create Vendor Missing email - Negative', async ({ request }) => {
  const invalidPayload = { ...payload };
  delete invalidPayload.email;

  const response = await request.post('/add-vendor', {
    data: invalidPayload,
    headers: baseHelper.getAuthHeaders()
  });

  expect(response.status()).toBe(400);
  console.log('TC03 Response:', await response.json());
});

// ================== TC04 ==================
test('TC04 - Create Vendor Duplicate Email - Negative', async ({ request }) => {
  // First create a vendor
  await request.post('/add-vendor', { data: payload, headers: baseHelper.getAuthHeaders() });

  // Try creating with same email again
  const duplicateResponse = await request.post('/add-vendor', { data: payload, headers: baseHelper.getAuthHeaders() });
  expect(duplicateResponse.status()).toBe(409);
  console.log('TC04 Response:', await duplicateResponse.json());
});

// ================== TC05 ==================
test('TC05 - Create Vendor via /vendors - Positive', async ({ request }) => {
  const response = await request.post('/vendors', {
    data: payload,
    headers: { 
  ...baseHelper.getAuthHeaders(), 
  'Content-Type': 'application/json' 
}
  });

  expect(response.status()).toBe(201);
  console.log('TC05 Response:', await response.json());
});

// ================== TC14 ==================
test('TC14 - Unauthorized Access Create - Negative', async ({ playwright }) => {
  const requestContext = await playwright.request.newContext({
    baseURL: 'http://localhost:3000', // change to your base URL
    extraHTTPHeaders: baseHelper.getUnauthorizedHeaders()
  });

  const response = await requestContext.post('/add-vendor', { data: payload });
  expect(response.status()).toBe(401);
  console.log('TC14 Response:', await response.json());
});

// ================== TC16 ==================
test('TC16 - Invalid Endpoint Access post - Negative', async ({ request }) => {
  const response = await request.post('/invalid-endpoint', { data: payload, headers: baseHelper.getAuthHeaders() });
  expect(response.status()).toBe(405);
  console.log('TC16 Response:', await response.json());
});