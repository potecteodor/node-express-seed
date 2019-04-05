import * as express from 'express'
import { SampleCtrl } from './app/controller/sample.ctrl'
import { TaskCtrl } from './app/controller/task.ctrl'
import { UserCtrl } from './app/controller/user.ctrl'
import { AuthCtrl } from './app/controller/auth.ctrl'
export class ApiRouting {
  public static ConfigureRouters(app: express.Router) {
    // sample
    app.use(SampleCtrl.route, new SampleCtrl().router)
    app.use(TaskCtrl.route, new TaskCtrl().router)
    app.use(UserCtrl.route, new UserCtrl().router)
    app.use(AuthCtrl.route, new AuthCtrl().router)
  }
}
