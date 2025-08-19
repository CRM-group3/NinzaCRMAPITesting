// @ts-check
import { test, expect } from '@playwright/test';
test.describe('createuser API Tests', () => {

    test('log message to console', async ({ request }) => {
      console.log('This is my API test placeholder');
    });
  
  });

test('Delete user by userId', async ({ request }) => {
  // Replace with your actual userId
  const userId = "UID_02048";  

  // Send DELETE request
  const response = await request.delete('/admin/user', {
    params: { userId },  // query parameter
    headers: {
      "Authorization": "Basic " + Buffer.from("admin:password").toString("base64"),
      "Content-Type": "application/json"
    }
  });

  // Debug log
  console.log(await response.text());

  // ✅ Assert status
  expect(response.status()).toBe(204);  // or 204 depending on API design
});
