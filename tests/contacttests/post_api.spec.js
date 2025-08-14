const { test, expect } = require("@playwright/test")

test('create post api request',async({request})=>{

    const postApiResponse = await request.post('contact/?campaignId=CAM00327',{
        data:{
            
            
                "campaign": 
                  {"campaignId": "CAM00327",
                  "campaignName": "LegoAssocation",
                  "campaignStatus": "active",
                  "targetSize": 7,
                  "expectedCloseDate": "2025-08-16",
                  "targetAudience": "34",
                  "description": ""
                },
                "contactName": "Anil urs",
                "department": "dept",
                "email": "ani@example.com",
                "mobile": "9474236890",
                "officePhone": "0223654320",
                "organizationName": "depts",
                "title": "BA"
              }
});
        //status code validation
      //expect(postApiResponse.ok()).toBeTruthy();
   expect(postApiResponse.status()).toBe(201);
    const postApiResponseBody = await postApiResponse.json();
    console.log(postApiResponseBody);

    //validate json api response
    expect(postApiResponseBody).toHaveProperty("contactName", "Anil urs")
    expect(postApiResponseBody).toHaveProperty("organizationName", "dept")

})