const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const { queryDB } = require('../../helperClasses/dbHelper');
const config = require('../../test-data/contacts-json/config.json');
const ContactHelper = require('../../helperClasses/contactsHelper');
const BaseHelper = require('../../helperClasses/baseHelper');

const helper = new BaseHelper();
const contactHelper = new ContactHelper();

test('Full E2E: Create contact (API + UI + DB)', async ({ request, page }) => {
  // --- Step 0: Custom Auth Header (without touching BaseHelper) ---
  const customAuthHeaders = {
    Authorization: `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}`,
    'Content-Type': 'application/json'
  };

  console.log("🔑 Sending Auth header:", customAuthHeaders);

  // Step 1: Create campaign
const campaignPayload = {
  campaignId: faker.string.alphanumeric(8).toUpperCase(),
  campaignName: faker.company.name(),
  campaignStatus: "active",
  targetSize: 100,
  expectedCloseDate: "2025-12-31",
  targetAudience: "500",
  description: "E2E test campaign"
};

const campaignRes = await request.post(`${config.baseUrl}/campaign`, {
  headers: customAuthHeaders,
  data: campaignPayload
});

expect(campaignRes.status()).toBe(201);
const createdCampaign = await campaignRes.json();
console.log('✅ Campaign created:', createdCampaign.campaignId);

// Step 2: Create contact using the campaignId
const contactPayload = {
  contactName: faker.person.fullName(),
  organizationName: faker.company.name(),
  email: faker.internet.email(),
  mobile: faker.phone.number('##########'),
  title: faker.person.jobTitle()
};

const contactRes = await request.post(
  `${config.baseUrl}/contact/?campaignId=${createdCampaign.campaignId}`, // ← use the created campaign ID
  {
    headers: customAuthHeaders,
    data: contactPayload
  }
);

expect(contactRes.status()).toBe(201);
const createdContact = await contactRes.json();
console.log('✅ Contact created for campaign:', createdCampaign.campaignId);

// --- Step 3: UI Verification ---
  await page.goto(config.baseUrl);
  await page.fill('#username', config.username);
  await page.fill('input[name="password"]', config.password);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  await page.click('a[href="/contacts"]');
  await expect(page.getByText(contactPayload.contactName)).toBeVisible({ timeout: 10000 });
  console.log('✅ Contact verified in UI');

// --- Step 4: DB Verification ---
const dbConfig = {
  host: config.dbHost,
  port: config.dbPort,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName
};

const rows = await queryDB(dbConfig, `
  SELECT contact_name, mobile, title, email
  FROM contacts
  WHERE contact_name = ?
`, [contactPayload.contactName]);

expect(rows.length).toBeGreaterThan(0);
expect(rows[0]).toMatchObject({
  contact_name: contactPayload.contactName,
  mobile: contactPayload.mobile,
  title: contactPayload.title,
  email: contactPayload.email
});

console.log('✅ Contact verified in DB:', rows[0]);
})
