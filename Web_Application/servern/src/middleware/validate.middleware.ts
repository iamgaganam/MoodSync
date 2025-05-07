import { Request, Response, NextFunction } from "express";
import Joi from "joi";

/**
 * Middleware to validate request body against a Joi schema
 * @param schema Joi validation schema
 */
export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to validate request params against a Joi schema
 * @param schema Joi validation schema
 */
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.params, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to validate request query against a Joi schema
 * @param schema Joi validation schema
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
      return;
    }

    next();
  };
};
