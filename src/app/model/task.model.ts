import { BaseModel } from './base.model'

export class TaskModel extends BaseModel {
  tableName: string = 'task'

  pkName: string = 'id'
}
