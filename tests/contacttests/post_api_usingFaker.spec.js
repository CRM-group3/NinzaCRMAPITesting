const { test, expect } = require("@playwright/test")

import{ faker} from '@faker-js/faker'
const{DateTime}=require('luxon')

test('create post api request using faker(dynamic)request body',async({request})=>{

const contactName =  faker.person.fullName()
const department = faker.commerce.department()
const email = faker.internet.email()
const mobile=faker.phone.number()
const officePhone = faker.phone.number()
const organizationName=faker.company.name()
const title=faker.person.jobTitle()


    const postApiResponse = await request.post('contact/?campaignId=CAM00327',{
        data:{
            
            
                "campaign": 
                  {"campaignId": "CAM00327",
                  "campaignName": faker.company.name(),
                  "campaignStatus": "active",
                  "targetSize": faker.number.int({ min: 5, max: 100 }),
                  "expectedCloseDate": DateTime.now()
                  .plus({ days: faker.number.int({ min: 5, max: 30 }) })
                  .toISODate(),
                  "targetAudience": faker.number.int({ min: 10, max: 100 }).toString(),
                  "description": faker.lorem.sentence()
                },
                "contactName": contactName,
                "department": department,
                "email": email,
                "mobile": mobile,
                "officePhone": officePhone,
                "organizationName": organizationName,
                "title": title
              }
});
        //status code validation
      //expect(postApiResponse.ok()).toBeTruthy();
   expect(postApiResponse.status()).toBe(201);
    const postApiResponseBody = await postApiResponse.json();
    console.log(postApiResponseBody);

    //validate json api response
    expect(postApiResponseBody).toHaveProperty("contactName", contactName)
    expect(postApiResponseBody).toHaveProperty("organizationName", organizationName)

})