const { test, expect } = require('@playwright/test');
const LeadHelper = require('../../helperClasses/leadhelper.js');
const BaseHelper = require('../../helperClasses/baseHelper.js');
const baseHelper = new BaseHelper();
const database1 = require('../../helperClasses/databaseUtility.js');
const { log } = require('../../helperClasses/logger');
require('dotenv').config();


test.describe.serial('Create Lead and Check DB', () => {

    let campaignId;
    let leadId;

    test('Create campaign using Api', async ({request}) =>{
        
        campaignId = await LeadHelper.createCampaign(request);
        console.log('Campaign ID in test:', campaignId);
        log('Campaign ID in test:', campaignId);

    });

    test('Create lead using Api', async ({request}) =>{
        
        leadId = await LeadHelper.createLead_AllFields(request, campaignId);
        console.log('Lead ID in test:', leadId);
        log('Lead ID in test:', leadId);

    });

    test ('Check lead in DB', async () =>{
       

    //step 2: Query DB for the Leadid
    const [rows] = await database1.query(
        'SELECT * FROM lead WHERE lead_id = ?', [leadId]
        
    );

       // const result = await database.executeQuery(query);
        console.log('Database query result:', rows);
        log('Database query result:', rows);

        expect(rows.length).toBe(1);

    if (!rows || rows.length === 0) {
      throw new Error(`No lead found in DB with lead_id: ${leadId}`);
    }

    const lead = rows[0];

    // 4. Soft assertions
    expect.soft(lead.lead_id).toBe(leadId);
    expect.soft(lead.campaign_campaign_id).toBe(campaignId);
    expect.soft(lead.lead_status).toBe('New');
    expect.soft(lead.name).toBeDefined();
    expect.soft(lead.company).toBeDefined();
    expect.soft(lead.lead_source).toBeDefined();
    expect.soft(lead.industry).toBeDefined();
    expect.soft(lead.annual_revenue).toBeDefined();
    expect.soft(lead.no_of_employees).toBeDefined();
    expect.soft(lead.phone).toBeDefined();
    expect.soft(lead.email).toBeDefined();
    expect.soft(lead.secondary_email).toBeDefined();
    expect.soft(lead.website).toBeDefined();
    expect.soft(lead.assigned_to).toBeDefined();
    expect.soft(lead.address).toBeDefined();
    expect.soft(lead.city).toBeDefined();
    expect.soft(lead.country).toBeDefined();
    expect.soft(lead.postal_code).toBeDefined();
    expect.soft(lead.rating).toBeDefined();
    expect.soft(lead.description).toBeDefined();
  });
   
});

// const { test, expect } = require('@playwright/test');
// const LeadHelper = require('../../helperClasses/leadhelper.js');
// const database = require('../../helperClasses/databaseUtility.js');
/*
require('dotenv').config();
const { test, expect } = require('@playwright/test');
const LeadHelper = require('../../helperClasses/leadhelper.js');
const database1 = require('../../helperClasses/databaseUtility.js');
const { log } = require('../../helperClasses/logger');

test.describe.serial('Create Lead and Check DB', () => {

  test('Create lead via API and check in DB', async ({ request }) => {
    let campaignId;
    let leadId;

    try {
      // 1. Create campaign
      campaignId = await LeadHelper.createCampaign(request);
      console.log('Campaign ID in test:', campaignId);

      // 2. Create lead using the campaign ID
      leadId = await LeadHelper.createLead_AllFields(request, campaignId);
      console.log('Lead ID in test:', leadId);

      if (!leadId) throw new Error('leadId is undefined!');

      await new Promise(res => setTimeout(res, 1000));


      // 3. Query the database to verify the lead
      const [rows] = await database1.query(
        'SELECT * FROM lead WHERE lead_id = ?', [leadId]
      );

      console.log('Database query result:', rows);

      // 4. Assertions
      expect(rows.length).toBe(1);
      expect(rows[0].lead_id).toBe(leadId);
      expect(rows[0].campaign_campaign_id).toBe(campaignId);

    } catch (err) {
      console.error('Test failed:', err);
      throw err;
    }

    // ✅ No need to close the pool manually
  });
});

*/




