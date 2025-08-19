import { test, expect} from '@playwright/test';


test.describe('Campaign API Tests', async (request)=>{

    test('Create a Campaign with mendatory fields', async ({ request }) => {

        const postApiResponse = await request.post(`/campaign`, {
             data : {
                    "campaignName": "SaveWater",
                    "targetSize": 100
                    },
            Headers : {
                "username" : "rmgyantra",
                "password" : "rmgy@9999"

            }

            })
            // Validate status code
            expect(postApiResponse.ok()).toBeTruthy();
            expect(postApiResponse.status()).toBe(201);

            const postApiResponseBody = await postApiResponse.json();
            console.log(postApiResponseBody);
    });



test('Create a Campaign with all fields', async ({ request }) => {

        const postApiResponse = await request.post(`/campaign`, {
             data : {
                    "campaignName": "SaveAir",
                    "campaignStatus": "Active",
                    "targetSize": 200,
                    "expectedCloseDate": "08/25/2025",
                    "targetAudience": "general",
                    "description": "ATRRSYTTDUU"
                    },
            Headers : {
                "username" : "rmgyantra",
                "password" : "rmgy@9999"

            }

            })
            // Validate status code
            expect(postApiResponse.ok()).toBeTruthy();
            expect(postApiResponse.status()).toBe(201);

            const postApiResponseBody = await postApiResponse.json();
            console.log(postApiResponseBody);
    });


test('Create a Campaign with invalid Credentials', async ({ request }) => {

        const postApiResponse = await request.post(`/campaign`, {
             data : {
                    "campaignName": "SaveChild",
                    "campaignStatus": "Planned",
                    "targetSize": 150,
                    "expectedCloseDate": "08/25/2025",
                    "targetAudience": "general",
                    "description": "og;herolhj;j;"
                    },
            Headers : {
                "username" : "rmgyantr",
                "password" : "rmgy@999"

            }

            })
            // Validate status code
         //   expect(postApiResponse.unauthorize()).toBeTruthy();
            expect(postApiResponse.status()).toBe(401);

            const postApiResponseBody = await postApiResponse.json();
            console.log(postApiResponseBody);
    });

})