import { NextFunction, Request, Response } from 'express'
import { AppSetting } from '../../config'
import { Api } from '../../core/services/api'
import Crypt from '../../core/services/crypt'

const publicRoutes = ['favicon.ico', 'swagger', 'register', 'login']

const publicMethods = [
  'sample/login',
  'task/test',
  'auth/register',
  'auth/login',
  'auth/checkEmail',
  'auth/activate',
  'auth/resendActivation',
  'auth/forgotPassword',
  'auth/resetPassword',
  'auth/checkPassword',
  'auth/changePassword',
]

const EXPIRATION_MINUTES = 15

export default class AuthService {
  static loginInfo = null

  /**
   * security header check
   *
   * @param req
   * @param res
   * @param next
   */
  static checkHeader(req: Request, res: Response, next: NextFunction): any {
    if (req.method === 'OPTIONS') {
      return next()
    } else {
      const urlArr = req.url.split('/')
      if (publicRoutes.indexOf(urlArr[1]) >= 0) {
        console.log('auth pass because of route', urlArr[1])
        return next()
      }
      if (publicMethods.indexOf(urlArr[1] + '/' + urlArr[2]) >= 0) {
        console.log('auth pass because of method', urlArr[1] + '/' + urlArr[2])
        return next()
      }
      if (publicMethods.indexOf(urlArr[1] + '/' + urlArr[2] + '/' + urlArr[3]) >= 0) {
        console.log(
          'auth pass because of method' + urlArr[1] + '/' + urlArr[2] + '/' + urlArr[3]
        )
        return next()
      }
      let tk = req.headers[AppSetting.getConfig().crypt.hh.toLowerCase()]
      if (!tk || tk.length < 1) {
        return Api.serverError(req, res, {
          message: '',
          name: '',
          code: 'unauthorized',
        })
      } else {
        const login_id = Crypt.decrypt(tk)
        AuthService.loginInfo = JSON.parse(login_id)
        console.log(AuthService.loginInfo)
        return next()

        /* const ld = new LoginDao()
        ld.getLoginInfo(+login_id).then((login: any) => {
          if (!login) {
            return Api.serverError(req, res, {
              code: 'NotLoggedIn',
              message: 'Your login id is not longer valid! Please re-login.',
            })
          }
          const diffMins = Util.diffToMinutes(login.updated_at)
          if (diffMins > EXPIRATION_MINUTES) {
            LoginDao.dbo.destroy({ where: { id: +login_id } })
            return Api.validationError(req, res, {
              code: 'LoginExpired',
              message: 'Your login was expired! Please re-login.',
            })
          }
          LoginDao.dbo.update(
            { instance: parseInt(login.instance) + 1 },
            { where: { id: +login_id } }
          )
          // keep data
          const dataToKeep: ILoginInfo = {
            id: +login.id,
            uid: +login.uid,
            cid: +login.cid,
            type: login.type,
            role: login.role,
            displayName: login.first_name + ' ' + login.last_name,
          }
          // console.log('logged user data: ', dataToKeep)
          AuthService.loginInfo = dataToKeep
          return next()
        }) */
      }
    }
  }
}
