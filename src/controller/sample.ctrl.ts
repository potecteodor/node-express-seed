import { Router, Request, Response, NextFunction } from "express";
import { Person } from "../models/person.model";
import { Api } from "../helpers";
import { User, IUserModel } from "../schemas/user";

export class SampleController {
  public static route = "/samples";

  public router: Router = Router();

  constructor() {
    this.router.get("/", this.getSamples);
    this.router.get("/:id", this.getUser);
  }

  getUser(req: Request, response: Response, next: NextFunction) {
    let u = new User({ firstName: "florin" });

    u.save();

    const id = req.params["id"];
    console.log(id);
    // find user
    User.findById(id).then((user: IUserModel) => {
      console.log(user);
      // verify user was found
      if (user === null) {
        next();
        return;
      }
      Api.ok(req, response, user);
      next();
    });
  }

  getSamples(req: Request, response: Response, next: NextFunction): any {
    const p = req.body;

    let total = Person.countDocuments({}, (err, cnt) => {
      if (err) {
        next(err);
      }
      let q = Person.find({})
        .limit(25)
        .skip(0);

      q.exec((error, persons) => {
        if (error) {
          next(error);
        }
        return Api.ok(req, response, {
          total_rows: cnt,
          rows: persons
        });
      });
    });
  }
}
