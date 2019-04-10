import { Request, Response, Router } from 'express'
import { Api } from '../../core/services/api'
import { CollaboratorModel } from '../model/collaborator.model'
import { UserModel } from '../model/user.model'

export class CollaboratorCtrl {
  public static route = '/collaborator'
  public router: Router = Router()

  constructor() {
    this.router.get('/getAll/:id', this.getAll)
    this.router.post('/addCollaborator', this.addCollaborator)
    this.router.post('/checkEmail', this.checkEmail)
    this.router.post('/invite', this.invite)
    this.router.post('/delete', this.delete)
  }

  /**
   * Delete Collaborator by id
   * @param req
   * @param res
   */
  delete(req: Request, res: Response) {
    try {
      const data = req.body.data
      const my_id = data.my_id
      const collab_id = data.collab_id
      const m = new CollaboratorModel()
      const sql = `DELETE FROM collaborator WHERE my_id=${my_id} AND collab_id=${collab_id}`
      m.executeQuery(sql).then(result => {
        Api.ok(req, res, true)
      })
    } catch (err) {
      Api.serverError(req, res, err)
    }
  }

  invite(req: Request, res: Response) {
    Api.ok(req, res, true)
  }

  /**
   * Get all Collaborators
   * @param req
   * @param res
   */
  getAll(req: Request, res: Response) {
    const id = req.params.id
    const m = new CollaboratorModel()
    const sql = `Select * From user Inner JOIN collaborator ON collaborator.collab_id=user.id Where collaborator.my_id=${id}`
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
   * Check if email is unique in user database
   *
   * @param req
   * @param res
   */
  checkEmail(req: Request, res: Response) {
    const email = req.body.email
    const my_id = req.body.my_id
    const m = new UserModel()
    const sql = `Select * From user Where email = '${email}'`
    // const sql2 = `Select * From collaborator JOIN user Where collaborator.my_id=${my_id} AND user.email='${email}'`
    m.executeQuery(sql, true).then(
      result => {
        if (result[0]) {
          const sql2 = `Select * From collaborator Where my_id=${my_id} AND collab_id=${
            result[0].id
          }`
          m.executeQuery(sql2, true).then(r => {
            if (r[0]) {
              console.log(r[0])
              Api.ok(req, res, 'exist')
            } else {
              Api.ok(req, res, result[0])
            }
          })
        } else {
          Api.ok(req, res, false)
        }
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
  addCollaborator(req: Request, res: Response) {
    try {
      const my_id = req.body.my_id
      const collab_id = req.body.collab_id
      const m = new CollaboratorModel()
      const sql = `INSERT INTO collaborator(my_id, collab_id) VALUES(${my_id}, ${collab_id});`
      m.executeQuery(sql).then(result => {
        Api.ok(req, res, true)
      })
    } catch (err) {
      Api.serverError(req, res, err)
    }
  }
}
