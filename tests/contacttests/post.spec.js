const { test, expect } = require("@playwright/test");
const { faker } = require("@faker-js/faker");
const { DateTime } = require("luxon");
const config = require("../../test-data/contacts-json/config.json");

/*Helper: Generate headers
Creates Basic Auth headers dynamically from config.json.
Avoids repeating the Authorization code in every request.
The base64(username:password) part is your credentials encoded into Base64 text.
Inside backticks, ${...} means "evaluate this JS expression and put its result here".*/

function getAuthHeaders() {
  return {
    Authorization: `Basic ${Buffer.from(
      `${config.username}:${config.password}`
    ).toString("base64")}`,
    "Content-Type": "application/json",
  };
}
/*Generates a complete contact request body with random data.
basePayload = all the default fields we want in a contact.
overrides = a way to replace some of those fields when needed without rewriting the whole payload.
This is called the spread operator in JavaScript.
{ ...basePayload } copies all properties from basePayload into a new object.
{ ...basePayload, ...overrides } copies everything from basePayload, then replaces any matching fields with the ones from overrides.
Keeps test data dynamic so every run is unique unless overridden.
Helper: Build contact payload*/
function buildContactPayload(overrides = {}) {
  const basePayload = {
    campaign: {
      campaignId: config.campaignId,
      campaignName: faker.company.name(),
      campaignStatus: "active",
      targetSize: faker.number.int({ min: 5, max: 100 }),
      expectedCloseDate: DateTime.now()
        .plus({ days: faker.number.int({ min: 5, max: 30 }) })
        .toISODate(),
      targetAudience: faker.number.int({ min: 10, max: 100 }).toString(),
      description: faker.lorem.sentence(),
    },
    contactName: faker.person.fullName(),
    department: faker.commerce.department(),
    email: faker.internet.email(),
    mobile: faker.phone.number(),
    officePhone: faker.phone.number(),
    organizationName: faker.company.name(),
    title: faker.person.jobTitle(),
  };
    
    return { ...basePayload, ...overrides };// Overrides allow customizing fields (e.g., only mandatory)
}

/*Helper: Create contact API call
sends a POST /contact request with: 1. Headers from getAuthHeaders()
2.Payload from buildContactPayload()
3.Returns both the HTTP response and the payload used (so tests can verify returned values match sent ones).*/
  async function createContact(request, overrides = {}) {
  const payload = buildContactPayload(overrides);
  const response = await request.post(
    `${config.baseUrl}/contact/?campaignId=${config.campaignId}`,
    {
      headers: getAuthHeaders(),
      data: payload,
    }
  );
  return { response, payload };
}

//Stores a contact’s name & mobile from the first test so the duplicate contact test can reuse them.
let savedContactData;

// async function deleteContact(request, contactId) {
//     return await request.delete(
//       `${config.baseUrl}/contact/${contactId}?campaignId=${config.campaignId}`,
//       { headers: getAuthHeaders() }
//     );
//   }

//Runs once before all tests.
//Creates an initial contact & saves contactName + mobile for the duplicate contact test.
test.describe("POST /contact API", () => {
  test.beforeAll(async ({ request }) => {
    // Create initial contact to use in duplicate test
    const { response, payload } = await createContact(request);
    expect(response.status()).toBe(201);
    savedContactData = {
      contactName: payload.contactName,
      mobile: payload.mobile,
    };
  });

  //Sends a full payload.
  test("Create contact with all fields", async ({ request }) => {
    const { response, payload } = await createContact(request);
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty("contactName", payload.contactName);
    expect(body).toHaveProperty("organizationName", payload.organizationName);
  });

  console.log("***************************")

  //Overrides some fields with undefined so they’re excluded.
//Tests if the API still works with only required fields.
  test("Create contact with mandatory fields only", async ({ request }) => {
    const { response, payload } = await createContact(request, {
      department: undefined,
      officePhone: undefined,
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty("contactName", payload.contactName);
    expect(body).toHaveProperty("organizationName", payload.organizationName);
  });

  console.log("***************************")

  //Sends same contactName and mobile as the one created in beforeAll.
  test("Create duplicate contact (same name & mobile)", async ({ request }) => {
    if (!savedContactData) throw new Error("No saved contact data from previous test");

    const { response } = await createContact(request, {
      contactName: savedContactData.contactName,
      mobile: savedContactData.mobile,
    });

    // Depending on API, duplicate may fail with 400/409
    expect(response.status()).toBe(409);
  });

  console.log("***************************")

  test('Create contact with contact name missing',async({request})=>{
    const { response, payload } = await createContact(request, {
    contactName: undefined
    })

    expect(response.status()).toBe(400);
})

console.log("***************************")

// test('Create contact with invalid campaign ID',async({request})=>{

    
//             const { response } = await createContact(
//               request,
//               { contactName: "Invalid Campaign Test" },
//               "INVALID123"
//             );
            
//             expect(response.status()).toBe(404);
//           });
console.log("***************************")
test('Create contact with short mobile number',async({request})=>{
    const{response, payload} = await createContact(request,
        {
        mobile:"1234"
    })
    expect(response.status()).toBe(400);

})
})






