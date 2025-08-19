const { test, expect } = require("@playwright/test");
const CommonHelper = require("../../helperClasses/baseHelper");
const ContactHelper = require("../../helperClasses/contactsHelper");
const config = require("../../test-data/contacts-json/config.json");

const helper = new CommonHelper();
const contactHelper = new ContactHelper();

  test.describe("DELETE /contact API", () => {
    test("Delete contact with Unauthorized access", async ({ request }) => {
      //vreate campaign
      const { response: campRes, body: campBody } = await contactHelper.createCampaign(request);
        expect(campRes.status()).toBe(201);
        const campaignId = campBody.campaignId;
        
        //create contact
        const { response: createRes, payload } = await contactHelper.createContact(request, campaignId);
        expect(createRes.status()).toBe(201);
        const createdContact = await createRes.json();

        expect(createdContact.contactName).toBe(payload.contactName);

        const contactId = createdContact.contactId;
        const response = await request.delete(
        `${config.baseUrl}/contact?contactId=${contactId}`,
        {
          headers: helper.getUnauthorizedHeaders(),// Wrong/ missing auth headers
          },
        
      );
      //Expect unauthorized
      expect(response.status()).toBe(401); // or 403 depending on API behavior
      console.log("***************************")
    });

    
    test("Delete contact with given contactID", async ({ request }) => {
         // 1. Create a new campaign
        const { response: campRes, body: campBody } = await contactHelper.createCampaign(request);
        expect(campRes.status()).toBe(201);
        const campaignId = campBody.campaignId;
        
        // 1. Create a new contact
        const { response: createRes, payload } = await contactHelper.createContact(request, campaignId);
     
        expect(createRes.status()).toBe(201);
        const createdContact = await createRes.json();

        expect(createdContact.contactName).toBe(payload.contactName);

        const contactId = createdContact.contactId;

        //const contactId = createdContact.contactId;  // extract generated ID
        console.log("Created Contact ID:", contactId);
      
        // 2. Delete the same contact
        const deleteResponse = await request.delete(
          `${config.baseUrl}/contact?contactId=${contactId}`,
          {
            headers: helper.getAuthHeaders()
          }
        );
      
        expect(deleteResponse.status()).toBe(204); // API should return 204 on successful delete
        console.log("***************************")
      });
})