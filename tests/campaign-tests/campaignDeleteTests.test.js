import { test, expect } from '@playwright/test'

const campaignData = require('../../test-data/campaignData/campaigndeleterequest.json')


//test.describe('Delete Campaign APi Test', async({ request }) => {

    test('Delete a campaign record', async({ request }) => {

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

        const deleteApiResponse = await request.delete(`campaign?campaignId=${campaignId}`,{
            headers : campaignData.headers
            
        });

        console.log(deleteApiResponse);
        expect(deleteApiResponse.status()).toBe(campaignData.expectedStatusCode);

      //  const deleteApiResponseBody = await deleteApiResponse.json();
     //   console.log(deleteApiResponseBody);


    });

//});