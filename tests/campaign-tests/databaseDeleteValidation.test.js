import { faker } from '@faker-js/faker';
import { test, expect } from '@playwright/test';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';
dotenv.config();

const campaignData = require('../../test-data/campaignData/campaignrequest1.json');
const dataBase = require('../../helperClasses/databaseUtility');


test('Create Campaign and Validate in DataBase', async ({ request }) => {
   
    // step 1. Create campaign via API
    const createdCampaign = {
         
        campaignName: faker.company.name(),
        campaignStatus: "active",
        targetSize: faker.number.int({ min: 1, max: 10000 }),
        expectedCloseDate: DateTime.now().plus({ days: 15 }).toISODate(),
        targetAudience: faker.number.int({ min: 50, max: 1000 }).toString(),
        description: faker.lorem.sentence()
    }

        console.log('Faker Campaign data:', createdCampaign);

        const response = await request.post('campaign', {
            headers: campaignData.headers,
            data: createdCampaign
        });

        console.log(response.status());
        expect(response.status()).toBe(201);
        expect(response.ok()).toBeTruthy();

        const responseBody = await response.json();
        let campaignId = responseBody.campaignId;
        console.log('Created campaignId:', campaignId);

    
        // step 2. connect to MYSQL DB ---

        // Step 3. Query DB for the Campaign
        const [rows] = await dataBase.query(
            'SELECT * FROM campaign WHERE campaign_name = ?', [createdCampaign.campaignName]
        );

        expect(rows.length).toBeGreaterThan(0);

        //Step 4. Validate DataBase entry exists ---
        
        expect(rows[0].campaign_status).toBe(createdCampaign.campaignStatus);
        expect(rows[0].target_size).toBe(createdCampaign.targetSize);

        console.log('DataBase Row:', rows[0]);
        console.log('Compare Faker vs DataBase:');
        console.log('CampaignName:', createdCampaign.campaignName, '== DataBase:', rows[0].campaign_name);
        console.log('targetSize:', createdCampaign.targetSize,'==DataBase:', rows[0].target_size);

        campaignId = rows[0].campaign_id;
        console.log('campaignId to delete in DataBase test', campaignId);

        // Step 5. delete campaign using campaignId

            const deleteResponse = await request.delete(`campaign?campaignId=${campaignId}`, {
                headers: campaignData.headers
            });

            console.log(deleteResponse.status());
            console.log(await deleteResponse.text());

            expect(deleteResponse.status()).toBe(204);   // or depending on the API Design


    });

