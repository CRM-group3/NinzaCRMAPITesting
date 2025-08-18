import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

test('Create lead via API and check on UI', async ({ page, request }) => {

  let campId;  
  let leadId; 
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  //const base_url = process.env.BASEURL;

  // --- Step 1: Create Campaign ---
  await test.step('Create campaign', async () => {
    const rawPayloadcampaign = JSON.parse(fs.readFileSync('test-data/leadrequests/campaignfieldsreq.json', 'utf-8'));
    rawPayloadcampaign.campaignName = "Diwali" + faker.person.firstName();

    const response = await request.post(`campaign`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      
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
    campId = responseBody.campaignId;
    console.log('✅ Created Campaign ID:', campId);
  });

  // --- Step 2: Create Lead ---
  await test.step('Create lead', async () => {
    const rawPayloadLead = JSON.parse(fs.readFileSync('test-data/leadrequests/mandatoryfieldsleftblank.json', 'utf-8'));
    rawPayloadLead.campaign.campaignId = campId;

    const leadResponse = await request.post(`${process.env.BASEURL}lead/?campaignId=${campId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.USERNAME}:${process.env.PASSWORD}`).toString('base64')}`,
      },
      data: rawPayloadLead
    });

    //const status = leadResponse.status()
    //const body = await leadResponse.text();

    expect(leadResponse.status()).toBe(201);
    const leadBody = await leadResponse.json();
    leadId = leadBody.leadId;
    console.log('✅ Created Lead ID:', leadId);
    console.log('✅ Created Lead ID:', leadBody);
  });

  // --- Step 3: Check lead on UI ---
  await test.step('Search lead on UI', async () => {
    await page.goto(process.env.BASEURL);
    await page.fill('#username', process.env.USERNAME);
    await page.fill('#inputPassword', process.env.PASSWORD);
    await page.click('//button[text()="Sign In"]');
    await expect(page).toHaveURL(process.env.DASHBOARDURL);

    await page.click('//a[text()="Leads"]');
   // await page.selectOption('select.form-control', 'leadId');
    //await page.fill('input[placeholder="Search by Lead Id"]', leadId);

    await page.waitForTimeout(5000);
    await page.waitForSelector('table.table tbody tr');
    const rows = page.locator('table.table tbody tr');
    const rowCount = await rows.count();
  console.log(`Total rows found after search: ${rowCount}`);

  let found = false;

  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);

    // Get Lead_Id from column 1
    const leadId1 = (await row.locator('td').nth(0).textContent())?.trim();

    if (leadId === leadId1) {
      found = true;
      console.log(`✅ Match found at row ${i + 1}`);

      // Extract all columns in this row
      const colCount = await row.locator('td').count();
      for (let j = 0; j < colCount; j++) {
        const cellText = (await row.locator('td').nth(j).textContent())?.trim();
        console.log(`Column ${j + 1}: ${cellText}`);
      }

      break; // stop after first match
    }
  }

  expect(found).toBeTruthy(); // fail test if not found
  });
});
