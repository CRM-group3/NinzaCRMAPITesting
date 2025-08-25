const { test, expect } = require('@playwright/test');
const BaseHelper = require('../../helperClasses/baseHelper');
const baseHelper = new BaseHelper();

// ================== TC06 - Get All Vendors Paginated ==================
test('TC06 - Get All Vendors Paginated - Positive', async ({ request }) => {
  const response = await request.get('/all-vendors', {
    headers: baseHelper.getAuthHeaders(),
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  console.log('TC06 Response:', body);
});

// ================== TC07 - Get All Vendors No Pagination ==================
test('TC07 - Get All Vendors No Pagination - Positive', async ({ request }) => {
  const response = await request.get('/get-vendors-no-pagination', {
    headers: baseHelper.getAuthHeaders(),
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  console.log('TC07 Response:', body);
});

// ================== TC08 - Get Vendor Count ==================
test('TC08 - Get Vendor Count - Positive', async ({ request }) => {
  const response = await request.get('/count-vendors', {
    headers: baseHelper.getAuthHeaders(),
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  console.log('TC08 Response:', body);
});

// ================== TC15 - Invalid Endpoint Access GET ==================
test('TC15 - Invalid Endpoint Access GET - Negative', async ({ request }) => {
  const response = await request.get('/invalid-endpoint', {
    headers: baseHelper.getAuthHeaders(),
  });

  expect(response.status()).toBe(404); // or 405 based on your API
  console.log('TC15 Response:', await response.json());
});