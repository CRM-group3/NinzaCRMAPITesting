// helpers/VendorPayload.js
const { faker } = require('@faker-js/faker');

class VendorPayload {
  static createVendorPayload() {
    return {
      category: faker.commerce.department(),
      city: faker.address.city(),
      country: faker.address.country(),
      email: faker.internet.email(),
      mobileNo: faker.phone.number('##########'),
      postalCode: faker.address.zipCode(),
      state: faker.address.state(),
      street: faker.address.streetAddress(),
      vendorName: faker.company.name(),
      website: faker.internet.url(),
    };
  }
}

module.exports = VendorPayload;