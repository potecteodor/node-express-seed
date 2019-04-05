import { Request, Response, Router } from 'express'
import { Api } from '../../core/services/api'

export class UserCtrl {
  public static route = '/user'
  public router: Router = Router()

  constructor() {
    this.router.post('/updateProfile', this.updateProfile)
  }

  /**
   * test a dummy get
   *
   * @param req
   * @param res
   */
  updateProfile(req: Request, res: Response) {
    Api.ok(req, res, 'Hello')
  }
}
