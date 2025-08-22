const { test, expect } = require('@playwright/test');
const VendorHelper = require('../../helperClasses/vendorhelper');
const BaseHelper = require('../../helperClasses/baseHelper');

const baseHelper = new BaseHelper();

let vendorId;

test.beforeAll(async ({ request }) => {
  const payload = VendorHelper.createVendorPayload();

  const response = await request.post('/add-vendor', {
    data: payload,
    headers: baseHelper.getAuthHeaders()
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  vendorId = body.id || body.vendorId;
  console.log(' Created Vendor ID for update test:', vendorId);
});

// --- TC09 Positive: Vendor with valid ID exists ---
test('TC09 - Update Vendor with Valid Data', async ({ request }) => {
  const updatePayload = VendorHelper.updateVendorPayload();

  const response = await request.put(`/vendor/${vendorId}`, {
    data: updatePayload,
    headers: baseHelper.getAuthHeaders()
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  console.log(' Updated Vendor Response:', body);

  // Verify some updated fields
  expect(body.email).toBe(updatePayload.email);
  expect(body.vendorName).toBe(updatePayload.vendorName);
});

// --- TC10 Negative: Non-existing vendor ID ---
test('TC10 - Update non-existing vendor (404)', async ({ request }) => {
  const nonExistingId = 'VID_' + Math.floor(Math.random() * 100000);

  const response = await request.put(`/vendor/${nonExistingId}`, {
    data: VendorHelper.updateVendorPayload(),
    headers: baseHelper.getAuthHeaders()
  });

  expect(response.status()).toBe(404);
});
// --- TC11 Negative: Invalid email ---
test('TC11 - Update vendor with invalid email format (422)', async ({ request }) => {
  const invalidPayload = VendorHelper.updateVendorPayload({
    email: "invalid-email"
  });

  const response = await request.put(`/vendor/${vendorId}`, {
    data: invalidPayload,
    headers: baseHelper.getAuthHeaders()
  });

  expect(response.status()).toBe(422);
});

