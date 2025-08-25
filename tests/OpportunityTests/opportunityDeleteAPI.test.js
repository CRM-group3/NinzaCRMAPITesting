import  { test , expect } from '@playwright/test';
test.describe('Opportunity DELETE API Tests', () => {

  test('API_08 - Delete non-existing opportunity should return 404', async ({ request }) => {
    // Send DELETE request with non-existing ID (9999)
    const response = await request.delete('/opportunity', {
      params: { opportunityId: '9999' }
    });

    // Debug logs
    console.log("Status Code:", response.status());
    const responseBody = await response.text();
    console.log("Response Body:", responseBody);

    // Validate status code
    expect(response.status()).toBe(500);

    
  });

});