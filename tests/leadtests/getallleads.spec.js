const { test, expect } = require('@playwright/test');
const LeadHelper = require('../../helperClasses/leadhelper.js');
const BaseHelper = require('../../helperClasses/baseHelper.js');
const baseHelper = new BaseHelper();
const database1 = require('../../helperClasses/databaseUtility.js');
const { log } = require('../../helperClasses/logger.js');
require('dotenv').config();


test.describe.serial('get all Leads created in the system', () => {

    test('Get all leads using Api - check status to be 200', async ({request}) =>{
        
        const { status, body} = await LeadHelper.getAllLeads(request);
        log('Get all leads by page status in test:', `${status}`);
        expect(status).toBe(200);
        expect(body).toBeDefined();
        expect(Array.isArray(body)).toBe(true);
        log('Number of leads retrieved:', body.length);
        // Additional assertions can be added here based on the expected structure of the response body
        // For example, checking if certain fields exist in the lead objects
        if (body.length > 0) {
            const lead = body[0];
            expect(lead).toHaveProperty('leadId');
            expect(lead).toHaveProperty('name');
            expect(lead).toHaveProperty('company');
            expect(lead).toHaveProperty('email');
            expect(lead).toHaveProperty('phone');
            expect(lead).toHaveProperty('campaign');
            //expect(lead).toHaveProperty('lastName');
            // Add more property checks as needed
        }

    });

})
