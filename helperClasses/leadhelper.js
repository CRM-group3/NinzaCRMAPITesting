const { faker } = require('@faker-js/faker');
const { DateTime } = require('luxon');

class LeadHelper {
 
  static generateCreateLeadPayload(leadId, campaignId, overrides = {}) {
    const defaultPayload = {
      address: faker.location.streetAddress(),
      annualRevenue: faker.number.int({ min: 50000, max: 5000000 }),
      assignedTo: faker.person.fullName(),
      campaign: {
        campaignId,
        campaignName: faker.commerce.productName(),
        campaignStatus: "ongoing",
        description: faker.lorem.sentence(),
        expectedCloseDate: DateTime.now().plus({ days: 30 }).toISODate(),
        targetAudience: faker.word.words(2),
        targetSize: faker.number.int({ min: 100, max: 50000 })
      },
      city: faker.location.city(),
      company: faker.company.name(),
      country: faker.location.country(),
      description: faker.lorem.sentence(),
      email: faker.internet.email(),
      industry: faker.commerce.department(),
      leadId,
      leadSource: faker.helpers.arrayElement(["web", "email", "event", "referral"]),
      leadStatus: faker.helpers.arrayElement(["initial", "qualified", "contacted", "closed"]),
      name: faker.person.fullName(),
      noOfEmployees: faker.number.int({ min: 10, max: 5000 }),
      phone: faker.string.numeric(10),
      postalCode: faker.string.numeric(6),
      rating: faker.helpers.arrayElement(["Hot", "Warm", "Cold"]),
      secondaryEmail: faker.internet.email(),
      website: faker.internet.url()
    };

    // merge overrides (shallow + nested campaign)
    const mergedPayload = { ...defaultPayload, ...overrides };
    mergedPayload.campaign = { ...defaultPayload.campaign, ...(overrides.campaign || {}) };

    return mergedPayload;
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



}




module.exports = LeadHelper;


