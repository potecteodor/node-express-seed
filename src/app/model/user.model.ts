import { BaseModel } from './base.model'

export class UserModel extends BaseModel {
  tableName: string = 'user'

  pkName: string = 'id'
}
