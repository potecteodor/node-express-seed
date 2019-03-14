import * as express from "express";
import { CustomerController } from "./controller/customer.controller";
import { Api } from "./helpers";
import { SampleController } from "./controller/sample.ctrl";
export class ApiRouting {
  public static ConfigureRouters(app: express.Router) {
    app.use(CustomerController.route, new CustomerController().router);
    app.use(SampleController.route, new SampleController().router);
  }
}
