const DUPLICATE_KEY_ERROR_CODE = 11000;

// MongoDB throws a duplicate-key error (code 11000) if two requests race
// past a pre-check at nearly the same time - keyPattern tells us which
// unique index was violated so a race can still get a clear, field-specific
// response instead of falling through to a generic 500.
export const getDuplicateKeyField = (error) => {
  if (!error || error.code !== DUPLICATE_KEY_ERROR_CODE) {
    return null;
  }

  const fields = Object.keys(error.keyPattern || {});
  return fields[0] || null;
};

export const duplicateUserMessage = (field) =>
  field === "username" ? "Username already taken" : "User already exists";
