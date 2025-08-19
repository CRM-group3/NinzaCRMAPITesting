const { test, expect } = require("@playwright/test");

const config = require("../../test-data/contacts-json/config.json");
const ContactHelper = require("../../helperClasses/contactsHelper");
const CommonHelper = require("../../helperClasses/baseHelper");


const contactHelper = new ContactHelper();

  test.describe("PUT /contact API", () => {
    test("Update contact with Invalid Contact ID", async ({ request }) => {
      const { response: campaignResponse } = await contactHelper.createCampaign(request);
      expect(campaignResponse.status()).toBe(201);

      const campaign = await campaignResponse.json();
      const campaignId = campaign.campaignId;
      expect(campaignId).toBeTruthy();

      const invalidContactId = "invalid-contact-id"; // deliberately wrong
  
      const { response } = await contactHelper.updateContact(request,campaignId,invalidContactId, {
        contactName: "Updated Invalid Contact",
      });
  
        expect(response.status()).toBe(404); // usually Not Found
        console.log("***************************")
    });

     test("Update existing contact's department name", async ({ request }) => {
        //create campaign
        const { response: campaignResponse } = await contactHelper.createCampaign(request);
        expect(campaignResponse.status()).toBe(201);

        const campaign = await campaignResponse.json();
        const campaignId = campaign.campaignId;
        expect(campaignId).toBeTruthy();

        const { response: createResponse } = await contactHelper.createContact(request,campaignId);
        expect(createResponse.status()).toBe(201);
        
        const createdContact = await createResponse.json();
        const contactId = createdContact.contactId;
        expect(contactId).toBeTruthy();
      
        // Step 2: Update only the department field
        const newDepartment = "Updated QA Department";
        const { response: updateResponse } = await contactHelper.updateContact(request, campaignId, contactId, {
          department: newDepartment,
        });
      
        expect(updateResponse.status()).toBe(200);
      
        // Step 3: Verify the update
        const updatedContact = await updateResponse.json();
        expect(updatedContact.department).toBe(newDepartment);
      });
      console.log("***************************")
    });