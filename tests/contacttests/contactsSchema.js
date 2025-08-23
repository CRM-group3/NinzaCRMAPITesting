module.exports = {
    type: "object",
    properties: {
      campaign: {
        type: "object",
        properties: {
          campaignId: { type: "string" },
          campaignName: { type: "string" },
          campaignStatus: { type: "string" },
          targetSize: { type: "integer" },
          expectedCloseDate: { type: "string", format: "date" },
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
      },
      contactName: { type: "string" },
      department: { type: "string" },   // optional
      email: { type: "string", format: "email" },
      mobile: { type: "string" },
      officePhone: { type: "string" },  // optional
      organizationName: { type: "string" },
      title: { type: "string" }
    },
    required: [
      "campaign",
      "contactName",
      "email",
      "mobile",
      "organizationName",
      "title"
    ]
  };
  