import { Request, Response, Router } from 'express'
import { Api } from '../../core/services/api'
import { ChatModel } from '../model/chat.model'

export class ChatCtrl {
  public static route = '/chat'
  public router: Router = Router()

  constructor() {
    this.router.post('/saveMessage', this.saveMessage)
    this.router.post('/getMessage', this.getMessage)
  }

  getMessage(req: Request, res: Response) {
    try {
      const data = req.body
      const to = JSON.stringify(data.to_who)
      const from = JSON.stringify(data.from_who)
      const sql = `Select * From chat WHERE (JSON_CONTAINS(from_who, '${from}') AND JSON_CONTAINS(to_who, '${to}')) OR (JSON_CONTAINS(from_who, '${to}') AND JSON_CONTAINS(to_who, '${from}'));`
      console.log('sql', sql)
      const m = new ChatModel()
      m.executeQuery(sql, true).then(result => {
        Api.ok(req, res, result)
      })
    } catch (err) {
      Api.serverError(req, res, err)
    }
  }

  saveMessage(req: Request, res: Response) {
    try {
      const data = req.body
      const to = JSON.stringify(data.to_who)
      const from = JSON.stringify(data.from_who)
      const sql = `INSERT INTO chat(message,from_who,to_who) VALUES('${data.message}','${from}','${to}');`
      console.log(sql)
      const m = new ChatModel()
      m.executeQuery(sql).then(result => {
        Api.ok(req, res, result)
      })
    } catch (err) {
      Api.serverError(req, res, err)
    }
  }
}
