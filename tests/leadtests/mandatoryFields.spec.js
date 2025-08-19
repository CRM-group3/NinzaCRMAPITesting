import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { config } from 'dotenv';
config();

test.describe('Lead API Tests', () => {
  let campid = '';

  test.beforeAll(async ({ request }) => {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const base_url = process.env.BASEURL;

    const response = await request.post(`${base_url}campaign`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        //'Content-Type': 'application/json'
      },
      data: {   
        "campaignName": "Diwali" + faker.person.firstName(),
        "campaignStatus": "ongoing",
        "description": "Diwali festival campaign",
        "expectedCloseDate": "2023-11-12",
        "targetAudience": "General Public",
        "targetSize": 10000
      }
    });

    const status = response.status();
    const body = await response.text();
  
    console.log('📥 Response Status:', status);
    console.log('📥 Response Body:', body);
  
    // ✅ Fail-fast logging
    if (status !== 201) {
      throw new Error(`❌ Expected 201 but got ${status}. Server response: ${body}`);
    }
  

    //expect(response.status()).toBe(201);
    const responseBody = await response.json();
    campid = responseBody.campaignId;
    console.log('✅ Created Campaign ID:', campid);
  });

  test('create lead', async ({ request }) => {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const base_url = process.env.BASEURL;

    console.log('📌 Using Campaign ID for lead:', campid);

    const response = await request.post(`${base_url}lead/?campaignId=${campid}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
       // 'Content-Type': 'application/json'
      },
      data: {   
        "address": "123,playstreet,Denver",
        "annualRevenue": 100000,
        "assignedTo": "mkt lead",
        "campaign": {
          "campaignId": campid, // already string, no need .toString()
          "campaignName": "Diwali Campaign",
          "campaignStatus": "ongoing"
        },
        "name": "oxo grips",
        "company": "abc corp",
        "leadSource": "diwali sale",
        "industry": "Manufacturing",
        "phone": "9123456789",
        "leadStatus": "initial"
      }
    });

    const status = response.status();
  const body = await response.text();

  console.log('📥 Response Status:', status);
  console.log('📥 Response Body:', body);

  if (status !== 201) {
    throw new Error(`❌ Expected 201 but got ${status}. Server response: ${body}`);
  }

  const responseBody = JSON.parse(body);
  console.log('✅ Created Lead ID:', responseBody.id);
  });
});
