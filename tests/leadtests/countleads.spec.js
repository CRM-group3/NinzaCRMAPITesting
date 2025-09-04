const { test, expect } = require('@playwright/test');
const LeadHelper = require('../../helperClasses/leadhelper.js');
const BaseHelper = require('../../helperClasses/baseHelper.js');
const baseHelper = new BaseHelper();
const database1 = require('../../helperClasses/databaseUtility.js');
const { log } = require('../../helperClasses/logger.js');
require('dotenv').config();


test.describe.serial('count all Leads in system', () => {

    test('count all leads in system using Api - check status to be 200', async ({request}) =>{
        
        const { status, body} = await LeadHelper.countLeads(request);
        log('count leads status in test:', `${status}`);
        expect(status).toBe(200);
        expect(body).toBeDefined();

        log('number of leads :' + JSON.stringify(body, null, 2));
        expect(typeof body).toBe('number'); 
        expect(body).toBeGreaterThanOrEqual(0);
        
        });
        
    

})
