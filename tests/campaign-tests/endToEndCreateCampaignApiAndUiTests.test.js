import { test, expect } from '@playwright/test';
import {faker} from '@faker-js/faker';
import dotenv from 'dotenv';
dotenv.config();

const campaignData = require('../../test-data/campaignData/campaignrequest2.json');

test('Create Campaign via Api and Check in UI', async({ page, request }) => {
     
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const endpoint = 'campaign';

    // Step 1: create a Campaign via API
    await test.step('Create campaign', async() => {
    const response = await request.post(endpoint, {
        // headers: {
        //     Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,    
        // },
        headers: campaignData.headers,
        data: campaignData.postRequestBody
    });

    const status = response.status();
    const body = response.text();
    console.log('Response Status:', status);
    console.log('Response Body:', body);

    // Fail-fast logging
    if(status !== 201){
        throw new Error(`Expected 201 but got ${status}. Server response: ${body}`);
    }

    // expect(respons.status().toBe(201);
    const responseBody = await response.json();
    const campaignId = responseBody.campaignId;
    console.log('Created CampaignId:', campaignId);

});

    // ----step 2: Check Campaign on UI----
    await test.step('Search campaign on UI', async() => {
        await page.goto('process.env.BASEURL');
        await page.fill('#username', process.env.USERNAME);
        await page.fill('#inputPassword', process.env.PASSWORD);
        await page.click('//button[text()="Sign In"]');
     //   await expect(page).toHaveURL(process.env.DASHBOARD_URL);

     //   await page.click('//a[text()="Campaigns"]');

        await page.waitForTimeout(5000);
        await page.waitForSelector('table.table tbody tr');
        const rows = page.locator('table.table tbody tr');
        const rowCount = await rows.count();
        console.log(`Total rows found after search: ${rowCount}`);

        let found = false;

        for(let i = 0; i < rowCount; i++){
            const row = rows.nth(i);

            // Get Campaign_Id from column 1
            const campaign_Id = (await row.locator('td').nth(0)).textContent()?.trim();

            if(campaignId === campaign_Id){
                found = true;
                console.log(`Match found at row ${i+1}`);

            // Extract all columns in this row
            const colCount = await row.locator('td').count();
            for(let j = 0; j < colCount; j++) {
                const cellText = (await row.locator('td').nth(j).textContent())?.trim();
                console.log(`Column ${j + 1 }: ${cellText}`);
            }

            break;   // stop after first match

            }
        }

        expect(found).toBeTruthy();    // fail test if not found
    });

});
