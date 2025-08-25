const { test, expect } = require('@playwright/test');
const VendorPayload = require('../../helperClasses/vendorhelper');
const BaseHelper = require('../../helperClasses/baseHelper');

let vendorId; // variable to store created vendor ID
const baseHelper = new BaseHelper();

// ================== BEFORE ALL ==================
// Create a vendor to have a valid ID for deletion
test.beforeAll(async ({ request }) => {
  const payload = VendorPayload.createVendorPayload();

  const response = await request.post('/add-vendor', {
    data: payload,
    headers: baseHelper.getAuthHeaders()
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  vendorId = body.id || body.vendorId; // adjust based on your API response
  console.log('Created Vendor ID for deletion:', vendorId);
});

// ================== TC12 ==================
// Delete Vendor with valid ID (Positive)
test('TC12 - Delete Vendor Valid ID - Positive', async ({ request }) => {
  const response = await request.delete(`/delete-vendor/${vendorId}`, {
    headers: baseHelper.getAuthHeaders()
  });

  expect([200, 204]).toContain(response.status()); // API might return 200 or 204
  console.log('TC12 Response:', await response.text());
});

// ================== TC13 ==================
// Delete Vendor with invalid ID (Negative)
test('TC13 - Delete Vendor Invalid ID - Negative', async ({ request }) => {
  const invalidVendorId = 'invalid123'; // any non-existent ID

  const response = await request.delete(`/delete-vendor/${invalidVendorId}`, {
    headers: baseHelper.getAuthHeaders()
  });

  expect(response.status()).toBe(404); // API should return 404
  console.log('TC13 Response:', await response.text());
});