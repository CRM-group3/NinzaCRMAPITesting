
const { test, expect } = require('@playwright/test');
//import { test, expect } from '@playwright/test';
const LeadHelper = require('../../helperClasses/leadhelper');
const BaseHelper = require('../../helperClasses/baseHelper');
const baseHelper = new BaseHelper();

const database = require('../../helperClasses/databaseUtility.js');

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

  test('Update Lead and assert all mandatory fields', async ({ request }) => {
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

test('Update Lead with invalid email format (422)', async ({ request }) => {
    const overrides = {
      email: "invalid-email-format"
    };

    const payload = LeadHelper.generateUpdateLeadPayload(leadId, campaignId, overrides);

    const response = await request.put(`/lead?campaignId=${campaignId}&leadId=${leadId}`, {
        data: payload,
        headers: baseHelper.getAuthHeaders()
    });

    const body = await response.text();
    console.log(`Update Lead with Invalid Email Status: ${response.status()}`);
    console.log(`Update Lead with Invalid Email Response: ${body}`);

    expect(response.status()).toBe(422);
  });

  test('Update non-existing lead (404)', async ({ request }) => {
    const nonExistingLeadId = `nonexistent-${Date.now()}`;

    const payload = LeadHelper.generateUpdateLeadPayload(nonExistingLeadId, campaignId, { name: "Non-existent Lead" });

    const response = await request.put(`/lead?campaignId=${campaignId}&leadId=${nonExistingLeadId}`, {
        data: payload,
        headers: baseHelper.getAuthHeaders()
    });

    const body = await response.text();
    console.log(`Update Non-existing Lead Status: ${response.status()}`);
    console.log(`Update Non-existing Lead Response: ${body}`);

    expect(response.status()).toBe(404);
  });

  test('Update Lead with invalid campaignId (400)', async ({ request }) => {
    const invalidCampaignId = "invalid-campaign-id";

    const payload = LeadHelper.generateUpdateLeadPayload(leadId, invalidCampaignId, { name: "Lead with Invalid Campaign" });

    const response = await request.put(`/lead?campaignId=${invalidCampaignId}&leadId=${leadId}`, {
        data: payload,
        headers: baseHelper.getAuthHeaders()
    });

    const body = await response.text();
    console.log(`Update Lead with Invalid Campaign ID Status: ${response.status()}`);
    console.log(`Update Lead with Invalid Campaign ID Response: ${body}`);

    expect(response.status()).toBe(400);
  });

 

  test.afterEach(async ({ request }) => {
    // Cleanup - Delete created lead
    if (leadId) {
      const delLeadRes = await request.delete(`/lead?leadId=${leadId}`, {
          headers: baseHelper.getAuthHeaders()
      });
      console.log(`Delete Lead Status: ${delLeadRes.status()}`);
      leadId = null;
    }

    // Cleanup - Delete created campaign
    if (campaignId) {
      const delCampaignRes = await request.delete(`/campaign?campaignId=${campaignId}`, {
          headers: baseHelper.getAuthHeaders()
      });
      console.log(`Delete Campaign Status: ${delCampaignRes.status()}`);
      campaignId = null;
    }
  });




});