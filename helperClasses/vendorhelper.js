const { faker } = require('@faker-js/faker');
const { DateTime } = require("luxon");

class VendorHelper {
  static createVendorPayload(overrides = {}) {
    const vendorData = {
      category: "Electronics",
      city: faker.location.city(),
      country: faker.location.country(),
      email: faker.internet.email(),
      mobileNo: faker.phone.number("##########"),
      postalCode: faker.location.zipCode(),
      state: faker.location.state(),
      street: faker.location.streetAddress(),
      vendorName: faker.company.name(),
      website: faker.internet.url()
    };

    // Merge overrides if user wants to replace any field
    return { ...vendorData, ...overrides };
  }
   static updateVendorPayload(overrides = {}) {
      const updatedData = {
    category: "Updated Electronics",
    city: faker.location.city(),
    country: faker.location.country(),
    email: faker.internet.email(),              // must be valid
    mobileNo: faker.string.numeric(10),         // force 10 digits only
    postalCode: faker.string.alphanumeric(5),   // keep simple if API picky
    state: faker.location.state(),
    street: faker.location.streetAddress(),
    vendorName: `Updated ${faker.company.name()}`,
    website: faker.internet.url()
  };
    return { ...updatedData, ...overrides };
  }
}



module.exports = VendorHelper;