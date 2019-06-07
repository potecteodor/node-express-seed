import { Request, Response, Router } from 'express'
import { AppSetting, IConfig } from '../../config'
import { Api } from '../../core/services/api'
import { UserModel } from '../model/user.model'

const formidable = require('formidable')
const fs = require('fs')

export class UserCtrl {
  public static route = '/user'
  public router: Router = Router()

  constructor() {
    this.router.post('/changeAvatar', this.changeAvatar)
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
  changeAvatar(req: Request, res: Response) {
    const form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
      const config: IConfig = AppSetting.getConfig()
      const newfileName = new Date().getTime() + '_' + files.file.name
      const oldFileName = files.file.name
      const fileSize = files.file.size
      const oldpath = files.file.path
      const newpath = config.uploadConfig + newfileName
      fs.copyFile(oldpath, newpath, err => {
        if (err) throw err
        console.log(fileSize, files.file)
      })
      const userID = req.query.user
      const m = new UserModel()
      const path = 'assets/images/' + newfileName
      const sql = `UPDATE user SET avatar = '${path}' WHERE id=${userID}`
      m.executeQuery(sql).then(result => {
        Api.ok(req, res, true)
      })
    })
  }
}
