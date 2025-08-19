// helperClasses/contactHelper.js
const { faker } = require("@faker-js/faker");
const { DateTime } = require("luxon");
const config = require("../test-data/contacts-json/config.json");
const CommonHelper = require("./baseHelper");

const helper = new CommonHelper();

class ContactHelper {
  // 🔹 Build campaign payload
  buildCampaignPayload(overrides = {}) {
    const basePayload = {
      campaignId: faker.string.alphanumeric(8).toUpperCase(),
      campaignName: faker.company.name(),
      campaignStatus: "active",
      targetSize: faker.number.int({ min: 10, max: 500 }),
      expectedCloseDate: DateTime.now().plus({ days: 15 }).toISODate(),
      targetAudience: faker.number.int({ min: 50, max: 1000 }).toString(),
      description: faker.lorem.sentence(),
    };
    return { ...basePayload, ...overrides };
  }

  // 🔹 Create campaign API call
  async createCampaign(request, overrides = {}) {
    const payload = this.buildCampaignPayload(overrides);

    const response = await request.post(`${config.baseUrl}/campaign`, {
      headers: helper.getAuthHeaders(),
      data: payload,
    });

    if (response.status() !== 201) {
      throw new Error(`Failed to create campaign: ${response.status()}`);
    }

    const body = await response.json();
    return { response, payload, body };
  }

  // 🔹 Build contact payload (uses campaignId dynamically)
  buildContactPayload(campaignId, overrides = {}) {
    const basePayload = {
      campaign: {
        campaignId,
        campaignName: faker.company.name(),
        campaignStatus: "active",
        targetSize: faker.number.int({ min: 5, max: 100 }),
        expectedCloseDate: DateTime.now()
          .plus({ days: faker.number.int({ min: 5, max: 30 }) })
          .toISODate(),
        targetAudience: faker.number.int({ min: 10, max: 100 }).toString(),
        description: faker.lorem.sentence(),
      },
      contactName: faker.person.fullName(),
      department: faker.commerce.department(),
      email: faker.internet.email(),
      mobile: faker.phone.number(),
      officePhone: faker.phone.number(),
      organizationName: faker.company.name(),
      title: faker.person.jobTitle(),
    };

    return { ...basePayload, ...overrides };
  }

  // 🔹 Create contact API call
  /*Helper: Create contact API call
sends a POST /contact request with: 1. Headers from getAuthHeaders()
2.Payload from buildContactPayload()
3.Returns both the HTTP response and the payload used (so tests can verify returned values match sent ones).*/
  async createContact(request, campaignId, overrides = {}) {
    const payload = this.buildContactPayload(campaignId, overrides);

    const response = await request.post(
      `${config.baseUrl}/contact/?campaignId=${campaignId}`,
      {
        headers: helper.getAuthHeaders(),
        data: payload,
      }
    );

    return { response, payload };
  }

  // 🔹 Update contact API call
  async updateContact(request, campaignId, contactId, overrides = {}) {
    const payload = { ...overrides };
    const response = await request.put(
      `${config.baseUrl}/contact?campaignId=${campaignId}&contactId=${contactId}`,
      {
        headers: helper.getAuthHeaders(),
        data: payload,
      }
    );
    return { response, payload };
  }

  
}

module.exports = ContactHelper;
