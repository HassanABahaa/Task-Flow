import joi from "joi";

// signup schema
export const signupSchema = joi
  .object({
    userName: joi
      .string()
      .min(5)
      .max(20)
      .required()
      .pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/)
      .messages({
        "string.min": "Username must be at least 5 characters",
        "string.max": "Username must be less than 20 characters",
        "string.pattern.base": "Username can only contain letters",
        "any.required": "Username is required",
      }),
    email: joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
    password: joi
      .string()
      .min(8)
      .max(30)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters",
        "string.pattern.base":
          "Password must contain uppercase, lowercase, and a number",
        "any.required": "Password is required",
      }),
    confirmPass: joi.string().valid(joi.ref("password")).required().messages({
      "any.only": "Passwords do not match",
      "any.required": "Please confirm your password",
    }),
    age: joi.number().integer().min(18).max(60).messages({
      "number.min": "Age must be between 18 and 60",
      "number.max": "Age must be between 18 and 60",
      "number.integer": "Age must be a whole number",
    }),
    gender: joi.string().valid("male", "female").messages({
      "any.only": "Gender must be male or female",
    }),
    phone: joi
      .string()
      .pattern(/^01[0-2,5]{1}[0-9]{8}$/)
      .messages({
        "string.pattern.base": "Please enter a valid Egyptian phone number",
      }),
  })
  .required();

export const loginSchema = joi
  .object({
    email: joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
    password: joi.string().required().messages({
      "any.required": "Password is required",
    }),
  })
  .required();

export const changePasswordSchema = joi.object({
  oldPass: joi.string().required().messages({
    "any.required": "Current password is required",
  }),
  newPass: joi
    .string()
    .min(8)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, and a number",
      "any.required": "New password is required",
    }),
  confirmPass: joi.string().valid(joi.ref("newPass")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Please confirm your password",
  }),
});

export const updateUserSchema = joi.object({
  firstName: joi.string().min(2).max(20).optional().messages({
    "string.min": "First name must be at least 2 characters",
  }),
  lastName: joi.string().min(2).max(20).optional().messages({
    "string.min": "Last name must be at least 2 characters",
  }),
  email: joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  age: joi.number().integer().min(18).max(60).optional().messages({
    "number.min": "Age must be between 18 and 60",
    "number.max": "Age must be between 18 and 60",
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
    code: joi
      .string()
      .length(5)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.length": "Reset code must be exactly 5 digits",
        "string.pattern.base": "Reset code must contain numbers only",
        "any.required": "Reset code is required",
      }),
    password: joi
      .string()
      .min(8)
      .max(30)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters",
        "string.pattern.base":
          "Password must contain uppercase, lowercase, and a number",
        "any.required": "Password is required",
      }),
    confirmPass: joi.string().valid(joi.ref("password")).required().messages({
      "any.only": "Passwords do not match",
      "any.required": "Please confirm your password",
    }),
  })
  .required();
