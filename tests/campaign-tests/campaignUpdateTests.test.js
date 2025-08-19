import { test, expect } from '@playwright/test';

const campaignData = require('../../test-data/campaignData/campaignputrequest.json');

test.describe('Update Campaign Api Tests', async () => {

    test.only("Update a Campaign record", async ({ request }) => {

        const endpoint = "campaign"

        const postApiResponse = await request.post(endpoint, {
            headers: campaignData.headers,
            data: campaignData.createdCampaignBody
        });

        console.log(postApiResponse);
        expect(postApiResponse.ok()).toBeTruthy();
        expect(postApiResponse.status()).toBe(campaignData.expecStatusCode);

        const postApiResponseBody = await postApiResponse.json();
        console.log(postApiResponseBody);

        const campaignId = postApiResponseBody.campaignId;
        console.log(campaignId);

        console.log("****************");


        // const campaignId = CAM06430;

         const putApiResponse = await request.put(`campaign?campaignId=${campaignId}`, {
             headers: campaignData.headers,
             data: campaignData.updatedCampaignBody
        });

        // expect(putApiResponse.ok()).toBeTruthy();
         expect(putApiResponse.status()).toBe(campaignData.expectedStatusCode);

         const putApiResponseBody = await putApiResponse.json();
         console.log(putApiResponseBody);

         expect(putApiResponseBody.campaignStatus).toBe(campaignData.updatedCampaignBody.campaignStatus);
     //    expect(putApiResponseBody.targetSize).toBe(campaignData.updatedCampaignBody.targetSize);
         expect(putApiResponseBody.expectedCloseDate).toBe(campaignData.updatedCampaignBody.expectedCloseDate);
         expect(putApiResponseBody.targetAudience).toBe(campaignData.updatedCampaignBody.targetAudience);
         expect(putApiResponseBody.description).toBe(campaignData.updatedCampaignBody.description);

     });

});