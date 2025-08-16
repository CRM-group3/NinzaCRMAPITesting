const { test, expect } = require("@playwright/test");
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
          // Wrong / missing auth headers
          const response = await request.delete(
            `${config.baseUrl}/contact?contactId=CON00076`,
            {
              
                headers:getAuthHeaders(),
                "Content-Type": "application/json",
              },
            
          );
          
        expect(response.status()).toBe(204); // or 403 depending on API behavior
        });

  
})