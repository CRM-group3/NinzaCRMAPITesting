const { test, expect } = require("@playwright/test");
const { faker } = require("@faker-js/faker");
const { DateTime } = require("luxon");
const config = require("../../test-data/contacts-json/config.json");

/*Helper: Generate headers
Creates Basic Auth headers dynamically from config.json.*/
function getAuthHeaders() {
    return {
      Authorization: `Basic ${Buffer.from(
        `${config.username}:${config.password}`
      ).toString("base64")}`,
      "Content-Type": "application/json",
    };
  }

  //Helper: Build contact payload*/
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


  //Helper: Create contact API call,sends a POST /contact request
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


// Helper: Update contact API call
async function updateContact(request, contactId, overrides = {}) {
    const payload = { ...overrides }; // send only what we want to update
    const response = await request.put(
      `${config.baseUrl}/contact?campaignId=${config.campaignId}&contactId=${contactId}`,
      {
        headers: getAuthHeaders(),
        data: payload,
      }
    );
    return { response, payload };
  }
  
//   // Helper: Delete contact API call (cleanup)
// async function deleteContact(request, contactId) {
//     return await request.delete(
//       `${config.baseUrl}/contact/${contactId}?campaignId=${config.campaignId}`,
//       { headers: getAuthHeaders() }
//     );
//   }

  test.describe("PUT /contact API", () => {
    test("Update contact with Invalid Contact ID", async ({ request }) => {
      const invalidContactId = "invalid-contact-id"; // deliberately wrong
  
      const { response } = await updateContact(request, invalidContactId, {
        contactName: "Updated Invalid Contact",
      });
  
      // Adjust expected status depending on API behavior
      expect(response.status()).toBe(404); // usually Not Found
    });

     test("Update existing contact's department name", async ({ request }) => {
        // Step 1: Create a contact
        const { response: createResponse } = await createContact(request);
        expect(createResponse.status()).toBe(201);
        const createdContact = await createResponse.json();
        const contactId = createdContact.contactId;
        expect(contactId).toBeTruthy();
      
        // Step 2: Update only the department field
        const newDepartment = "Updated QA Department";
        const { response: updateResponse } = await updateContact(request, contactId, {
          department: newDepartment,
        });
      
        expect(updateResponse.status()).toBe(200);
      
        // Step 3: Verify the update
        const updatedContact = await updateResponse.json();
        expect(updatedContact.department).toBe(newDepartment);
      });
      
    });