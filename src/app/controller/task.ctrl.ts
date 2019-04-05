import { Request, Response, Router } from 'express'
import { Api } from '../../core/services/api'

export class TaskCtrl {
  public static route = '/task'
  public router: Router = Router()

  constructor() {
    this.router.get('/test', this.sayHello)
  }

  /**
   * test a dummy get
   *
   * @param req
   * @param res
   */
  sayHello(req: Request, res: Response) {
    Api.ok(req, res, 'Hello')
  }
}
