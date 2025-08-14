import { test, expect } from '@playwright/test'

//import { leadrequest1} from '../test-data/leadrequests';
//import {post_allfields_req} from '../test-data/contactsdata';

const contactAPIRequestBody = require('../../test-data/contactsdata/post_allfields_req.json')

test('create post api request using JSON file',async({request})=>{

    const postApiResponse = await request.post('contact/?campaignId=CAM00327',{
        data:contactAPIRequestBody
    
      });

        //status code validation
      //expect(postApiResponse.ok()).toBeTruthy();
   expect(postApiResponse.status()).toBe(201);
    const postApiResponseBody = await postApiResponse.json();
    console.log(postApiResponseBody);

    //validate json api response
    expect(postApiResponseBody).toHaveProperty("contactName", "Anila Gode")
    expect(postApiResponseBody).toHaveProperty("organizationName", "department")

})