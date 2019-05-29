import { Request, Response, Router } from 'express'
import { Api } from '../../core/services/api'
import { UserModel } from '../model/user.model'

export class UserCtrl {
  public static route = '/user'
  public router: Router = Router()

  constructor() {
    this.router.post('/updateProfile', this.updateProfile)
    this.router.get('/getOne/:id', this.getOne)
  }

  getOne(req: Request, res: Response) {
    try {
      const id = req.params.id
      const sql = `Select * From user Where id = ${id}`
      const m = new UserModel()
      m.executeQuery(sql, true).then(result => {
        Api.ok(req, res, result)
      })
    } catch (err) {
      Api.serverError(req, res, err)
    }
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
