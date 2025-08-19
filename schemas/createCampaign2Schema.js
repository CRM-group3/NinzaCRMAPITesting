// campaignSchemaNullable.js
// @ts-nocheck
const campaignSchemaNullable = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Campaign Response Nullable",
  type: "object",
  properties: {
    campaignId: { type: "string" },
    campaignName: { type: "string" },
    campaignStatus: { type: ["string", "null"] },
    targetSize: { type: "integer" },
    expectedCloseDate: { type: ["string", "null"] },
    targetAudience: { type: ["string", "null"] },
    description: { type: ["string", "null"] }
  },
  required: [
    "campaignId",
    "campaignName",
    "targetSize"
  ]
};

module.exports = campaignSchemaNullable;