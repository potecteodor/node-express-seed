import { Router, Request, Response, NextFunction, Express } from "express";
import { AppSetting } from "./../config";
import { CUSTOMER_DOC } from "../swagger-docs";
const swaggerUi = require("swagger-ui-express");

export class SwaggerController {
  public static configure(app: Express) {
    app.use(
      "/swagger/customer",
      swaggerUi.serve,
      swaggerUi.setup(CUSTOMER_DOC)
    );
  }
}
