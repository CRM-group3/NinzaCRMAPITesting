const { test, expect } = require("@playwright/test");
const config = require("../../test-data/contacts-json/config.json");

const CommonHelper = require("../../helperClasses/baseHelper");
const ContactHelper = require("../../helperClasses/contactsHelper");

const helper = new CommonHelper();
const contactHelper = new ContactHelper();

test.describe("GET /contact API", () => {
    
        let campaignId;
        let contactId;

        test.beforeAll(async ({ request }) => {
            // Create campaign
            const { body: campaignBody } = await contactHelper.createCampaign(request);
            campaignId = campaignBody.campaignId;
            console.log(" Created Campaign:", campaignId);
        
            // Create contact inside campaign
            const { response, payload } = await contactHelper.createContact(request, campaignId);
            expect(response.status()).toBe(201);
        
            const contactBody = await response.json();
            contactId = contactBody.contactId;
            console.log(" Created Contact:", contactId);
            console.log("***************************")
          });
  test("Retrieve contacts - Unauthorized access", async ({ request }) => {
    // Wrong / missing auth headers
    const response = await request.get(
      `${config.baseUrl}/contact/all`,
      {
        headers: helper.getUnauthorizedHeaders(),
         
      }
    );
    //Expect unauthorized
    expect(response.status()).toBe(401); // or 403 depending on API behavior
    console.log("***************************")
  });

  test("Retrieve count of contacts created", async ({ request }) => {
    const response = await request.get(
      `${config.baseUrl}/contact/count`,
      {
        headers: helper.getAuthHeaders(),//use from baseHelper
      }
    );

    //  Verify status
    expect(response.status()).toBe(200);

    // Verify count exists and is a number
    const data = await response.json();
    console.log("Contact count:", data);

    const count = data.count ?? data;
    expect(typeof count).toBe("number");
    console.log("***************************")

 });

  test('Retreive count of the contacts created with unauthorized access',async({request})=>{

    const response = await request.get(
        `${config.baseUrl}/contact/count`,
        {
            headers: helper.getUnauthorizedHeaders(),
        })       

        expect(response.status()).toBe(401);
        console.log("***************************")

  })

  test('Retreive all contacts',async({request})=>{
    const response = await request.get(
        `${config.baseUrl}/contact-all`,
        {
            headers:helper.getAuthHeaders()
        })
    expect(response.status()).toBe(200);
    console.log("***************************")
   
  })



  test('Retreive all contacts with unauthorized access',async({request})=>{
    const response = await request.get(
        `${config.baseUrl}/contact-all`,
        {
            headers:helper.getUnauthorizedHeaders(),
        })
    expect(response.status()).toBe(401);
  })
  console.log("***************************")
});
