import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { config } from 'dotenv';
config();
import fs from 'fs';

test.describe('Lead API Tests', () => {
  let campid = '';
  let leadId;
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  const base_url = process.env.BASEURL;

  test.beforeAll(async ({ request }) => {
    
    const rawPayloadcampaign = JSON.parse(fs.readFileSync('test-data/leadrequests/campaignfieldsreq.json', 'utf-8'));
    rawPayloadcampaign.campaignName = "Diwali" + faker.person.firstName();

    const response = await request.post(`${base_url}campaign`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        //'Content-Type': 'application/json'
      },
      data: rawPayloadcampaign
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

    const rawPayload = JSON.parse(fs.readFileSync('test-data/leadrequests/mandatoryfieldsleftblank.json', 'utf-8'));
    rawPayload.campaign.campaignId = campid;

    console.log('📌 Using Campaign ID for lead:', campid);

    const response = await request.post(`${base_url}lead/?campaignId=${campid}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
       // 'Content-Type': 'application/json'
      },
       data: rawPayload
      
    });

    const status = response.status();
  const body = await response.text();

  console.log('📥 Response Status:', status);
  console.log('📥 Response Body:', body);

  if (status !== 201) {
    throw new Error(`❌ Expected 201 but got ${status}. Server response: ${body}`);
  }

  const responseBody = JSON.parse(body);
  console.log('✅ Created Lead ID:', responseBody.leadId);
  leadId = responseBody.leadId;
  });

  // test('check lead created on UI', async ({ page }) => {

  //   console.log('Searching for Lead ID:', leadId);
  //   await page.goto(base_url);
  //   await page.fill('#username', username); 
  //   await page.fill('#inputPassword', password);
  //   await page.click('//button[text()="Sign In"]');
  //   await expect(page).toHaveURL('http://49.249.28.218:8098/dashboard');
  //   await page.click('//a[text()="Leads"]');
  //   // //a[@href='/leads']
  //   await page.selectOption('select.form-control', 'leadId');
  //   await page.fill('input[placeholder="Search by Lead Id"]', leadId);
    
  //   //await page.click("//span[text()='Create Lead']")
  //   await page.waitForTimeout(5000);


  // });


});
