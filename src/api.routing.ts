import * as express from 'express'
import { AuthCtrl } from './app/controller/auth.ctrl'
import { CollaboratorCtrl } from './app/controller/collaborator.ctrl'
import { ProjectCtrl } from './app/controller/project.ctrl'
import { SampleCtrl } from './app/controller/sample.ctrl'
import { TaskCtrl } from './app/controller/task.ctrl'
import { UserCtrl } from './app/controller/user.ctrl'
export class ApiRouting {
  public static ConfigureRouters(app: express.Router) {
    // sample
    app.use(SampleCtrl.route, new SampleCtrl().router)
    app.use(TaskCtrl.route, new TaskCtrl().router)
    app.use(UserCtrl.route, new UserCtrl().router)
    app.use(AuthCtrl.route, new AuthCtrl().router)
    app.use(ProjectCtrl.route, new ProjectCtrl().router)
    app.use(CollaboratorCtrl.route, new CollaboratorCtrl().router)
  }
}
