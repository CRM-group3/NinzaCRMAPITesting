const { test, expect } = require('@playwright/test');
const VendorPayload = require('../../helperClasses/vendorhelper');
const BaseHelper = require('../../helperClasses/baseHelper');
import dotenv from 'dotenv';
dotenv.config();

const baseHelper = new BaseHelper();
let payload;
let vendorName;
// Before each test, create a fresh vendor payload
test.beforeEach(() => {
  payload = VendorPayload.createVendorPayload();
   vendorName = payload.vendorName;
});

// test('TC - Create Vendor Valid Data - Positive', async ({ request }) => {
//   const response = await request.post('/add-vendor', {
//     data: payload,
//     headers: baseHelper.getAuthHeaders()
//   });

//   expect(response.status()).toBe(201);
//   console.log('TC01 Response:', await response.json());
// });
//=================== E2E Test with .env ==================
test('E2E - Create Vendor via API, Login and Validate in UI', async ({ page, request }) => {
  // --- Step 1: Create Vendor via API ---
  const response = await request.post('/add-vendor', {
    data: payload,
    headers: baseHelper.getAuthHeaders()
  });
  expect(response.status()).toBe(201);
  console.log('Vendor created via API:', await response.json());
// //=================== Step 2: Login and Validate in UI ==================
//   // Use BASE_URL from .env
//   await page.goto(process.env.VENDORURL);

//   // Fill credentials from .env
//   await page.locator("//input[@id='username']").fill(process.env.VUSERNAME);
//   await page.locator("//input[@id='inputPassword']").fill(process.env.VPASSWORD);

//   // Click login
//   await page.locator("//button[@type='submit']").click();

//   // Wait for dashboard
//   await page.waitForURL(process.env.VENDORDASHBOARDURL);
//   await page.locator("//a[text()='Vendors']").click();
//   await page.waitForURL('**/vendors');

//   // Search vendor using XPath
//   await page.locator("//div[@class='col-sm-5']//input[@class='form-control']").fill(vendorName);
//   await page.waitForTimeout(2000);

//   // Validate vendor in UI table
//   const nameInUI = await page.locator(`//td[contains(text(),'${vendorName}')`).first().innerText();
//   expect(nameInUI).toBe(vendorName);
//   console.log(" Vendor found in UI:", nameInUI);
   // Validate in DB
  const rows = await VendorPayload.getVendorByName(vendorName);
  expect(rows.length).toBeGreaterThan(0);
  expect(rows[0].vendor_name).toBe(vendorName);

  console.log('✅ Vendor found in DB:', rows[0]);
});
