
//load test
import { test, expect } from '@playwright/test';


//write test

   test('create opportunity', async ({ request }) => {
    const postAPIResponse = await request.post('/opportunity?leadId=LEAD00001', {
        data: {
            opportunityName: "New",
            "business type": "Health care",
            closeDate: "2025-08-15",
            amount: 5000
        }
    });

    expect(postAPIResponse.status()).toBe(201);

    const postAPIResponseBody = await postAPIResponse.json();
    console.log(postAPIResponseBody);

    expect(postAPIResponseBody).toHaveProperty("opportunityId");
     expect(postAPIResponseBody.opportunityName ?? postAPIResponseBody.name).toBe("New");
    
});
