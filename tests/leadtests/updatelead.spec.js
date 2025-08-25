
const { test, expect } = require('@playwright/test');
//import { test, expect } from '@playwright/test';
const LeadHelper = require('../../helperClasses/leadhelper');
const BaseHelper = require('../../helperClasses/baseHelper');
const baseHelper = new BaseHelper();

test.describe.serial('Update Lead Flow', () => {
  let campaignId;
  let leadId;

  test.beforeEach(async ({ request }) => {
    // 1. Create Campaign
    const campaignPayload = LeadHelper.generateCreateCampaignPayload();
    const campaignRes = await request.post('/campaign', {
        data: campaignPayload,
        headers: baseHelper.getAuthHeaders()
    });
    const campaignBody = await campaignRes.json();
    console.log(`Create Campaign Status: ${campaignRes.status()}`);
    console.log(`Create Campaign Response: ${JSON.stringify(campaignBody, null, 2)}`);
    console.log('Campaign Created:', campaignBody);

    expect(campaignRes.status()).toBe(201);
    campaignId = campaignBody.campaignId;

    // 2. Create Lead with that campaign
    const leadPayload = LeadHelper.generateCreateLeadPayload(`lead-${Date.now()}`, campaignId);
    const leadRes = await request.post(`/lead?campaignId=${campaignId}`, {
        data: leadPayload,
        headers: baseHelper.getAuthHeaders()
    });
    

    const leadText = await leadRes.text();
    console.log('Lead Response Status:', leadRes.status());
    console.log('Lead Response Body:', leadText);

    const leadBody = await leadRes.json();


    console.log(`Create Lead Status: ${leadRes.status()}`);
    console.log(`Create Lead Response: ${JSON.stringify(leadBody, null, 2)}`);
    console.log('Lead Created:', leadBody);

    expect(leadRes.status()).toBe(201);
    leadId = leadBody.leadId;
  });

  test('Update Lead and assert all fields', async ({ request }) => {
    const overrides = {
      name: "Updated Lead",
      company: "abc corp",
      leadSource: "diwali sale",
      industry: "Manufacturing",
      phone: "kkkkkkkkk",
      leadStatus: "initial"
    };

    const payload = LeadHelper.generateUpdateLeadPayload(leadId, campaignId, overrides);

    const response = await request.put(`/lead?campaignId=${campaignId}&leadId=${leadId}`, {
        data: payload,
        headers: baseHelper.getAuthHeaders()
    });
    const body = await response.json();

    console.log(`Update Lead Status: ${response.status()}`);
    console.log(`Update Lead Response: ${JSON.stringify(body, null, 2)}`);
    console.log('Lead Updated:', body);

    expect(response.status()).toBe(200);

    // ✅ Assert overridden fields
    expect(body.name).toBe(overrides.name);
    expect(body.company).toBe(overrides.company);
    expect(body.leadSource).toBe(overrides.leadSource);
    expect(body.industry).toBe(overrides.industry);
    expect(body.phone).toBe(overrides.phone);
    expect(body.leadStatus).toBe(overrides.leadStatus);
  });
});