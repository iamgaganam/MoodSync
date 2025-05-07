import Joi from "joi";
import { Request, Response, NextFunction } from "express";

// Registration validation schema
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least {#limit} characters long",
    "string.max": "Name cannot exceed {#limit} characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  mobileNumber: Joi.string().required().messages({
    "string.empty": "Mobile number is required",
    "any.required": "Mobile number is required",
  }),
  emergencyContact: Joi.string().required().messages({
    "string.empty": "Emergency contact is required",
    "any.required": "Emergency contact is required",
  }),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\\d!@#$%^&*(),.?":{}|<>]{8,}$'
      )
    )
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least {#limit} characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      "any.required": "Password is required",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "string.empty": "Confirm password is required",
    "any.only": "Passwords do not match",
    "any.required": "Confirm password is required",
  }),
  role: Joi.string().valid("user", "doctor", "admin").default("user").messages({
    "any.only": "Role must be one of: user, doctor, admin",
  }),
});

// Login validation schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
  rememberMe: Joi.boolean().default(false),
});

// Password reset request validation schema
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
});

// Password reset validation schema
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "Token is required",
    "any.required": "Token is required",
  }),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\\d!@#$%^&*(),.?":{}|<>]{8,}$'
      )
    )
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least {#limit} characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      "any.required": "Password is required",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "string.empty": "Confirm password is required",
    "any.only": "Passwords do not match",
    "any.required": "Confirm password is required",
  }),
});

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errorMessage,
      });
      return;
    }
    next();
  };
};
