const { test, expect } = require('@playwright/test');
const LeadHelper = require('../../helperClasses/leadhelper.js');
const BaseHelper = require('../../helperClasses/baseHelper.js');
const baseHelper = new BaseHelper();
const database1 = require('../../helperClasses/databaseUtility.js');
const { log } = require('../../helperClasses/logger');
require('dotenv').config();


test.describe.serial('delete Lead and Check DB', () => {

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

    test('Delete lead using Api - check status to be 204', async ({request}) =>{
        
        log('Lead to delete in test:', leadId);
        const { status} = await LeadHelper.deleteLead(request, leadId);
        log('Lead deleted in test:', `$leadId`);
        log('Delete lead status in test:', `${status}`);
        expect(status).toBe(204);
        //expect(body.message).toBe('Lead deleted successfully');     
        //log('Lead deleted in test:', leadId);
    });

    test ('Check lead in DB', async () =>{     
            //step 2: Query DB for the Leadid
            const [rows] = await database1.query(
                'SELECT * FROM lead WHERE lead_id = ?', [leadId]      
            );

                log('Database query result:', rows);
                expect(rows.length).toBe(0);

        });

    })