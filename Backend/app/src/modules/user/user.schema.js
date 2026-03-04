import joi from "joi";

// signup schema
export const signupSchema = joi
  .object({
    email: joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
    age: joi.number().min(18).max(60).messages({
      "number.min": "Age must be between 18 and 60",
      "number.max": "Age must be between 18 and 60",
      "number.base": "Age must be a number",
    }),
    userName: joi.string().min(5).max(20).messages({
      "string.min": "Username must be between 5 and 20 characters",
      "string.max": "Username must be between 5 and 20 characters",
    }),
    password: joi.string().min(3).max(30).required().messages({
      "string.min": "Password must be at least 3 characters",
      "string.max": "Password must be less than 30 characters",
      "any.required": "Password is required",
    }),
    confirmPass: joi.string().valid(joi.ref("password")).messages({
      "any.only": "Passwords do not match",
    }),
    gender: joi.string().messages({
      "string.base": "Please select a valid gender",
    }),
    phone: joi.string().pattern(new RegExp("^01[0-2,5]{1}[0-9]{8}")).messages({
      "string.pattern.base":
        "Please enter a valid Egyptian phone number (e.g. 01012345678)",
    }),
  })
  .required();

// login schema
export const loginSchema = joi
  .object({
    email: joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
    password: joi.string().min(3).max(30).required().messages({
      "string.min": "Password must be at least 3 characters",
      "string.max": "Password must be less than 30 characters",
      "any.required": "Password is required",
    }),
    confirmPass: joi.string().valid(joi.ref("password")).messages({
      "any.only": "Passwords do not match",
    }),
  })
  .required();

export const changePasswordSchema = joi.object({
  oldPass: joi.string().required().messages({
    "any.required": "Current password is required",
  }),
  newPass: joi.string().min(3).max(30).required().messages({
    "string.min": "New password must be at least 3 characters",
    "string.max": "New password must be less than 30 characters",
    "any.required": "New password is required",
  }),
  confirmPass: joi.string().valid(joi.ref("newPass")).messages({
    "any.only": "Passwords do not match",
  }),
});

export const updateUserSchema = joi.object({
  age: joi.number().min(18).max(60).messages({
    "number.min": "Age must be between 18 and 60",
    "number.max": "Age must be between 18 and 60",
    "number.base": "Age must be a number",
  }),
  firstName: joi.string().messages({
    "string.base": "First name must be text",
  }),
  lastName: joi.string().messages({
    "string.base": "Last name must be text",
  }),
  email: joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
});

export const activationShema = joi
  .object({
    token: joi.string().required().messages({
      "any.required": "Activation token is missing",
    }),
  })
  .required();

export const forgetCodeSchema = joi
  .object({
    email: joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
  })
  .required();

export const resetPasswordSchema = joi
  .object({
    email: joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
    code: joi.string().length(5).required().messages({
      "string.length": "Reset code must be exactly 5 digits",
      "any.required": "Reset code is required",
    }),
    password: joi.string().min(3).max(30).required().messages({
      "string.min": "Password must be at least 3 characters",
      "string.max": "Password must be less than 30 characters",
      "any.required": "Password is required",
    }),
    confirmPass: joi.string().valid(joi.ref("password")).required().messages({
      "any.only": "Passwords do not match",
      "any.required": "Please confirm your password",
    }),
  })
  .required();
