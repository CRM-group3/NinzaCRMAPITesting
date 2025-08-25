import { test , expect } from '@playwright/test';

test('create opportunity without name' , async( { request })=>
{
    const postAPIResponseWithoutname = await request.post('/opportunity?leadId=LEAD00001' ,
        {
            data : 
            {
              
            "business type": "Health care",
            closeDate: "2025-08-15",
            amount: 5000
            }
        });

        expect(postAPIResponseWithoutname.status()).toBe(400);

        const postResponse=await postAPIResponseWithoutname.json();
        console.log(postResponse);
     
})