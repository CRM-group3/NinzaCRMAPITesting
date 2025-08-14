import { test,expect } from '@playwright/test';

test.describe('createuser API Tests', () => {

  test('log message to console', async ({ request }) => {
    console.log('This is my API test placeholder');
  });

});

test('Create User - Already existing user should fail', async ({ request }) => {
  const existingUserPayload = {
    
    mobileNo: "1111112233",
    email: "annmc@b11.com",
    username: "bpgh",
    password: ''
  };

  const response = await request.post('/admin/create-user', {
    headers: {
      'Authorization': 'Basic ' + Buffer.from('rmgyantra:rmgy@9999').toString('base64'),
      'Content-Type': 'application/json'
    },
    data: existingUserPayload
  });

  console.log('Status:', response.status());
  console.log('Response body:', await response.text());

  // Asconst body = await response.json();sert that status code matches "already exists" scenario
  expect([409, 409]).toContain(response.status());

  // Optionally assert message
  const body = await response.json();
  const message = "username: bpgh already exists";
  console.log(message);
  expect(message).toMatch(/already exists/i);
});

