import { Request, Response, Router } from 'express'
import { Api } from '../../core/services/api'
import Crypt from '../../core/services/crypt'
import { IUser } from '../entities/user.interface'
import AuthMail from '../helpers/mail/auth.mail'
import { UserModel } from '../model/user.model'

export class AuthCtrl {
  public static route = '/auth'
  public router: Router = Router()

  constructor() {
    this.router.post('/register', this.register)
    this.router.post('/login', this.login)
    this.router.post('/checkEmail', this.checkEmail)
    this.router.post('/resendActivation', this.resendActivation)
    this.router.post('/activate/:key', this.activate)
    this.router.post('/forgotPassword', this.forgotPassword)
    this.router.post('/resetPassword', this.resetPassword)
  }

  /**
   * resetPassword
   *
   * @param req
   * @param res
   */
  resetPassword(req: Request, res: Response) {
    const email = req.body.email
    const password = Crypt.sha1(req.body.password)
    const m = new UserModel()
    const sql = `UPDATE user SET password = '${password}' WHERE email='${email}'`
    try {
      m.executeQuery(sql).then(result => {
        Api.ok(req, res, true)
      })
    } catch (err) {
      Api.serverError(req, res, err)
    }
  }

  /**
   * forgotPassword
   *
   * @param req
   * @param res
   */
  forgotPassword(req: Request, res: Response) {
    try {
      const email = req.body.email
      const m = new UserModel()
      AuthMail.resetPasswordMail(email)
      Api.ok(req, res, true)
    } catch (err) {
      Api.serverError(req, res, err)
    }
  }

  /**
   * resendActivation
   *
   * @param req
   * @param res
   */
  resendActivation(req: Request, res: Response) {
    try {
      const email = req.body.email
      const m = new UserModel()
      const sql = `Select * From user Where email = '${email}'`
      m.executeQuery(sql, true).then(result => {
        AuthMail.sendActivationEmail(result[0].id, email)
        Api.ok(req, res, result)
      })
    } catch (err) {
      Api.serverError(req, res, err)
    }
  }

  /**
   * Activate
   *
   * @param req
   * @param res
   */
  activate(req: Request, res: Response) {
    const key = Crypt.decrypt(req.params.key, true)
    const id = key.key
    const m = new UserModel()
    const sql1 = `Select * From user Where id=${id} AND status='confirmed'`
    const sql2 = `UPDATE user SET status = 'confirmed' WHERE id=${id}`
    m.executeQuery(sql1, true).then(result => {
      if (result.length === 0) {
        m.executeQuery(sql2, true).then(
          result => {
            Api.ok(req, res, true)
          },
          error => {
            Api.serverError(req, res, error)
          }
        )
      } else {
        Api.ok(req, res, false)
      }
    })
  }

  /**
   * Login
   *
   * @param req
   * @param res
   */
  login(req: Request, res: Response) {
    const email = req.body.email
    const password = Crypt.sha1(req.body.password)
    const m = new UserModel()
    const sql = `Select * From user Where email = '${email}' AND password = '${password}'`
    m.executeQuery(sql, true).then(
      result => {
        if (result.length === 0) {
          Api.ok(req, res, false)
        } else {
          if (result[0].status === 'confirmed') {
            Api.ok(req, res, result[0])
          } else {
            Api.ok(req, res, 'unconfirmed')
          }
        }
      },
      error => {
        Api.serverError(req, res, error)
      }
    )
  }

  /**
   * Register a user - Insert in user database
   *
   * @param req
   * @param res
   */
  register(req: Request, res: Response) {
    const newUser: IUser = req.body
    newUser['password'] = Crypt.sha1(newUser.password)
    newUser['status'] = 'unconfirmed'
    delete newUser['repeat_password']
    const m = new UserModel()
    m.save(newUser).then(
      result => {
        const sql = `Select * From user Where email = '${newUser['email']}'`
        m.executeQuery(sql, true).then(
          result => {
            AuthMail.sendActivationEmail(result[0].id, newUser['email'])
            return Api.ok(req, res, result)
          },
          error => {
            Api.serverError(req, res, {
              err: error,
              msg: 'Register Failed!',
            })
          }
        )
      },
      error => {
        Api.serverError(req, res, { err: error, msg: 'Register Failed!' })
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
    const m = new UserModel()
    const sql = `Select * From user Where email = '${email}'`
    m.executeQuery(sql).then(
      result => {
        if (result[0].length > 0) {
          Api.ok(req, res, false)
        } else {
          Api.ok(req, res, true)
        }
      },
      error => {
        Api.serverError(req, res, error)
      }
    )
  }
}
