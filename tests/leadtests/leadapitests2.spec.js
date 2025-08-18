import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { config } from 'dotenv';
config();

const rawLeadRequest = require('../../test-data/leadrequests/leadrequest1.json');

test.describe('Lead API Debug Test', () => {
  test('find problematic field', async ({ request }) => {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const campaignId = 'CAM05607';
    const endpoint = 'lead';
    const base_url = process.env.BASEURL;
    const url = `${base_url}${endpoint}?campaignid=${campaignId}`;
    const basicAuthHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    // Start with known minimal working request (adjust as per API docs)
    let leadRequest = {
      name: 'Test Lead',
      email: 'test@example.com',
      phone: '9123456789',
      company: 'Test Company'
    };

    // Fields to test incrementally
    const extraFields = {
     address: "123,playstreet,Denver",
     annualRevenue: faker.number.int({ min: 50000, max: 500000 }),
      assignedTo: faker.person.fullName(),
      city: faker.location.city(),
      country: faker.location.country(),
      description: faker.commerce.productDescription(),
      industry: faker.commerce.department(),
      leadSource: 'diwali sale',
      leadStatus: 'initial',
      noOfEmployees: faker.number.int({ min: 5, max: 1000 }),
      postalCode: faker.location.zipCode('#####'), // keep as string for now
      rating: 'excellent',
      secondaryEmail: faker.internet.email(),
      website: 'https://example.com',
      campaign: {
        campaignId: String(campaignId),
        campaignName: faker.commerce.productName(),
        campaignStatus: 'ongoing',
        description: faker.commerce.productDescription(),
        expectedCloseDate: faker.date.future().toISOString().split('T')[0],
        targetAudience: faker.person.jobTitle(),
        targetSize: faker.number.int({ min: 1000, max: 100000 }),
      }
    };

    // Try adding each field one at a time
    for (const [field, value] of Object.entries(extraFields)) {
      leadRequest[field] = value;

      console.log(`\n🧪 Testing with field: ${field}`);
      console.log(JSON.stringify(leadRequest, null, 2));

      const response = await request.post(url, {
        headers: {
          Authorization: basicAuthHeader,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        json: leadRequest,
      });

      console.log(`📥 Status: ${response.status()}`);
      const bodyText = await response.text();
      console.log(`📥 Body: ${bodyText}`);

      if (response.status() === 500) {
        throw new Error(`❌ 500 error caused by field: ${field}`)
      }
    }

    expect(true).toBe(true); // If we reached here, no field caused 500
  });
});