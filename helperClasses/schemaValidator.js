const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

/**
 * Validates data against a JSON schema.
 * If invalid, logs errors and returns false.
 */
function validateSchema(schema, data) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    console.error("Schema validation errors:", validate.errors);
  }
  return valid;
}

module.exports = { validateSchema };
