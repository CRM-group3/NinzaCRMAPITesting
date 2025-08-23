import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { config } from 'dotenv';
config();
import fs from 'fs';
import Ajv from 'ajv';
import createleadreqdfieldsschema from '../../test-data/leadrequests/schemas/createleadreqdfieldsschema.json'; 
//const createleadreqdfieldsschema = require('../../test-data/leadrequests/schemas/createleadreqdfieldsschema.json'); // Load your schema
//const Ajv = require('ajv');

test('Create lead and check schema', async ({ request }) => {

    let campId;  
    let leadId; 
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    //const base_url = process.env.BASEURL;
  
    // --- Step 1: Create Campaign ---
    await test.step('Create campaign', async () => {
      const rawPayloadcampaign = JSON.parse(fs.readFileSync('test-data/leadrequests/campaignfieldsreq.json', 'utf-8'));
      rawPayloadcampaign.campaignName = "Diwali" + faker.person.firstName();
      
  
      const response = await request.post(`campaign`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        
        },
        data: rawPayloadcampaign
      });
  
      const status = response.status();
      const body = await response.text();
    
      console.log('📥 Response Status:', status);
      console.log('📥 Response Body:', body);
    
      // ✅ Fail-fast logging
      if (status !== 201) {
        throw new Error(`❌ Expected 201 but got ${status}. Server response: ${body}`);
      }
    
  
      //expect(response.status()).toBe(201);
      const responseBody = await response.json();
      campId = responseBody.campaignId;
      console.log('✅ Created Campaign ID:', campId);
    });
  
    // --- Step 2: Create Lead ---
    await test.step('create lead and validate schema', async () => {
      const rawPayloadLead = JSON.parse(fs.readFileSync('test-data/leadrequests/mandatoryfieldsleftblank.json', 'utf-8'));
      rawPayloadLead.campaign.campaignId = campId;
      const ajv = new Ajv();
      const validate = ajv.compile(createleadreqdfieldsschema);
  
      const leadResponse = await request.post(`${process.env.BASEURL}lead/?campaignId=${campId}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.USERNAME}:${process.env.PASSWORD}`).toString('base64')}`,
        },
        data: rawPayloadLead
      });
  
      //const status = leadResponse.status()
      //const body = await leadResponse.text();
  
      expect(leadResponse.status()).toBe(201);
      const leadBody = await leadResponse.json();
      leadId = leadBody.leadId;
      console.log('✅ Created Lead ID:', leadId);
      console.log('✅ Created Lead ID:', leadBody);

      // 3️⃣ Validate schema
        const isValid = validate(leadBody);
        if (!isValid) {
            console.error('❌ Schema validation errors:', validate.errors);
        }
        expect(isValid).toBe(true);



    });

});