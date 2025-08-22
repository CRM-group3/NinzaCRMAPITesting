// tests/createUser.e2e.spec.js
import { test, expect, request } from '@playwright/test';
import { Client } from 'pg';   // for PostgreSQL

// Database client setup
const dbClient = new Client({
  host: "49.249.28.218",   // change as per your DB
  user: "root@%",
  password: "root",
  database: "crm",
  port: 3333
});

test.beforeAll(async () => {
  await dbClient.connect();
});

test.afterAll(async () => {
  await dbClient.end();
});

test('Create User via API and validate in DB', async ({ request }) => {
  // 1️⃣ Create unique user payload
  const newUser = {
    
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
    data: newUser
  });

  
  // 3️⃣ Validate API response
  expect(response.status()).toBe(201);
  const responseBody = await response.json();
  expect(responseBody.username).toBe(newUser.username);
  expect(responseBody.email).toBe(newUser.email);

  // 4️⃣ Query DB to check user exists
  const query = 'SELECT username, email FROM users WHERE username = $1';
  const result = await dbClient.query(query, [newUser.username]);

  // 5️⃣ Validate DB result
  expect(result.rows.length).toBe(1);
  expect(result.rows[0].username).toBe(newUser.username);
  expect(result.rows[0].email).toBe(newUser.email);
});
