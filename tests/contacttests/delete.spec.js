const { test, expect } = require("@playwright/test");
const { faker } = require("@faker-js/faker");
const config = require("../../test-data/contacts-json/config.json");

// Helper for headers
function getAuthHeaders() {
    return {
      Authorization: `Basic ${Buffer.from(
        `${config.username}:${config.password}`
      ).toString("base64")}`,
      "Content-Type": "application/json",
    };
  }

  test.describe("DELETE /contact API", () => {
    test("Delete contact with Unauthorized access", async ({ request }) => {
      // Wrong / missing auth headers
      const response = await request.delete(
        `${config.baseUrl}/contact?contactId=CON00076`,
        {
          headers: {
            // Either remove Authorization or give wrong credentials
            Authorization: "Basic invalidtoken",
            "Content-Type": "application/json",
          },
        }
      );
      //Expect unauthorized
      expect(response.status()).toBe(401); // or 403 depending on API behavior
    });

    
    test("Delete contact with given contactID", async ({ request }) => {
        // 1. Create a new contact
        const createResponse = await request.post(`${config.baseUrl}/contact/?campaignId=${config.campaignId}`, {
          headers: getAuthHeaders(),
          data: {
            contactName: faker.person.fullName(),
            mobile: faker.phone.number(),
            organizationName: faker.company.name(),
            title: faker.person.jobTitle(),
            email: faker.internet.email()
          }
        });
      
        expect(createResponse.status()).toBe(201);
        const createdContact = await createResponse.json();
        const contactId = createdContact.contactId;  // extract generated ID
        console.log("Created Contact ID:", contactId);
      
        // 2. Delete the same contact
        const deleteResponse = await request.delete(
          `${config.baseUrl}/contact?contactId=${contactId}`,
          {
            headers: getAuthHeaders()
          }
        );
      
        expect(deleteResponse.status()).toBe(204); // API should return 204 on successful delete
      });
      

  
})