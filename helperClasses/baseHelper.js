const config  = require("../test-data/contacts-json/config.json")
class baseHelper {
    // Function to generate random email
        getAuthHeaders() {
        return {
          Authorization: `Basic ${Buffer.from(
            `${config.username}:${config.password}`
          ).toString("base64")}`,
          "Content-Type": "application/json",
        };
      }
      
    getUnauthorizedHeaders() {
      return {
        Authorization: "Basic invalidtoken",
        "Content-Type": "application/json",
      };
    }
  }
  
  
    module.exports = baseHelper;
    
    