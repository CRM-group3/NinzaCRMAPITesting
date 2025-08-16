const { test, expect } = require("@playwright/test");
const config = require("../../test-data/contacts-json/config.json");

// ✅ Helper for headers
function getAuthHeaders() {
  return {
    Authorization: `Basic ${Buffer.from(
      `${config.username}:${config.password}`
    ).toString("base64")}`,
    "Content-Type": "application/json",
  };
}

test.describe("GET /contact API", () => {
  test("Retrieve contacts - Unauthorized access", async ({ request }) => {
    // Wrong / missing auth headers
    const response = await request.get(
      `${config.baseUrl}/contact/all`,
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

  test("Retrieve count of contacts created", async ({ request }) => {
    const response = await request.get(
      `${config.baseUrl}/contact/count`,
      {
        headers: getAuthHeaders(),
      }
    );

    //  Verify status
    expect(response.status()).toBe(200);

    // Verify count exists and is a number
    const data = await response.json();
    console.log("Contact count:", data);

    // // Assuming API returns { count: 5 } or just a number
    // expect(typeof data.count || data).toBe("number");
  });

  test('Retreive count of the contacts created with unauthorized access',async({request})=>{

    const response = await request.get(
        `${config.baseUrl}/contact/count`,
        {
            headers: {
              // Either remove Authorization or give wrong credentials
              Authorization: "Basic invalidtoken",
              "Content-Type": "application/json",
            },
        })
        expect(response.status()).toBe(401);

  })

  test('Retreive all contacts',async({request})=>{
    const response = await request.get(
        `${config.baseUrl}/contact-all`,
        {
            headers:getAuthHeaders()
        })
    expect(response.status()).toBe(200);
  })

  test('Retreive all contacts with unauthorized access',async({request})=>{
    const response = await request.get(
        `${config.baseUrl}/contact-all`,
        {
            headers:{
                Authorization: "Basic invalidtoken"
            }
        })
    expect(response.status()).toBe(401);
  })
});


