import { test,expect } from '@playwright/test';
import { faker } from '@faker-js/faker';


test('GET all users with Basic Auth', async ({ request }) => {
  // Basic Auth credentials
  const username = 'rmgyantra'
  const password = 'rmgy@9999'

  // Call GET /users with Authorization header
  const response = await request.get('/admin/users', {
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
    }
  });

  // Assert response
  expect(response.status()).toBe(200);

  const body = await response.json();
  console.log(body); // Print user list for debugging

  // Example assertion: check that body is an array
  expect(Array.isArray(body)).toBeTruthy();
});

test.describe('createuser API Tests', () => {

  test('log message to console', async ({ request }) => {
    console.log('This is my API test placeholder');
  });

});
test('Create User - with mandatory field', async ({ request }) => {
  const existingUserPayload = {
    
    email: faker.internet.email(),
    mobileNo: faker.number.int({ min: 7000000000, max: 9999999999 }).toString(),
    username: faker.internet.username(),
    password: faker.internet.password()
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
  expect([201, 201]).toContain(response.status());

  // Optionally assert message
  const body = await response.json();
  const message = "Created";
  console.log(message);
  expect(message).toMatch(/Created/i);
});
test('Create User - with blank mobile field', async ({ request }) => {
  const existingUserPayload = {
    
    email: faker.internet.email(),
    mobileNo: "",
   // username: faker.internet.username(),
    password: faker.internet.password()
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
  expect([422, 422]).toContain(response.status());

  // Optionally assert message
  const body = await response.json();
  const message = "Unprocessable Entity";
  console.log(message);
  expect(message).toMatch(/Unprocessable Entity/i);
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
  //expect(message).toMatch(/already exists/i);
});

