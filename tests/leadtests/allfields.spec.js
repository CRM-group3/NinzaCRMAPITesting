import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { config } from 'dotenv';
config();  // ⬅️ Loads .env variables
const rawLeadRequest = require('../../test-data/leadrequests/leadrequest1.json');

test.describe('Lead API Tests', () => {
  test('create lead', async ({ request }) => {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const campaignId = 'CAM05607';
    const endpoint = 'lead';
    const baseurl ='http://49.249.28.218:8098/';
    const url = `${baseurl}${endpoint}?campaignId=${campaignId}`;
    const basicAuthHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    const leadRequest = JSON.parse(JSON.stringify(rawLeadRequest));

    // ✅ Clean up leadId if present in template
    delete leadRequest.leadId;

    // 🎲 Fill with Faker
    leadRequest.address = "123,playstreet,Denver",
    leadRequest.annualRevenue = faker.number.int({ min: 50000, max: 500000 });
    leadRequest.assignedTo = faker.person.fullName();
    leadRequest.city = faker.location.city();
    leadRequest.company = faker.company.name();
    leadRequest.country = faker.location.country();
    leadRequest.description = faker.commerce.productDescription();
    leadRequest.email = faker.internet.email();
    leadRequest.industry = faker.commerce.department();
    leadRequest.leadSource = 'diwali sale';
    leadRequest.leadStatus = 'initial';
    leadRequest.name = faker.person.fullName();
    leadRequest.noOfEmployees = faker.number.int({ min: 5, max: 1000 });
    leadRequest.phone = '9123456789';
    leadRequest.postalCode = parseInt(faker.location.zipCode('#####'));
    leadRequest.rating = 'excellent';
    leadRequest.secondaryEmail = faker.internet.email();
    leadRequest.website = 'https://example.com';

    // ✅ Correct date format
    leadRequest.campaign = {
                  "campaignId": campaignId,
                  "campaignName": "Diwali Campaign",
                  "campaignStatus": "ongoing"
    };

    // 📋 Debug
    console.log('▶️ Request URL:', url);
    console.log('🔐 Basic Auth Token:', basicAuthHeader);
    console.log('📦 Request Body:', JSON.stringify(leadRequest, null, 2));

    const response = await request.post(url, {
      headers: {
        Authorization: basicAuthHeader,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: leadRequest,
    });

    const status = response.status();
    const responseText = await response.text();

    console.log('📥 Response Status:', status);
    console.log('📥 Response Body:', responseText);

    expect(status).toBe(201);

    const responseBody = JSON.parse(responseText);
    console.log('Created Lead ID:', responseBody.id);
  });
});
