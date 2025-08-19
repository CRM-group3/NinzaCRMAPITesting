import { test, expect } from '@playwright/test';

const campaignData = require('../../test-data/campaignData/campaignrequest1.json');
const campaignData2 = require('../../test-data/campaignData/campaignrequest2.json');
//const campaignSchema = require('../../schemas/createCampaignSchema.json');

/*import Ajv from "ajv";
import addFormats from "ajv-formats";
import campaignSchema from "../../schemas/createCampaignSchema.json"

const ajv = new Ajv({ allErrors : true });
addFormats(ajv);    // <-- this enables "date", "date-time", "email", etc.  */


test.describe('Create Campaign API Tests', async (request) => {

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

        expect(postApiResponseBody.campaignId).toBeTruthy();
        expect(postApiResponseBody.campaignName).toBe(campaignData.mendatoryFieldsCampaign.campaignName);
        expect(postApiResponseBody.targetSize).toBe(campaignData.mendatoryFieldsCampaign.targetSize);

        // const schema = z.object({
        //     campaignId: z.string(),
        //     campaignName: z.string(),
        //     targetSize: z.int()

        // });

        // expect(() => {
        //     schema.parse(postResponseBody);
        // }).not.toThrow();

    });



    test.only('Create a Campaign with all fields', async ({ request }) => {

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
        
     //   const data = await postApiResponse.json();
     //   const validate = ajv.compile(campaignSchema);
     //   const valid = validate(data);

      //  expect(valid, JSON.stringify(validate.errors, null, 2)).toBe(true);

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



});