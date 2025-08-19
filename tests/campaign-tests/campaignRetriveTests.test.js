import { test, expect } from '@playwright/test';

const campaignData = require('../../test-data/campaignData/campaigngetrequest.json');



test.describe('Get Campaign API Tests', async (request) => {

    test('Get all the campaigns count', async ({ request }) => {

        const getApiResponse = await request.get(`campaign/count`, {
            headers: campaignData.headers
        });

        expect(getApiResponse.ok()).toBeTruthy();
        expect(getApiResponse.status()).toBe(campaignData.expectedStatusCode);

        const getApiResponseBody = await getApiResponse.json();
        console.log(getApiResponseBody);

    });



    test('Get all the campaigns non-pageable', async ({ request }) => {

        const getApiResponse = await request.get(`campaign/all-campaigns`, {
            headers: campaignData.headers
        });

        expect(getApiResponse.ok()).toBeTruthy();
        expect(getApiResponse.status()).toBe(campaignData.expectedStatusCode);

        const getApiResponseBody = await getApiResponse.json();
        console.log(getApiResponseBody);

    });



    test('Get all the campaigns', async ({ request }) => {

        const getApiResponse = await request.get(`campaign/all`, {
            headers: campaignData.headers
        });

        expect(getApiResponse.ok()).toBeTruthy();
        expect(getApiResponse.status()).toBe(campaignData.expectedStatusCode);

        const getApiResponseBody = await getApiResponse.json();
        console.log(getApiResponseBody);

    });


    test('Get all the campaigns with invalid HttpMethod', async ({ request }) => {

        const getApiResponse = await request.post(`campaign/all`, {
            headers: campaignData.headers
        });

        expect(getApiResponse.ok()).toBeFalsy();
        expect(getApiResponse.status()).toBe(campaignData.expecStatusCode);

        const getApiResponseBody = await getApiResponse.json();
        console.log(getApiResponseBody);
        expect(getApiResponseBody.message).toBe(campaignData.expecResponse.message);

    });



    test('Get all the campaigns with invalid credentials', async ({ request }) => {

        const getApiResponse = await request.get(`campaign/all`, {
            headers : campaignData.invalidHeaders
        });

      //  expect(getApiResponse.status()).toBe(campaignData.expStatusCode);
      expect(getApiResponse.status(), `Expected statusCode ${campaignData.expStatusCode} but got ${getApiResponse.status()}`).toBe(campaignData.expStatusCode);

        const getApiResponseBody = await getApiResponse.json();
        console.log(getApiResponseBody);

    });



});