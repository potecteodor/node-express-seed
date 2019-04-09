import { Request, Response, Router } from 'express'
import { Api } from '../../core/services/api'
import { ProjectModel } from '../model/project.model'

export class ProjectCtrl {
  public static route = '/project'
  public router: Router = Router()

  constructor() {
    this.router.get('/getAll/:id', this.getAll)
    this.router.post('/updateProfile', this.updateProfile)
  }

  /**
   * Get all projects created by logged user
   * @param req
   * @param res
   */
  getAll(req: Request, res: Response) {
    const id = req.params.id
    const m = new ProjectModel()
    const sql = `Select * From project Where created_by_id=${id}`
    m.executeQuery(sql, true).then(
      result => {
        Api.ok(req, res, result)
      },
      error => {
        Api.serverError(req, res, error)
      }
    )
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
