// @ts-nocheck
const campaignSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Campaign Response",
  type: "object",
  properties: {
    campaignId: { type: "string" },
    campaignName: { type: "string" },
    campaignStatus: { type: "string" },
    targetSize: { type: "integer" },
    expectedCloseDate: { type: "string" },
    targetAudience: { type: "string" },
    description: { type: "string" }
  },
  required: [
    "campaignId",
    "campaignName",
    "campaignStatus",
    "targetSize",
    "expectedCloseDate",
    "targetAudience",
    "description"
  ]
};

module.exports = campaignSchema;