import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Helper function to handle validation errors
const handleValidationError = (
  error: Joi.ValidationError,
  res: Response
): void => {
  const errors = error.details.map((detail) => ({
    field: detail.path.join("."),
    message: detail.message,
  }));

  res.status(400).json({
    success: false,
    message: "Validation failed",
    errors,
  });
};

// Validate request body against Joi schema
export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      handleValidationError(error, res);
      return;
    }

    next();
  };
};

// Validate request params against Joi schema
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.params, { abortEarly: false });

    if (error) {
      handleValidationError(error, res);
      return;
    }

    next();
  };
};

// Validate request query against Joi schema
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query, { abortEarly: false });

    if (error) {
      handleValidationError(error, res);
      return;
    }

    next();
  };
};
