import { Request, Response, Router } from 'express'
import { Api } from '../../core/services/api'
import Crypt from '../../core/services/crypt'
import { SampleModel } from '../model/sample.model'
import AuthService from '../services/auth.service'

export class SampleCtrl {
  public static route = '/sample'
  public router: Router = Router()

  constructor() {
    this.router.get('/', this.sayHello)
    this.router.post('/login', this.doLogin)
    this.router.get('/getUser', this.getUser)
    // db
    this.router.get('/createDb', this.createDb)
    this.router.post('/insert', this.doInsert)
    this.router.get('/getAll', this.getAll)
    this.router.get('/getOne/:id', this.getOne)
    this.router.put('/update/:id', this.doUpdate)
    this.router.delete('/delete/:id', this.doDelete)
  }

  /**
   * delete row by id
   *
   * @param req
   * @param res
   */
  doDelete(req: Request, res: Response) {
    const id = req.params.id
    const m = new SampleModel()
    m.deleteByPk(id).then(
      result => {
        Api.ok(req, res, result)
      },
      error => {
        Api.serverError(req, res, error)
      }
    )
  }

  /**
   * update one row
   *
   * @param req
   * @param res
   */
  doUpdate(req: Request, res: Response) {
    const id = req.params.id
    const data = req.body
    data['id'] = id
    const m = new SampleModel()
    m.save(data).then(
      result => {
        Api.ok(req, res, result)
      },
      error => {
        Api.serverError(req, res, error)
      }
    )
  }

  /**
   * get one row
   *
   * @param req
   * @param res
   */
  getOne(req: Request, res: Response) {
    const id = req.params.id
    const m = new SampleModel()
    m.getById(id).then(
      result => {
        Api.ok(req, res, result)
      },
      error => {
        Api.serverError(req, res, error)
      }
    )
  }

  /**
   * get all rows
   *
   * @param req
   * @param res
   */
  async getAll(req: Request, res: Response) {
    const m = new SampleModel()
    m.getAll().then(
      result => Api.ok(req, res, result),
      error => Api.serverError(req, res, error)
    )
  }

  /**
   * create a row entry
   *
   * @param req
   * @param res
   */
  doInsert(req: Request, res: Response) {
    const d = req.body
    const db = new SampleModel()
    db.save(d).then(
      result => {
        return Api.ok(req, res, result)
      },
      error => {
        Api.serverError(req, res, error)
      }
    )
  }

  /**
   * check db config and then...
   * create a simple database
   *
   * @param req
   * @param res
   */
  createDb(req: Request, res: Response) {
    const db = new SampleModel()
    db.resetDb().then(
      result => Api.ok(req, res, result),
      error => Api.serverError(req, res, error)
    )
  }

  /**
   * decode and get a user
   *
   * @param req
   * @param res
   */
  getUser(req: Request, res: Response) {
    Api.ok(req, res, AuthService.loginInfo)
  }

  /**
   * simulate a login
   *
   * @param req
   * @param res
   */
  doLogin(req: Request, res: Response) {
    const d = req.body
    if (d.email === 'florin@doitdev.ro' && d.password === 'flo') {
      return Api.ok(req, res, Crypt.crypt({ id: 1, user: 'florin' }))
    }
    // U2FsdGVkX19fln+9wKCib9dvtpp+Wdgj3qMY5ZiUqyoldApppzZ9oldAppuliFYvrfC6YQHJ2K
    Api.serverError(req, res, 'Bad username/password.')
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
