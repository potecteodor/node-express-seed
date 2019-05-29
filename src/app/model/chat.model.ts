import { BaseModel } from './base.model'

export class ChatModel extends BaseModel {
  tableName: string = 'chat'

  pkName: string = 'id'
}
