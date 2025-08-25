const { faker } = require('@faker-js/faker');
const { DateTime } = require("luxon");
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();


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
      vendorName: `Vendor_${faker.number.int({ min: 1000, max: 9999 })}`,
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
  //   static createVendorPayloadUITesting(overrides = {}) {
  //   const vendorData = {
  //     category: "Electronics",
  //     city: faker.location.city(),
  //     country: faker.location.country(),
  //     email: faker.internet.email(),
  //     mobileNo: faker.phone.number("##########"),
  //     postalCode: faker.location.zipCode(),
  //     state: faker.location.state(),
  //     street: faker.location.streetAddress(),
  //     vendorName: faker.company.name(),
  //     website: faker.internet.url()
  //   };

  //   // Merge overrides if user wants to replace any field
  //   return { ...vendorData,...vendorName, ...overrides };
  // }
  static async getConnection() {
    return mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: process.env.MYSQL_PORT
    });
  }

  static async getVendorByName(vendorName) {
    const connection = await this.getConnection();
    const [rows] = await connection.execute(
      `SELECT vendor_name FROM crm.vendor WHERE vendor_name = ?`,
      [vendorName]
    );
    await connection.end();
    return rows;
  }
   
}



module.exports = VendorHelper;