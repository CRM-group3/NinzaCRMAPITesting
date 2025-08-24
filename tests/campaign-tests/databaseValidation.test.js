import { faker } from '@faker-js/faker';
import { test, expect } from '@playwright/test';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';
dotenv.config();


const campaignData = require('../../test-data/campaignData/campaignrequest1.json');
const dataBase = require('../../helperClasses/databaseUtility');


test('Create Campaign and Validate in DataBase', async ({ request }) => {

    const newCampaign = {

        campaignName: faker.company.name(),
        campaignStatus: "active",
        targetSize: faker.number.int({ min: 1, max: 10000 }),
        expectedCloseDate: DateTime.now().plus({ days: 15 }).toISODate(),
        targetAudience: faker.number.int({ min: 50, max: 1000 }).toString(),
        description: faker.lorem.sentence()

    };

    // step 1. Create campaign via API
    console.log('Faker Campaign data:', newCampaign);
    const response = await request.post('campaign', {
        headers: campaignData.headers,
        data: newCampaign
    });

    console.log(response);
    expect((await response).status()).toBe(201);
    expect(await response.ok()).toBeTruthy();

    const responseBody = await response.json();
    const campaignId = responseBody.campaignId;
    console.log('Created campaignId:', campaignId);


    //step 2: Query DB for the campaignId
    const [rows] = await dataBase.query(
     //   'SELECT * FROM campaign WHERE campaign_id = ?', [campaignId]
         'SELECT * FROM campaign WHERE campaign_name = ?',[newCampaign.campaignName]
    );

    // Validate DB entry exists-----
    expect(rows.length).toBe(1); // record exists
    console.log('DB Row:', rows[0]);


    // Extra validation: compare fields
    expect(rows[0].campaign_name).toBe(newCampaign.campaignName);
    expect(rows[0].campaign_status).toBe(newCampaign.campaignStatus);
    expect(rows[0].target_size).toBe(newCampaign.targetSize);

    console.log('campaignName', newCampaign.campaignName);
    console.log('targetSize', newCampaign.targetSize);
    console.log('status', newCampaign.campaignStatus);

    // ---close connection---
    await dataBase.end();

});
