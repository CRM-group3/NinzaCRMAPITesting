import { test, expect } from '@playwright/test';
import mysql from 'mysql2/promise';
import { faker } from '@faker-js/faker';
test('Create User - with existing mobile field', async ({ request }) => {
    const newuser = {
    
        email: faker.internet.email(),
        mobileNo: faker.number.int({ min: 7000000000, max: 9999999999 }).toString(),
        username: faker.internet.username(),
        password: faker.internet.password()
      };
      console.log('Faker User Data:', newuser);
  const response = await request.post('/admin/create-user', {
    headers: {
      'Authorization': 'Basic ' + Buffer.from('rmgyantra:rmgy@9999').toString('base64'),
      'Content-Type': 'application/json'
    },
    data: newuser
  });


  expect(response.ok()).toBeTruthy();

  // --- Step 2: Connect to MySQL DB ---
  const connection = await mysql.createPool({
    host: '49.249.28.218',     // change if your DB is remote
    user: 'root@%',          // your MySQL username
    password: 'root',  // your MySQL password
    database: 'crm' ,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0 ,
    port: 3333
      // your database name
  });

  // --- Step 3: Query DB for the user ---
  const [rows] = await connection.execute(
    'SELECT * FROM employee WHERE username = ?',
    [newuser.username]
  );

  // --- Step 4: Validate DB entry exists ---
  expect(rows.length).toBeGreaterThan(0);
  expect(rows[0].email).toBe(newuser.email);
  console.log('DB Row:', rows[0]);
  console.log('Compare Faker vs DB:');
  console.log('Username:', newuser.username, '== DB:', rows[0].username);
  console.log('Email:', newuser.email, '== DB:', rows[0].email);
  // --- Close connection ---
  await connection.end();
});
