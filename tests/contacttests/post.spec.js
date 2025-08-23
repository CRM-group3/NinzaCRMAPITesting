const { test, expect } = require("@playwright/test");
//const config = require("../../test-data/contacts-json/config.json");
const ContactHelper = require("../../helperClasses/contactsHelper");
const CommonHelper = require("../../helperClasses/baseHelper")
const { validateSchema } = require('../../helperClasses/schemaValidator');
const contactSchema = require('../contacttests/contactsSchema');

const helper = new CommonHelper();
const contactHelper = new ContactHelper();

const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

let campaignId;
let savedContactData;

//Runs once before all tests.
//Creates an initial contact & saves contactName + mobile for the duplicate contact test.
test.describe("POST /contact API", () => {
  test.beforeAll(async ({ request }) => {
    const { body } = await contactHelper.createCampaign(request);
    campaignId = body.campaignId; // save campaignId for all contact tests
    expect(campaignId).toBeDefined();
    
    // 🔹 Create initial contact
    const { response, payload } = await contactHelper.createContact(request, campaignId);
    expect(response.status()).toBe(201);
    savedContactData = {
      contactName: payload.contactName,
      mobile: payload.mobile,
    
    };
    console.log("***************************")
  });

  //Sends a full payload.
  test("Create contact with all fields", async ({ request }) => {
    const { response, payload } = await contactHelper.createContact(request, campaignId);
    // console.log(payload)

     expect(response.status()).toBe(201);
     const body = await response.json();

     expect(validateSchema(contactSchema, body)).toBe(true);

     // 🔹 Automatic schema validation
     //expect(validateSchema(body)).toBe(true);

    expect(body).toHaveProperty("contactName", payload.contactName);
    expect(body).toHaveProperty("organizationName", payload.organizationName);
    //expect(body).toHaveProperty("mobileno",payload.mobile);
    console.log("***************************")
  });

  

  //Overrides some fields with undefined so they’re excluded.
//Tests if the API still works with only required fields.
  test("Create contact with mandatory fields only", async ({ request }) => {
    const { response, payload } = await contactHelper.createContact(request, campaignId, {
      department: undefined,
      officePhone: undefined,
    });
    expect(response.status()).toBe(201);
    const body = await response.json();

    // 🔹 Automatic schema validation
    //expect(validateSchema(body)).toBe(true);


    expect(body).toHaveProperty("contactName", payload.contactName);
    expect(body).toHaveProperty("organizationName", payload.organizationName);
    console.log("***************************")
  });

  

  //Sends same contactName and mobile as the one created in beforeAll.
  test("Create duplicate contact (same name & mobile)", async ({ request }) => {
    if (!savedContactData) throw new Error("No saved contact data from previous test");

    const { response } = await contactHelper.createContact(request, campaignId,{
      contactName: savedContactData.contactName,
      mobile: savedContactData.mobile,
    });

    // Depending on API, duplicate may fail with 400/409
    expect(response.status()).toBe(409);
    console.log("***************************")
  });

  

  test('Create contact with contact name missing',async({request})=>{
    const { response, payload } = await contactHelper.createContact(request, campaignId, {
    contactName: undefined
    })

    expect(response.status()).toBe(400);
    console.log("***************************")
})



test('Create contact with organization name missing',async({request})=>{

    
            const { response, payload} = await contactHelper.createContact(request, campaignId,
            {
                organizationName: undefined
             },
              
            );
            
            expect(response.status()).toBe(400);
            console.log("***************************")
          });


test('Create contact with short mobile number',async({request})=>{
    const{response, payload} = await contactHelper.createContact(request, campaignId,
        {
        mobile:"1234"
    })
    expect(response.status()).toBe(400);
    console.log("***************************")

})
})






