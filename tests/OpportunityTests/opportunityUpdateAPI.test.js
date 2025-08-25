import { test , expect } from '@playwright/test';

test('update existing opportunity' , async({ request })=>
{
    const opportunityId="OPP00016";
    const putResponse=await request.put('/opportunity?opportunityId=OPP00016&leadId=LEAD00001',
    {
        data :
        {
            "name":"New Deal",
            "business type":"Health care",
            "closeDate":"2025-08-15",
            "amount":6000

        },
    });

    expect(putResponse.status()).toBe(200);

    const responseBody= await putResponse.json();
    console.log("Updated opportunity " , responseBody);
    expect(responseBody).toHaveProperty("opportunityId", opportunityId);
    //expect(responseBody.opportunityName).toBe("New Deal");
    //expect(responseBody.businessType).toBe("Health care");
    //expect(responseBody.expectedCloseDate).toBe("2025-08-15");
    expect(responseBody.amount).toBe("6000");

})