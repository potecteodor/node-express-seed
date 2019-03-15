import * as express from 'express'
import { SampleCtrl } from './app/controller/sample.ctrl'
export class ApiRouting {
  public static ConfigureRouters(app: express.Router) {
    // sample
    app.use(SampleCtrl.route, new SampleCtrl().router)
    // common
    // app.use(SetupCtrl.route, new SetupCtrl().router)
    // app.use(RegisterCtrl.route, new RegisterCtrl().router)
    // admin
    // app.use(AdminAuthCtrl.route, new AdminAuthCtrl().router)
    // app.use(AdminStaffCtrl.route, new AdminStaffCtrl().router)
    // upload files
    // app.use(UploadFileCtrl.route, new UploadFileCtrl().router)
    // auth
    // app.use(AuthCtrl.route, new AuthCtrl().router)
    // app specific
    // app.use(CompanySystemCtrl.route, new CompanySystemCtrl().router)
    // translation mode
    // app.use(I18nCtrl.route, new I18nCtrl().router)
  }
}
