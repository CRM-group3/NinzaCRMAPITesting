import { test, expect } from '@playwright/test';

const campaignData = require('../../test-data/campaignData/campaignrequest1.json');
const campaignData2 = require('../../test-data/campaignData/campaignrequest2.json');
const { validateSchema } = require('../../helperClasses/schemaValidator');
const campaignSchema = require('../../schemas/createCampaignSchema.js');
const campaign2Schema = require('../../schemas/createCampaign2Schema.js');

const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

//test.describe('Create Campaign API Tests', async (request) => {

    test('Create a Campaign with mendatory fields', async ({ request }) => {

        const postApiResponse = await request.post(`campaign`, {

            headers: campaignData.headers,
            data: campaignData.mendatoryFieldsCampaign
        });

        // Validate status code
     //   expect(postApiResponse.ok()).toBeTruthy();
        expect(postApiResponse.status()).toBe(201);

        const postApiResponseBody = await postApiResponse.json();
        console.log(postApiResponseBody);

        console.log("*************");
        console.log(typeof response.body, postApiResponse.body);
        
        expect(postApiResponseBody.campaignId).toBeTruthy();
        expect(postApiResponseBody.campaignName).toBe(campaignData.mendatoryFieldsCampaign.campaignName);
        expect(postApiResponseBody.targetSize).toBe(campaignData.mendatoryFieldsCampaign.targetSize);

        expect(validateSchema(campaign2Schema)).toBe(true);

    });



    test('Create a Campaign with all fields', async ({ request }) => {

        const postApiResponse = await request.post(`campaign`, {

            headers: campaignData.headers,
            data: campaignData.allFieldsCampaign

        });

        // Validate status code
    //    expect(postApiResponse.ok()).toBeTruthy();
        expect(postApiResponse.status()).toBe(201);

        const postApiResponseBody = await postApiResponse.json();
        console.log(postApiResponseBody);

        expect(postApiResponseBody.campaignId).toBeTruthy();
        expect(postApiResponseBody.campaignName).toBe(campaignData.allFieldsCampaign.campaignName);
        
      //   expect(validateSchema(campaignSchema)).toBe(true);

    });



    test('Create a Campaign with invalid Credentials', async ({ request }) => {

        const postApiResponse = await request.post(`campaign`, {

            headers: campaignData2.headers,
            data: campaignData2.campaignBody
        });
        // Validate status code
        //   expect(postApiResponse.unauthorize()).toBeTruthy();
        //   expect(postApiResponse.status()).toBe(401);

        expect(postApiResponse.status(), `Expected status ${campaignData2.expectedStatus} but got ${postApiResponse.status()}`).toBe(campaignData2.expectedStatus);
        const postApiResponseBody = await postApiResponse.json();
        console.log(postApiResponseBody);

    });


    test('Create a Campaign with all fields empty', async ({ request }) => {

        const postApiResponse = await request.post(`campaign`, {

            headers: campaignData.headers
        });

        // Validate status code
        expect(postApiResponse.status(), `Expected status ${campaignData.expectedStatus} but got ${postApiResponse.status()}`).toBe(campaignData.expectedStatus);

        const postApiResponseBody = await postApiResponse.json();
        console.log(postApiResponseBody);
        //   expect(postApiResponseBody.message, `Expected error message "${campaignData.expectedResponse.message}" but got "${postApiResponseBody.message}"`).toBe(campaignData.expectedResponse.message);
        expect(postApiResponseBody.message).toBe(campaignData.expectedResponse.message);

    });



    test('Create a Campaign with invalid request body', async ({ request }) => {

        const postApiResponse = await request.post('campaign', {
            headers: campaignData.headers,
            data: campaignData.invalidValuesRequestBody

        });

        // Validate Status Code
        expect(postApiResponse.status(), `Expected status ${campaignData.expStatus} but got ${postApiResponse.status()}`).toBe(campaignData.expStatus);
        const postApiResponseBody = await postApiResponse.json();
        console.log(postApiResponseBody);

    });


    test('Create a Campaign with invalid HttpMethod', async ({ request }) => {

        const postApiResponse = await request.get('campaign', {
            headers: campaignData.headers,
            data: campaignData.allFieldsCampaign

        });

        // Validate Status Code
        expect(postApiResponse.status(), `Expected status ${campaignData.expecStatus} but got ${postApiResponse.status()}`).toBe(campaignData.expecStatus);

        const postApiResponseBody = await postApiResponse.json();
        console.log(postApiResponseBody);
        // expect(postApiResponseBody.message, `Expected error message "${campaignData.expecResponse.message}" but got "${postApiResponseBody.message}"`).toBe(campaignData.expectedResponse.message);
        expect(postApiResponseBody.message).toBe(campaignData.expecResponse.message);

    });


    test('Create a Campaign with existing Campaign name', async ({ request }) => {

        const postApiResponse = await request.post(`campaign`, {

            headers: campaignData.headers,
            data: campaignData.allFieldsCampaign

        });
        // Validate status code
        expect(postApiResponse.status(), `Expected status ${campaignData.exStatus} but got ${postApiResponse.status()}`).toBe(campaignData.exStatus);

        const postApiResponseBody = await postApiResponse.json();
        console.log(postApiResponseBody);

    });


    test('Create a Campaign with negative values in TargetSize field', async ({ request }) => {

        const postApiResponse = await request.post(`campaign`, {

            headers: campaignData.headers,
            data: campaignData2.negativeTargetSizeBody

        });
        // Validate status code
        expect(postApiResponse.status(), `Expected status ${campaignData2.expecStatus} but got ${postApiResponse.status()}`).toBe(campaignData2.expecStatus);
        //   expect(postApiResponse.headers.contentType).toBe(campaignData.headers.contentType);
        const postApiResponseBody = await postApiResponse.json();
        console.log(postApiResponseBody);

    });



    test('Create a Campaign with invalid Date format', async ({ request }) => {

        const postApiResponse = await request.post(`campaign`, {

            headers: campaignData.headers,
            data: campaignData2.invalidDateFormatBody

        });
        // Validate status code
        expect(postApiResponse.status(), `Expected status ${campaignData2.expecStatus} but got ${postApiResponse.status()}`).toBe(campaignData2.expecStatus);
        //   expect(postApiResponse.headers.contentType).toBe(campaignData.headers.contentType);
        const postApiResponseBody = await postApiResponse.json();
        console.log(postApiResponseBody);

    });



//});