const { expect} = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const { DateTime } = require('luxon');
const { log } = require('./logger');
const BaseHelper = require('./baseHelper');
const baseHelper = new BaseHelper();

class LeadHelper {
 
  static generateCreateLeadPayload(campaignId,overrides = {}) {
    const defaultPayload = {
      address: faker.location.streetAddress(),
      annualRevenue: faker.number.int({ min: 50000, max: 5000000 }),
      assignedTo: faker.person.fullName(),
      campaign: {
           campaignId // only include campaignId, other fields optional
      },      
      city: faker.location.city(),
      company: faker.company.name(),
      country: faker.location.country(),
      description: faker.lorem.sentence(),
      email: faker.internet.email(),
      industry: faker.commerce.department(), 
      leadSource: faker.helpers.arrayElement(["web", "email", "event", "referral"]),
      leadStatus: faker.helpers.arrayElement(["initial", "qualified", "contacted", "closed"]),
      name: faker.person.fullName(),
      noOfEmployees: faker.number.int({ min: 10, max: 5000 }),
      phone: faker.string.numeric(10),
      postalCode: faker.string.numeric(5),
      rating: faker.helpers.arrayElement(["Hot", "Warm", "Cold"]),
      secondaryEmail: faker.internet.email(),
      website: faker.internet.url(),
      ...overrides
      

    };

    return defaultPayload;
  }

 
  static generateUpdateLeadPayload(leadId, campaignId, overrides = {}) {
    // just reuse create payload since structure is same
    return this.generateCreateLeadPayload(leadId, campaignId, overrides);
  }

  static generateCreateCampaignPayload(overrides = {}) {
    const defaultPayload = {
      campaignName: faker.commerce.productName() + " Campaign",
      campaignStatus: "ongoing",
      description: faker.lorem.sentence(),
      expectedCloseDate: DateTime.now().plus({ days: 30 }).toISODate(),
      targetAudience: faker.word.words(2),
      targetSize: faker.number.int({ min: 100, max: 50000 })
    };

    return { ...defaultPayload, ...overrides };
  }


  static async createCampaign(request)
  {
      const campPayLoad = {
        campaignName: faker.commerce.productName() + " Campaign",
        campaignStatus: "ongoing",
        description: faker.lorem.sentence(),
        expectedCloseDate: DateTime.now().plus({ days: 30 }).toISODate(),
        targetAudience: faker.word.words(2),
        targetSize: faker.number.int({ min: 100, max: 50000 })

      }

      const campRes = await request.post('/campaign', {
        data: campPayLoad,
        headers: baseHelper.getAuthHeaders()
      })

      const campaignBody = await campRes.json();
      console.log('Campaign created:', campaignBody);
      const campaignId = campaignBody.campaignId;
      console.log('Campaign id:', campaignId);
      log(`Campaign id in helper: ${campaignId}`);
      
      console.log('Campaign status in helper: ', campRes.status());
      log(`Campaign status: ', ${campRes.status()}`);
      expect(campRes.status()).toBe(201);

      return campaignId;

  }


  static async createLead_AllFields(request, campaignId, overrides = {})
  {
      
      const leadRes = await request.post(`/lead?campaignId=${campaignId}`, {
        data: this.generateCreateLeadPayload(campaignId,overrides),
        headers: baseHelper.getAuthHeaders()
      })
      const leadBody = await leadRes.json();
  
      console.log('Lead created:', leadBody);
      const leadId = leadBody.leadId;
      //console.log('Lead id from helper:', leadId);
      log(`Lead id in helper: ${leadId}`);
      
      //console.log('Lead status from helper: ', leadRes.status());
      log(`lead status in helper: ', ${leadRes.status()}`);
      expect(leadRes.status()).toBe(201);

      return leadId;

  }

static async deleteLead(request, leadId, overrides = {}) {
    const deleteRes = await request.delete(`/lead?leadId=${leadId}`, {
        headers: baseHelper.getAuthHeaders()
    });

    //const body = await deleteRes.json();
    //log(`Delete lead response body: ${JSON.stringify(body)}`);
    log(`Delete lead status: ${deleteRes.status()}`);

    // Return response for assertions in the test
    return { status: deleteRes.status() };
  }

  static async getAllLeadsByPage(request,overrides = {}) {
    const res = await request.get(`/lead/all`, {
        headers: baseHelper.getAuthHeaders()
    });

    const body = await res.json();
    log(`get leads by page response body: ${JSON.stringify(body)}`);
    log(`getAllLeadsByPage status: ${res.status()}`);

    // Return response for assertions in the test
    return { status: res.status() , body  };
}

  static async getAllLeads(request,overrides = {}) {
    const res = await request.get(`/lead/all-leads`, {
        headers: baseHelper.getAuthHeaders()
    });

    const body = await res.json();
    log(`get all leads response body: ${JSON.stringify(body)}`);
    log(`getAllLeads status: ${res.status()}`);

    // Return response for assertions in the test
    return { status: res.status(), body  };
  }

  static async countLeads(request,overrides = {}) {
    const res = await request.get(`/lead/count`, {
        headers: baseHelper.getAuthHeaders()
    });

    const body = await res.json();
    log(`count leads response body: ${JSON.stringify(body)}`);
    log(`count leads status: ${res.status()}`);

    // Return response for assertions in the test
    return { status: res.status(), body };
  }




}




module.exports = LeadHelper;


