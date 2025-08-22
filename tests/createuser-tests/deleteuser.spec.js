// @ts-check
import { test, expect } from '@playwright/test';
//test.describe('createuser API Tests', () => {

    test('log message to console', async ({ request }) => {
      console.log('This is my API test placeholder');
    });
  
  

test('Delete user by userId', async ({ request }) => {
  // Replace with your actual userId
  const userId = "UID_02206";  

  // Send DELETE request
  const response = await request.delete('/admin/user', {
    params: { userId },  // query parameter rmgyantra'  const password = 'rmgy@9999'
    headers: {
      "Authorization": "Basic " + Buffer.from("rmgyantra:rmgy@9999").toString("base64"),
      "Content-Type": "application/json"
    }
  });

  // Debug log
  console.log(await response.text());

  // ✅ Assert status
  expect(response.status()).toBe(204);  // or 204 depending on API design
});
//});
